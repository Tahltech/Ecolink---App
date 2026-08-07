import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, Alert, RefreshControl, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import Widget from '../../components/Widget/Widget';
import WeatherCard from '../../components/WeatherCard/WeatherCard';
import NewsCard from '../../components/NewsCard/NewsCard';
import ClimateCard from '../../components/ClimateCard/ClimateCard';
import { getCurrentWeather } from '../../services/weatherApi';
import { getNews } from '../../services/newsApi';
import colors from '../../styles/colors';
import typography from '../../styles/typography';
import homeStyles from '../../styles/homeStyles';
import { spacing } from '../../styles/spacing';
import {
  mockWeather,
  mockWidgets,
  mockAlerts,
  mockTip,
  mockFact,
  mockClothing,
  mockAgriculture,
  mockWaterTip,
} from '../../utils/mockHomeData';
import { FALLBACK_ARTICLES } from '../../utils/mockNewsData';

const TREE_OPACITIES = [0.16, 0.24, 0.32, 0.24, 0.16, 0.28, 0.18];
const NEWS_REFRESH_MS = 5 * 60 * 1000; // keep the feed "always updating" while Home is open

const Treeline = () => (
  <View style={homeStyles.treeline} pointerEvents="none">
    {TREE_OPACITIES.map((opacity, index) => (
      <MaterialCommunityIcons
        key={index}
        name="pine-tree"
        size={index % 2 === 0 ? 46 : 64}
        color={`rgba(255,255,255,${opacity})`}
      />
    ))}
  </View>
);

const minutesAgo = (date) => Math.max(0, Math.round((Date.now() - date) / 60000));

const HomeScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { region, hasBeenPrompted, requestLocation, dismissPrompt } = useLocation();
  const insets = useSafeAreaInsets();

  const [weather, setWeather] = useState(mockWeather);
  const [news, setNews] = useState(FALLBACK_ARTICLES.slice(0, 3));
  const [newsUpdatedAt, setNewsUpdatedAt] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadWeather = useCallback(async () => {
    try {
      const res = await getCurrentWeather(region || user?.region);
      const data = res.data ?? res;
      if (data.current) setWeather({ region: data.region, ...data.current, rainChance: data.current.rainProbability });
    } catch {
      // Keep showing the last-known/sample weather.
    }
  }, [region, user?.region]);

  const loadNews = useCallback(async () => {
    try {
      const res = await getNews({ limit: 3 });
      const articles = res.data?.articles ?? res.articles ?? [];
      if (articles.length) setNews(articles);
      setNewsUpdatedAt(Date.now());
    } catch {
      // Keep showing the last-known/sample articles.
    }
  }, []);

  useEffect(() => {
    loadWeather();
    loadNews();
    const interval = setInterval(loadNews, NEWS_REFRESH_MS);
    return () => clearInterval(interval);
  }, [loadWeather, loadNews]);

  // Ask permission once, with a plain-language reason, before the OS
  // dialog — location drives hyper-local weather, flood risk, and tips.
  useEffect(() => {
    (async () => {
      if (await hasBeenPrompted()) return;
      Alert.alert(
        'Use your location?',
        'Ecolink can use your current location to show hyper-local weather, flood alerts, and climate tips for exactly where you are.',
        [
          { text: 'Not now', style: 'cancel', onPress: dismissPrompt },
          { text: 'Enable Location', onPress: requestLocation },
        ]
      );
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadWeather(), loadNews()]);
    setRefreshing(false);
  };

  const widgets = mockWidgets(weather);

  return (
    <ScrollView
      style={homeStyles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
    >
      <StatusBar style="light" />
      <LinearGradient colors={colors.gradientDeep} style={[homeStyles.hero, { paddingTop: insets.top + spacing.md }]}>
        <View style={homeStyles.topRow}>
          <View style={homeStyles.brandRow}>
            <Image
              source={require('../../../assets/logo-mark.png')}
              style={homeStyles.brandImage}
              resizeMode="contain"
            />
            <Text style={[typography.h3, homeStyles.brandText]}>Ecolink</Text>
          </View>
          <TouchableOpacity
            style={homeStyles.bellButton}
            onPress={() => navigation?.navigate('Notifications')}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <Text style={[typography.h2, homeStyles.greeting]}>
          Hello, {user?.fullname?.split(' ')[0] || 'there'} 👋
        </Text>
        <Text style={[typography.body, homeStyles.subGreeting]}>
          {region || user?.region ? `Climate updates for ${region || user.region}` : 'Stay climate-aware today'}
        </Text>

        <Treeline />
      </LinearGradient>

      <View style={homeStyles.weatherCardWrap}>
        <WeatherCard {...weather} />
      </View>

      <View style={homeStyles.section}>
        <View style={homeStyles.sectionHeaderRow}>
          <Text style={[typography.h3, homeStyles.sectionTitle]}>Today's overview</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('Weather')}>
            <Text style={[typography.bodySmall, homeStyles.seeAll]}>See all</Text>
          </TouchableOpacity>
        </View>
        <View style={homeStyles.widgetGrid}>
          {widgets.map((w) => (
            <Widget key={w.label} {...w} />
          ))}
        </View>
      </View>

      <View style={homeStyles.section}>
        <Text style={[typography.h3, homeStyles.sectionTitle]}>Alerts</Text>
        {mockAlerts.map((alert) => (
          <View key={alert.id} style={homeStyles.alertBanner}>
            <View style={homeStyles.alertIconWrap}>
              <Ionicons name={alert.icon} size={22} color={colors.severityHigh} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.bodySmall, homeStyles.alertType]}>{alert.type}</Text>
              <Text style={[typography.caption, homeStyles.alertMessage]}>{alert.message}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={homeStyles.section}>
        <ClimateCard icon="bulb-outline" {...mockTip} />
        <View style={homeStyles.stackGap} />
        <ClimateCard icon="earth-outline" {...mockFact} />
      </View>

      <View style={homeStyles.section}>
        <View style={homeStyles.sectionHeaderRow}>
          <Text style={[typography.h3, homeStyles.sectionTitle]}>Latest climate news</Text>
          <TouchableOpacity onPress={() => navigation?.navigate('News')}>
            <Text style={[typography.bodySmall, homeStyles.seeAll]}>See all</Text>
          </TouchableOpacity>
        </View>
        {newsUpdatedAt ? (
          <Text style={[typography.caption, { color: colors.light.textSecondary, marginBottom: 8 }]}>
            Updated {minutesAgo(newsUpdatedAt) === 0 ? 'just now' : `${minutesAgo(newsUpdatedAt)}m ago`} · refreshes automatically
          </Text>
        ) : null}
        {news.map((article, index) => (
          <NewsCard
            key={article.id || article.url || index}
            article={article}
            onPress={() => article.url && Linking.openURL(article.url)}
            onBookmark={() => {}}
          />
        ))}
      </View>

      <View style={homeStyles.section}>
        <Text style={[typography.h3, homeStyles.sectionTitle]}>Daily guidance</Text>
        <ClimateCard icon="shirt-outline" {...mockClothing} />
        <View style={homeStyles.stackGap} />
        <ClimateCard icon="nutrition-outline" {...mockAgriculture} />
        <View style={homeStyles.stackGap} />
        <ClimateCard icon="water-outline" {...mockWaterTip} />
      </View>

      <View style={homeStyles.bottomSpacer} />
    </ScrollView>
  );
};

export default HomeScreen;
