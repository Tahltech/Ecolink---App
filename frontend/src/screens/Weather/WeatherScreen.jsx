import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import WeatherCard from '../../components/WeatherCard/WeatherCard';
import Widget from '../../components/Widget/Widget';
import Card from '../../components/Card/Card';
import Loading from '../../components/Loading/Loading';
import { useAuth } from '../../context/AuthContext';
import useApiData from '../../hooks/useApiData';
import { getCurrentWeather, getHistory } from '../../services/weatherApi';
import { getClimateInitiatives } from '../../services/educationApi';
import weatherStyles from '../../styles/weatherStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { FALLBACK_WEATHER, FALLBACK_HISTORY } from '../../utils/mockWeatherData';
import { FALLBACK_INITIATIVES } from '../../utils/mockInitiativesData';

const formatDay = (dateStr) =>
  new Date(dateStr).toLocaleDateString('en-GB', { weekday: 'short' });

const formatClock = (unixSeconds) =>
  unixSeconds
    ? new Date(unixSeconds * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '--:--';

const WeatherScreen = () => {
  const { user } = useAuth();
  const region = user?.region || 'Yaoundé';

  const { data: weather, loading, isFallback, refetch: refetchWeather } = useApiData(
    () => getCurrentWeather(region),
    FALLBACK_WEATHER,
    [region]
  );
  const { data: historyData, refetch: refetchHistory } = useApiData(
    () => getHistory(region, 7),
    FALLBACK_HISTORY,
    [region]
  );
  const { data: initiativesData } = useApiData(
    () => getClimateInitiatives(),
    { initiatives: FALLBACK_INITIATIVES },
    []
  );

  if (loading) return <Loading label="Fetching the latest weather..." />;

  const c = weather.current || {};
  const history = historyData.history?.length ? historyData.history : FALLBACK_HISTORY.history;
  const maxTemp = Math.max(...history.map((h) => h.temperature || 0), 1);
  const initiatives = initiativesData.initiatives?.length ? initiativesData.initiatives : FALLBACK_INITIATIVES;

  return (
    <ScrollView style={weatherStyles.container} showsVerticalScrollIndicator={false}>
      <Header
        title="Weather"
        subtitle={weather.region || region}
        rightIcon="refresh-outline"
        onRightPress={() => {
          refetchWeather();
          refetchHistory();
        }}
      />

      {isFallback ? (
        <Text style={weatherStyles.fallbackNote}>Showing sample data — couldn't reach the server.</Text>
      ) : null}

      <View style={weatherStyles.section}>
        <WeatherCard
          region={weather.region || region}
          temperature={c.temperature ?? 0}
          feelsLike={c.feelsLike ?? c.temperature ?? 0}
          description={c.description || 'Clear sky'}
          humidity={c.humidity ?? 0}
          windSpeed={Math.round(c.windSpeed ?? 0)}
          rainChance={c.rainProbability ?? 0}
        />
      </View>

      <View style={weatherStyles.section}>
        <View style={weatherStyles.sunRow}>
          <View style={weatherStyles.sunItem}>
            <Ionicons name="sunny-outline" size={22} color={colors.primary} />
            <Text style={[typography.body, weatherStyles.sunValue]}>{formatClock(c.sunrise)}</Text>
            <Text style={[typography.caption, weatherStyles.sunLabel]}>Sunrise</Text>
          </View>
          <View style={weatherStyles.sunItem}>
            <Ionicons name="moon-outline" size={22} color={colors.primary} />
            <Text style={[typography.body, weatherStyles.sunValue]}>{formatClock(c.sunset)}</Text>
            <Text style={[typography.caption, weatherStyles.sunLabel]}>Sunset</Text>
          </View>
        </View>
      </View>

      <View style={weatherStyles.section}>
        <Text style={[typography.h3, weatherStyles.sectionTitle]}>Conditions</Text>
        <View style={weatherStyles.widgetGrid}>
          <Widget icon="water-outline" label="Pressure" value={c.pressure ?? '--'} unit=" hPa" />
          <Widget icon="navigate-outline" label="Wind Dir." value={c.windDirection ?? '--'} />
          <Widget icon="eye-outline" label="Visibility" value={c.visibility ?? '--'} unit=" km" />
          <Widget icon="sunny-outline" label="UV Index" value={c.uvIndex ?? '--'} />
          <Widget icon="cloud-outline" label="Cloud Cover" value={c.cloudCover ?? 0} unit="%" />
          <Widget
            icon="leaf-outline"
            label="Air Quality"
            value={c.airQuality?.label || c.airQuality?.aqi || '--'}
          />
        </View>
      </View>

      <View style={weatherStyles.section}>
        <Text style={[typography.h3, weatherStyles.sectionTitle]}>7-Day Forecast</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(weather.forecast?.length ? weather.forecast : FALLBACK_WEATHER.forecast).map((day) => (
            <View key={day.date} style={weatherStyles.forecastCard}>
              <Text style={[typography.caption, weatherStyles.forecastDay]}>{formatDay(day.date)}</Text>
              <Ionicons name="partly-sunny-outline" size={22} color={colors.primary} />
              <Text style={[typography.bodySmall, weatherStyles.forecastTemp]}>
                {Math.round(day.tempMax)}°
              </Text>
              <Text style={[typography.caption, weatherStyles.forecastTempLow]}>
                {Math.round(day.tempMin)}°
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={weatherStyles.section}>
        <Text style={[typography.h3, weatherStyles.sectionTitle]}>Historical Weather</Text>
        <View style={weatherStyles.chartCard}>
          <View style={weatherStyles.chartRow}>
            {history.map((h) => (
              <View key={h.date} style={weatherStyles.chartBarWrap}>
                <View
                  style={[
                    weatherStyles.chartBar,
                    { height: Math.max(8, (h.temperature / maxTemp) * 96) },
                  ]}
                />
                <Text style={[typography.caption, weatherStyles.chartLabel]}>{formatDay(h.date)}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={weatherStyles.section}>
        <Text style={[typography.h3, weatherStyles.sectionTitle]}>Climate Initiatives in Cameroon</Text>
        <Text style={[typography.bodySmall, { color: colors.light.textSecondary, marginBottom: spacing.sm }]}>
          Organizations working on climate action across Cameroon — tap to visit their official source.
        </Text>
        {initiatives.map((org) => (
          <Card key={org.name} style={weatherStyles.initiativeCard}>
            <View style={weatherStyles.initiativeHeaderRow}>
              <Text style={[typography.body, weatherStyles.initiativeName]}>{org.name}</Text>
            </View>
            {org.focus_area ? (
              <View style={weatherStyles.initiativeFocusTag}>
                <Text style={weatherStyles.initiativeFocusText}>{org.focus_area.toUpperCase()}</Text>
              </View>
            ) : null}
            <Text style={[typography.bodySmall, weatherStyles.initiativeDescription]}>{org.description}</Text>
            <TouchableOpacity
              style={weatherStyles.initiativeSourceRow}
              onPress={() => Linking.openURL(org.source_url)}
            >
              <Ionicons name="open-outline" size={14} color={colors.primary} />
              <Text style={[typography.caption, weatherStyles.initiativeSourceText]}>View source</Text>
            </TouchableOpacity>
          </Card>
        ))}
      </View>

      <View style={weatherStyles.bottomSpacer} />
    </ScrollView>
  );
};

export default WeatherScreen;
