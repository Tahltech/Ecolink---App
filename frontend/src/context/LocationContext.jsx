import React, { createContext, useContext, useMemo, useState } from 'react';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reverseGeocode } from '../services/weatherApi';
import { useAuth } from './AuthContext';

const LocationContext = createContext(null);
const PROMPTED_KEY = 'ecolink_location_prompted';

export const LocationProvider = ({ children }) => {
  const { user, refreshUser } = useAuth();
  const [region, setRegion] = useState(null);
  const [placeName, setPlaceName] = useState(null);
  const [coords, setCoords] = useState(null);
  const [status, setStatus] = useState('unknown'); // unknown | granted | denied
  const [loading, setLoading] = useState(false);

  const hasBeenPrompted = async () => (await AsyncStorage.getItem(PROMPTED_KEY)) === 'true';
  const markPrompted = async () => AsyncStorage.setItem(PROMPTED_KEY, 'true');

  // Requests OS location permission, resolves the GPS point to a Cameroon
  // region via the backend, and — when logged in — the backend endpoint
  // itself (see weatherController.reverseGeocode) saves that region onto
  // the user's profile, so we refresh the local user object to match.
  const requestLocation = async () => {
    setLoading(true);
    try {
      await markPrompted();
      const { status: permStatus } = await Location.requestForegroundPermissionsAsync();
      setStatus(permStatus === 'granted' ? 'granted' : 'denied');
      if (permStatus !== 'granted') return null;

      const position = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = position.coords;
      setCoords({ latitude, longitude });

      const res = await reverseGeocode(latitude, longitude);
      const resolved = res.data ?? res;
      setRegion(resolved.region);
      setPlaceName(resolved.placeName);

      if (user) await refreshUser();
      return resolved;
    } catch {
      return null;
    } finally {
      setLoading(false);
    }
  };

  const dismissPrompt = () => markPrompted();

  const value = useMemo(
    () => ({
      region: region || user?.region || null,
      placeName,
      coords,
      status,
      loading,
      hasBeenPrompted,
      requestLocation,
      dismissPrompt,
    }),
    [region, placeName, coords, status, loading, user?.region]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export const useLocation = () => {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error('useLocation must be used within a LocationProvider');
  return ctx;
};
