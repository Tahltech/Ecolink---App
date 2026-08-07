import api from './api';

export const getReports = (params) => api.get('/reports', { params });

export const getMyReports = () => api.get('/reports/mine');

export const getReport = (id) => api.get(`/reports/${id}`);

export const createReport = (payload) => api.post('/reports', payload);

export const updateReport = (id, payload) => api.put(`/reports/${id}`, payload);

export const deleteReport = (id) => api.delete(`/reports/${id}`);
