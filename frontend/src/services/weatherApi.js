import api from './api';

export const getCurrentWeather = (region) => api.get('/weather/current', { params: { region } });

export const getForecast = (region) => api.get('/weather/forecast', { params: { region } });

export const getHistory = (region, days = 7) =>
  api.get('/weather/history', { params: { region, days } });

export const getNowcast = (region) => api.get('/weather/nowcast', { params: { region } });

export const getAirQuality = (params) => api.get('/weather/air-quality', { params });

export const getClothingAdvice = (region) => api.get('/weather/clothing', { params: { region } });

export const getAgricultureAdvice = (region) =>
  api.get('/weather/agriculture', { params: { region } });

export const getClimateTip = () => api.get('/weather/climate-tip');

export const reverseGeocode = (lat, lon) => api.get('/weather/reverse-geocode', { params: { lat, lon } });
