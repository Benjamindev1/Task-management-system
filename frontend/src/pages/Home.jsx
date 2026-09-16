import { useMemo } from 'react';
import FilterBar from '../components/FilterBar.jsx';
import Modal from '../components/Modal.jsx';
import TaskForm from '../components/TaskForm.jsx';
import TaskList from '../components/TaskList.jsx';
import useTasks from '../hooks/useTasks.js';

export default function Home() {
  const {
    tasks,
    loading,
    saving,
    isModalOpen,
    editingTask,
    filters,
    error,
    page,
    totalPages,
    setPage,
    updateFilter,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmitTask,
    handleDeleteTask,
    handleToggleStatus,
  } = useTasks();

  const formInitialValues = useMemo(
    () =>
      editingTask || {
        title: '',
        description: '',
        status: 'pending',
        priority: 'medium',
      },
    [editingTask]
  );

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Task Manager</h1>
        </div>
        <button type="button" className="primary-button" onClick={openCreateModal}>
          + New Task
        </button>
      </header>

      <FilterBar
        filters={filters}
        onStatusChange={(value) => updateFilter('status', value)}
        onPriorityChange={(value) => updateFilter('priority', value)}
        onSearchChange={(value) => updateFilter('q', value)}
      />

      {error && <div className="banner error-banner">{error}</div>}

      <main className="app-main">
        <TaskList
          tasks={tasks}
          loading={loading}
          onToggleStatus={handleToggleStatus}
          onEdit={openEditModal}
          onDelete={handleDeleteTask}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>

      <Modal open={isModalOpen} title={editingTask ? 'Edit Task' : 'Create Task'} onClose={closeModal}>
        <TaskForm
          initialValues={formInitialValues}
          onSubmit={handleSubmitTask}
          onCancel={closeModal}
          saving={saving}
        />
      </Modal>
    </div>
  );
}
