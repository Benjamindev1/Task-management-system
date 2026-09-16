import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, loading, onToggleStatus, onEdit, onDelete, page, totalPages, onPageChange }) {
  if (loading) {
    return <div className="state-message">Loading...</div>;
  }

  if (!tasks.length) {
    return <div className="state-message">No tasks yet. Create your first one!</div>;
  }

  return (
    <>
      <div className="task-list">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleStatus={onToggleStatus}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <div className="pagination">
        <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </>
  );
}
