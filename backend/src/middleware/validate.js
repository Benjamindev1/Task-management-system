const validStatuses = ['pending', 'completed'];
const validPriorities = ['low', 'medium', 'high'];

export function validateTaskBody(req, res, next) {
  const { title, description, status, priority } = req.body ?? {};

  const errors = [];

  if (typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 120) {
    errors.push('title must be 1-120 characters');
  }

  if (description !== undefined && (typeof description !== 'string' || description.length > 1000)) {
    errors.push('description must be a string up to 1000 characters');
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push("status must be one of: 'pending', 'completed'");
  }

  if (priority !== undefined && !validPriorities.includes(priority)) {
    errors.push("priority must be one of: 'low', 'medium', 'high'");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  req.body = {
    title: title.trim(),
    description: description ?? '',
    status: status ?? 'pending',
    priority: priority ?? 'medium',
  };

  next();
}

export function validateTaskUpdate(req, res, next) {
  const { title, description, status, priority } = req.body ?? {};

  const errors = [];

  if (title !== undefined && (typeof title !== 'string' || title.trim().length < 1 || title.trim().length > 120)) {
    errors.push('title must be 1-120 characters');
  }

  if (description !== undefined && (typeof description !== 'string' || description.length > 1000)) {
    errors.push('description must be a string up to 1000 characters');
  }

  if (status !== undefined && !validStatuses.includes(status)) {
    errors.push("status must be one of: 'pending', 'completed'");
  }

  if (priority !== undefined && !validPriorities.includes(priority)) {
    errors.push("priority must be one of: 'low', 'medium', 'high'");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join('; ') });
  }

  if (title !== undefined) {
    req.body.title = title.trim();
  }

  if (description !== undefined) {
    req.body.description = description;
  }

  next();
}
