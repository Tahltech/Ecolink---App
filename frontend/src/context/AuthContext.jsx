import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerRequest, loginRequest, logoutRequest, getMeRequest } from '../services/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On app start, try to restore the session from a stored token.
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem('access_token');
        if (token) {
          const { data } = await getMeRequest();
          setUser(data.user);
        }
      } catch (err) {
        await AsyncStorage.removeItem('access_token');
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const register = async (payload) => {
    const { data } = await registerRequest(payload);
    return data.user;
  };

  const login = async (email, password) => {
    const { data } = await loginRequest({ email, password });
    await AsyncStorage.setItem('access_token', data.session.access_token);
    await AsyncStorage.setItem('refresh_token', data.session.refresh_token);
    setUser(data.user);
    return data.user;
  };

  const refreshUser = async () => {
    try {
      const { data } = await getMeRequest();
      setUser(data.user);
      return data.user;
    } catch {
      return null;
    }
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      await AsyncStorage.multiRemove(['access_token', 'refresh_token']);
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, initializing, register, login, logout, refreshUser }),
    [user, initializing]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
