import React, { useEffect, useRef } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import * as Notifications from 'expo-notifications';
import * as Linking from 'expo-linking';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading/Loading';
import colors from '../styles/colors';
import { registerForPushNotificationsAsync } from '../services/pushNotifications';

import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterScreen from '../screens/Auth/RegisterScreen';
import ResetPasswordScreen from '../screens/Auth/ResetPasswordScreen';
import NewPasswordScreen from '../screens/Auth/NewPasswordScreen';

import HomeScreen from '../screens/Home/HomeScreen';
import WeatherScreen from '../screens/Weather/WeatherScreen';
import NewsScreen from '../screens/News/NewsScreen';
import FloodReportsScreen from '../screens/FloodReports/FloodReportsScreen';
import FloodReportFormScreen from '../screens/FloodReports/FloodReportFormScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import DevelopersScreen from '../screens/Profile/DevelopersScreen';
import EducationScreen from '../screens/Education/EducationScreen';
import EducationDetailScreen from '../screens/Education/EducationDetailScreen';
import HealthScreen from '../screens/Health/HealthScreen';
import DiseaseDetailScreen from '../screens/Health/DiseaseDetailScreen';
import MapsScreen from '../screens/Maps/MapsScreen';
import NotificationsScreen from '../screens/Notifications/NotificationsScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import AboutScreen from '../screens/Settings/AboutScreen';
import LocalTipsScreen from '../screens/Tips/LocalTipsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
export const navigationRef = createNavigationContainerRef();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Register" component={RegisterScreen} />
    <Stack.Screen
      name="ResetPassword"
      component={ResetPasswordScreen}
      options={{ headerShown: true, title: 'Reset Password' }}
    />
    <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
  </Stack.Navigator>
);

const TAB_ICONS = {
  Home: 'home',
  Weather: 'partly-sunny',
  News: 'newspaper',
  Reports: 'water',
  Profile: 'person',
};

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: colors.primary,
      tabBarInactiveTintColor: colors.light.textSecondary,
      tabBarStyle: { borderTopColor: colors.light.border, height: 60, paddingBottom: 8, paddingTop: 6 },
      tabBarIcon: ({ color, size, focused }) => (
        <Ionicons name={`${TAB_ICONS[route.name]}${focused ? '' : '-outline'}`} size={size} color={color} />
      ),
    })}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Weather" component={WeatherScreen} />
    <Tab.Screen name="News" component={NewsScreen} />
    <Tab.Screen name="Reports" component={FloodReportsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={MainTabs} />
    <Stack.Screen name="Education" component={EducationScreen} />
    <Stack.Screen name="EducationDetail" component={EducationDetailScreen} />
    <Stack.Screen name="Health" component={HealthScreen} />
    <Stack.Screen name="DiseaseDetail" component={DiseaseDetailScreen} />
    <Stack.Screen name="Maps" component={MapsScreen} />
    <Stack.Screen name="Notifications" component={NotificationsScreen} />
    <Stack.Screen name="Developers" component={DevelopersScreen} />
    <Stack.Screen name="Settings" component={SettingsScreen} />
    <Stack.Screen name="About" component={AboutScreen} />
    <Stack.Screen name="LocalTips" component={LocalTipsScreen} />
    {/* Registered here too (as well as AuthStack) so a reset-password deep
        link still resolves if it arrives while the user happens to be
        logged in on this device already. */}
    <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
    <Stack.Screen
      name="FloodReportForm"
      component={FloodReportFormScreen}
      options={{ presentation: 'modal' }}
    />
  </Stack.Navigator>
);

// Navigates to the Local Climate Tips screen for whatever region a tapped
// notification carries — works whether the app was foregrounded, backgrounded,
// or launched fresh from the notification (React Navigation queues
// `navigate()` calls made before the container is ready).
const navigateFromNotification = (response) => {
  const data = response?.notification?.request?.content?.data;
  if (data?.type === 'tip' && navigationRef.isReady()) {
    navigationRef.navigate('LocalTips', { region: data.region });
  }
};

// Supabase's password-reset email links back into the app as
// ecolink://reset-password#access_token=...&type=recovery — the token
// lives in the URL fragment, not the query string, so it needs manual
// parsing rather than expo-linking's built-in queryParams.
const parseUrlFragment = (url) => {
  const hashIndex = url.indexOf('#');
  if (hashIndex === -1) return {};
  const params = {};
  url
    .slice(hashIndex + 1)
    .split('&')
    .forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  return params;
};

const handleDeepLink = (url) => {
  if (!url) return;
  const { type, access_token: accessToken } = parseUrlFragment(url);
  if (type === 'recovery' && accessToken && navigationRef.isReady()) {
    navigationRef.navigate('NewPassword', { accessToken });
  }
};

const AppNavigator = () => {
  const { user, initializing } = useAuth();
  const responseListener = useRef();

  useEffect(() => {
    if (!user) return undefined;
    registerForPushNotificationsAsync();
    responseListener.current = Notifications.addNotificationResponseReceivedListener(navigateFromNotification);
    return () => responseListener.current?.remove();
  }, [user]);

  // Password-reset deep links can arrive two ways: the app gets launched
  // fresh from the email link (cold start — check getInitialURL once), or
  // the app is already running in the background and gets foregrounded by
  // it (warm start — the 'url' event). Runs regardless of auth state since
  // this is specifically the logged-out "forgot password" flow.
  useEffect(() => {
    Linking.getInitialURL().then(handleDeepLink);
    const subscription = Linking.addEventListener('url', ({ url }) => handleDeepLink(url));
    return () => subscription.remove();
  }, []);

  if (initializing) return <Loading label="Preparing your climate dashboard..." />;

  return (
    <NavigationContainer ref={navigationRef}>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AppNavigator;
