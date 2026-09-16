import { useCallback, useEffect, useMemo, useState } from 'react';
import { createTask, deleteTask, getTasks, updateTask } from '../api/tasks.js';

const defaultFilters = { status: 'all', priority: 'all', q: '' };

export default function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getTasks({ ...filters, page, limit: 10 });
      setTasks(response.tasks || []);
      setTotalPages(response.totalPages || 1);
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to load tasks');
      setTasks([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingTask(null);
  }, []);

  const handleSubmitTask = useCallback(
    async (values) => {
      setSaving(true);
      setError('');

      try {
        if (editingTask) {
          const updated = await updateTask(editingTask.id, values);
          setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));
        } else {
          const created = await createTask(values);
          setTasks((current) => [created, ...current]);
        }

        closeModal();
        return true;
      } catch (err) {
        const message = err?.response?.data?.error || 'Unable to save task';
        setError(message);
        return false;
      } finally {
        setSaving(false);
      }
    },
    [closeModal, editingTask]
  );

  const handleDeleteTask = useCallback(async (taskId) => {
    setError('');

    try {
      await deleteTask(taskId);
      setTasks((current) => current.filter((task) => task.id !== taskId));
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to delete task');
    }
  }, []);

  const handleToggleStatus = useCallback(async (taskId, status) => {
    setError('');

    try {
      const updated = await updateTask(taskId, { status });
      setTasks((current) => current.map((task) => (task.id === updated.id ? updated : task)));
    } catch (err) {
      setError(err?.response?.data?.error || 'Unable to update task status');
    }
  }, []);

  const updateFilter = useCallback((key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
    setPage(1);
  }, []);

  const filterSummary = useMemo(
    () => ({
      status: filters.status,
      priority: filters.priority,
      q: filters.q,
    }),
    [filters]
  );

  return {
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
    filterSummary,
    setFilters,
    updateFilter,
    fetchTasks,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSubmitTask,
    handleDeleteTask,
    handleToggleStatus,
  };
}
