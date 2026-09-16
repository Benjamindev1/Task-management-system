export default function FilterBar({ filters, onStatusChange, onPriorityChange, onSearchChange }) {
  return (
    <div className="filter-bar">
      <label className="field compact">
        <span>Status</span>
        <select value={filters.status} onChange={(event) => onStatusChange(event.target.value)}>
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>

      <label className="field compact">
        <span>Priority</span>
        <select value={filters.priority} onChange={(event) => onPriorityChange(event.target.value)}>
          <option value="all">All</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>

      <label className="field search-field">
        <span>Search</span>
        <input
          type="text"
          placeholder="Search tasks"
          value={filters.q}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
    </div>
  );
}
