import api from './api';

export const getEducationContent = (params) => api.get('/education', { params });

export const getEducationContentById = (id) => api.get(`/education/${id}`);

export const getClimateTips = () => api.get('/education/tips');

export const getDiseases = () => api.get('/education/diseases');

export const getDiseaseById = (id) => api.get(`/education/diseases/${id}`);

export const getClimateInitiatives = () => api.get('/education/initiatives');

export const getRegionalTips = (region) => api.get('/education/regional-tips', { params: { region } });
