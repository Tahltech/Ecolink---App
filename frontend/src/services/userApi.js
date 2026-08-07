import api from './api';

export const getMyProfile = () => api.get('/users/me');

export const updateMyProfile = (payload) => api.put('/users/me', payload);

export const registerPushToken = (token) => api.post('/users/push-token', { token });
