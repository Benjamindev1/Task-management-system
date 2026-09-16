import pool from '../db.js';

function mapTaskRow(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    priority: row.priority,
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : null,
  };
}

export async function listTasks({ status, priority, q, page = 1, limit = 10 }) {
  const pageNumber = Math.max(1, Number(page) || 1);
  const limitNumber = Math.max(1, Number(limit) || 10);
  const offset = (pageNumber - 1) * limitNumber;

  const conditions = [];
  const values = [];
  let index = 1;

  if (status && status !== 'all') {
    conditions.push(`status = $${index}`);
    values.push(status);
    index += 1;
  }

  if (priority && priority !== 'all') {
    conditions.push(`priority = $${index}`);
    values.push(priority);
    index += 1;
  }

  if (q && q.trim()) {
    conditions.push(`(title ILIKE $${index} OR description ILIKE $${index})`);
    values.push(`%${q.trim()}%`);
    index += 1;
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM tasks
    ${whereClause}
  `;

  const result = await pool.query(countQuery, values);
  const total = Number(result.rows[0].total);

  const query = `
    SELECT
      id,
      title,
      description,
      status,
      priority,
      created_at
    FROM tasks
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT $${index} OFFSET $${index + 1}
  `;

  values.push(limitNumber, offset);

  const { rows } = await pool.query(query, values);

  return {
    tasks: rows.map(mapTaskRow),
    total,
    page: pageNumber,
    limit: limitNumber,
    totalPages: Math.max(1, Math.ceil(total / limitNumber)),
  };
}

export async function findTaskById(id) {
  const { rows } = await pool.query(
    `
      SELECT id, title, description, status, priority, created_at
      FROM tasks
      WHERE id = $1
    `,
    [id]
  );

  return rows[0] ? mapTaskRow(rows[0]) : null;
}

export async function createTask({ title, description, status, priority }) {
  const { rows } = await pool.query(
    `
      INSERT INTO tasks (title, description, status, priority)
      VALUES ($1, $2, $3, $4)
      RETURNING id, title, description, status, priority, created_at
    `,
    [title, description, status, priority]
  );

  return mapTaskRow(rows[0]);
}

export async function updateTask(id, updates) {
  const fields = [];
  const values = [];
  let index = 1;

  Object.entries(updates).forEach(([key, value]) => {
    if (value !== undefined) {
      fields.push(`${key} = $${index}`);
      values.push(value);
      index += 1;
    }
  });

  if (!fields.length) {
    const task = await findTaskById(id);
    return task;
  }

  values.push(id);

  const { rows } = await pool.query(
    `
      UPDATE tasks
      SET ${fields.join(', ')}
      WHERE id = $${index}
      RETURNING id, title, description, status, priority, created_at
    `,
    values
  );

  return rows[0] ? mapTaskRow(rows[0]) : null;
}

export async function deleteTask(id) {
  const { rowCount } = await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
  return rowCount > 0;
}
