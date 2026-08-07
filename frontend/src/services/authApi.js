import api from './api';

export const registerRequest = (payload) => api.post('/auth/register', payload);

export const loginRequest = (payload) => api.post('/auth/login', payload);

export const logoutRequest = () => api.post('/auth/logout');

export const resetPasswordRequest = (email) => api.post('/auth/reset-password', { email });

export const updatePasswordRequest = (accessToken, password) =>
  api.post('/auth/update-password', { access_token: accessToken, password });

export const getMeRequest = () => api.get('/auth/me');
