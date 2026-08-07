import api from './api';

export const getReports = (params) => api.get('/reports', { params });

export const getMyReports = () => api.get('/reports/mine');

export const getReport = (id) => api.get(`/reports/${id}`);

export const createReport = (payload) => api.post('/reports', payload);

export const uploadReportImage = (uri) => {
  const filename = uri.split('/').pop() || 'photo.jpg';
  const match = /\.(\w+)$/.exec(filename);
  const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';

  const formData = new FormData();
  formData.append('image', { uri, name: filename, type });

  return api.post('/reports/upload-image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateReport = (id, payload) => api.put(`/reports/${id}`, payload);

export const deleteReport = (id) => api.delete(`/reports/${id}`);
