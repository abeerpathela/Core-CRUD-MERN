import axios from 'axios';
import { API_BASE_URL } from '../constants';

const api = axios.create({
  baseURL: API_BASE_URL,
});

export const getUsers = async (params) => {
  return api.get('/', { params });
};

export const addUser = async (user) => {
  return api.post('/add', user);
};

export const deleteUser = async (id) => {
  return api.delete(`/${id}`);
};

export const editUser = async (id, user) => {
  return api.put(`/${id}`, user);
};

export const getUserById = async (id) => {
  return api.get(`/${id}`);
};

export const getActivities = async () => {
  return api.get('/activities');
};

export const getDashboardStats = async () => {
  return api.get('/dashboard/stats');
};
