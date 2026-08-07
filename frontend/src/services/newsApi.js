import api from './api';

export const getNews = (params) => api.get('/news', { params });

export const getArticle = (id) => api.get(`/news/${id}`);

export const bookmarkArticle = (id) => api.post(`/news/${id}/bookmark`);

export const unbookmarkArticle = (id) => api.delete(`/news/${id}/bookmark`);

export const getBookmarks = () => api.get('/news/bookmarks');
