import axios from 'axios';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// All business logic goes through the Express backend, never directly to
// Supabase from the app (per the architecture: RN -> Express -> Supabase).
// Configure API_BASE_URL under `expo.extra` in app.json (see README).
const API_BASE_URL =
  Constants.expoConfig?.extra?.API_BASE_URL || 'http://localhost:4000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the stored access token (if any) to every request.
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Normalize error responses so callers can just read `error.message`.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error?.response?.data?.error?.message || error?.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

export default api;
