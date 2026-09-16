export default function TaskItem({ task, onToggleStatus, onEdit, onDelete }) {
  const isCompleted = task.status === 'completed';

  return (
    <article className="task-item">
      <div className="task-main">
        <label className="task-check">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggleStatus(task.id, isCompleted ? 'pending' : 'completed')}
          />
        </label>

        <div className="task-copy">
          <div className="task-heading-row">
            <h3 className={isCompleted ? 'task-title completed' : 'task-title'}>{task.title}</h3>
            <span className={`priority-badge priority-${task.priority}`}>{task.priority}</span>
          </div>

          <p className="task-description">{task.description || 'No description provided.'}</p>
          <div className="task-meta">
            <span>{new Date(task.createdAt).toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="secondary-button" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="danger-button" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}
