import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
  timeout: 10000,
});

export const getTasks = async (params = {}) => {
  const response = await api.get('/tasks', { params });
  return response.data;
};

export const createTask = async (payload) => {
  const response = await api.post('/tasks', payload);
  return response.data;
};

export const updateTask = async (id, payload) => {
  const response = await api.put(`/tasks/${id}`, payload);
  return response.data;
};

export const deleteTask = async (id) => {
  await api.delete(`/tasks/${id}`);
};

export default api;
