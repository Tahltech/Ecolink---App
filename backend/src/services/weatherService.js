const axios = require('axios');
const env = require('../config/env');
const supabaseService = require('./supabaseService');
const { resolveRegionCoords, resolveNearestRegion } = require('../utils/cameroonRegions');
const logger = require('../utils/logger');

const CACHE_TTL_MS = 15 * 60 * 1000;

const windDirection = (deg) => {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
};

const fetchOpenWeatherCurrent = async (lat, lon) => {
  if (!env.openWeatherApiKey) {
    return mockCurrentWeather(lat, lon);
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${env.openWeatherApiKey}`;
  const { data } = await axios.get(url, { timeout: 10000 });
  return {
    temperature: data.main.temp,
    feelsLike: data.main.feels_like,
    humidity: data.main.humidity,
    pressure: data.main.pressure,
    windSpeed: data.wind?.speed ?? 0,
    windDirection: windDirection(data.wind?.deg ?? 0),
    visibility: (data.visibility ?? 0) / 1000,
    cloudCover: data.clouds?.all ?? 0,
    rainfall: data.rain?.['1h'] ?? data.rain?.['3h'] ?? 0,
    description: data.weather?.[0]?.description ?? '',
    icon: data.weather?.[0]?.icon ?? '',
    sunrise: data.sys?.sunrise,
    sunset: data.sys?.sunset,
    uvIndex: null,
    rainProbability: data.weather?.[0]?.main === 'Rain' ? 80 : 20,
  };
};

const fetchOpenWeatherForecast = async (lat, lon) => {
  if (!env.openWeatherApiKey) {
    return mockForecast();
  }
  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${env.openWeatherApiKey}`;
  const { data } = await axios.get(url, { timeout: 10000 });
  const daily = {};
  data.list.forEach((item) => {
    const day = item.dt_txt.split(' ')[0];
    if (!daily[day]) {
      daily[day] = {
        date: day,
        tempMin: item.main.temp_min,
        tempMax: item.main.temp_max,
        humidity: item.main.humidity,
        rainProbability: Math.round((item.pop ?? 0) * 100),
        description: item.weather?.[0]?.description,
        icon: item.weather?.[0]?.icon,
      };
    } else {
      daily[day].tempMin = Math.min(daily[day].tempMin, item.main.temp_min);
      daily[day].tempMax = Math.max(daily[day].tempMax, item.main.temp_max);
    }
  });
  return Object.values(daily).slice(0, 7);
};

// Live hourly precipitation-probability forecast, straight from Open-Meteo's
// (free, keyless) forecast API — used for near-term "expect rain around
// 3pm" style nowcasting, which OpenWeather's free plan doesn't offer.
const fetchHourlyForecast = async (lat, lon) => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=precipitation_probability,precipitation&timezone=Africa/Douala&forecast_days=3`;
  const { data } = await axios.get(url, { timeout: 10000 });
  return data.hourly;
};

const RAIN_PROBABILITY_THRESHOLD = 50;

const formatHourLabel = (date, now) => {
  const time = date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (date.toDateString() === now.toDateString()) return `today at ${time}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (date.toDateString() === tomorrow.toDateString()) return `tomorrow at ${time}`;
  return `${date.toLocaleDateString('en-GB', { weekday: 'long' })} at ${time}`;
};

/**
 * Scans the next 24h of hourly rain-probability data to answer "when will
 * it actually rain" in plain language, personalized to the caller's region.
 */
const getNowcast = async (region) => {
  const coords = resolveRegionCoords(region);
  const now = new Date();

  let hourly;
  try {
    hourly = await fetchHourlyForecast(coords.lat, coords.lon);
  } catch (err) {
    logger.warn('Nowcast fetch failed', { error: err.message });
    return {
      region: coords.label,
      updatedAt: now.toISOString(),
      isRainingNow: false,
      willRainSoon: false,
      nextRainAt: null,
      summary: 'Rain forecast is temporarily unavailable.',
      hourly: [],
    };
  }

  const times = hourly.time.map((t) => new Date(t));
  let startIdx = times.findIndex((t) => t >= now);
  if (startIdx === -1) startIdx = 0;

  const windowSize = 24;
  const timesWindow = times.slice(startIdx, startIdx + windowSize);
  const probsWindow = hourly.precipitation_probability.slice(startIdx, startIdx + windowSize);

  const isRainingNow = (probsWindow[0] ?? 0) >= RAIN_PROBABILITY_THRESHOLD;
  let summary;
  let nextRainAt = null;
  let willRainSoon = false;

  if (isRainingNow) {
    const clearIdx = probsWindow.findIndex((p) => p < RAIN_PROBABILITY_THRESHOLD);
    summary =
      clearIdx > 0
        ? `Rain now — expected to clear up ${formatHourLabel(timesWindow[clearIdx], now)}.`
        : 'Rain now, expected to continue for a while.';
    willRainSoon = true;
  } else {
    const rainIdx = probsWindow.findIndex((p) => p >= RAIN_PROBABILITY_THRESHOLD);
    if (rainIdx !== -1) {
      nextRainAt = timesWindow[rainIdx].toISOString();
      summary = `Expect rain ${formatHourLabel(timesWindow[rainIdx], now)}.`;
      willRainSoon = true;
    } else {
      summary = 'No significant rain expected in the next 24 hours.';
    }
  }

  return {
    region: coords.label,
    updatedAt: now.toISOString(),
    isRainingNow,
    willRainSoon,
    nextRainAt,
    summary,
    hourly: timesWindow.map((t, i) => ({ time: t.toISOString(), rainProbability: probsWindow[i] ?? 0 })),
  };
};

const fetchHistoricalWeather = async (lat, lon, days = 7) => {
  const base = env.openMeteoBaseUrl || 'https://archive-api.open-meteo.com/v1';
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - days);
  const fmt = (d) => d.toISOString().split('T')[0];
  const url = `${base}/archive?latitude=${lat}&longitude=${lon}&start_date=${fmt(start)}&end_date=${fmt(end)}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean,wind_speed_10m_max&timezone=Africa/Douala`;
  try {
    const { data } = await axios.get(url, { timeout: 15000 });
    const { daily } = data;
    return daily.time.map((date, i) => ({
      date,
      temperature: (daily.temperature_2m_max[i] + daily.temperature_2m_min[i]) / 2,
      humidity: daily.relative_humidity_2m_mean[i],
      rainfall: daily.precipitation_sum[i],
      windSpeed: daily.wind_speed_10m_max[i],
      pressure: null,
    }));
  } catch (err) {
    logger.warn('Historical weather fetch failed, using cache', { error: err.message });
    return [];
  }
};

const fetchAirQuality = async (lat, lon) => {
  const base = env.openAqBaseUrl || 'https://api.openaq.org/v2';
  try {
    const { data } = await axios.get(`${base}/latest?coordinates=${lat},${lon}&radius=50000&limit=1`, {
      timeout: 10000,
    });
    const measurement = data.results?.[0]?.measurements?.[0];
    if (!measurement) return { aqi: null, label: 'Unavailable', pm25: null };
    const pm25 = measurement.value;
    let label = 'Good';
    let aqi = 1;
    if (pm25 > 150) { label = 'Unhealthy'; aqi = 5; }
    else if (pm25 > 100) { label = 'Unhealthy for Sensitive Groups'; aqi = 4; }
    else if (pm25 > 50) { label = 'Moderate'; aqi = 3; }
    else if (pm25 > 25) { label = 'Fair'; aqi = 2; }
    return { aqi, label, pm25, parameter: measurement.parameter };
  } catch {
    return { aqi: null, label: 'Unavailable', pm25: null };
  }
};

/**
 * Resolves a GPS point to a human-readable place name (via OpenWeather's
 * reverse geocoding, when an API key is configured) and to the nearest of
 * Cameroon's 10 official regions (always available, no external call) —
 * the region is what drives weather/tips/report personalization.
 */
const reverseGeocode = async (lat, lon) => {
  const nearest = resolveNearestRegion(lat, lon);
  let placeName = nearest.label;

  if (env.openWeatherApiKey) {
    try {
      const url = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${env.openWeatherApiKey}`;
      const { data } = await axios.get(url, { timeout: 8000 });
      if (data?.[0]?.name) placeName = data[0].name;
    } catch (err) {
      logger.warn('Reverse geocode fetch failed, using nearest-region fallback', { error: err.message });
    }
  }

  return {
    placeName,
    region: nearest.label,
    distanceKm: nearest.distanceKm,
    coordinates: { lat, lon },
  };
};

const mockCurrentWeather = (lat, lon) => ({
  temperature: 28,
  feelsLike: 30,
  humidity: 72,
  pressure: 1012,
  windSpeed: 3.5,
  windDirection: 'SW',
  visibility: 10,
  cloudCover: 40,
  rainfall: 0,
  description: 'partly cloudy',
  icon: '02d',
  sunrise: Math.floor(Date.now() / 1000) - 3600,
  sunset: Math.floor(Date.now() / 1000) + 36000,
  uvIndex: 6,
  rainProbability: 25,
  lat,
  lon,
});

const mockForecast = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      date: d.toISOString().split('T')[0],
      tempMin: 22 + i,
      tempMax: 30 + i,
      humidity: 65,
      rainProbability: 20 + i * 5,
      description: 'scattered clouds',
      icon: '03d',
    });
  }
  return days;
};

const getClothingRecommendation = (weather) => {
  const temp = weather.temperature ?? 25;
  const rain = weather.rainProbability ?? weather.rainfall ?? 0;
  if (rain > 60 || (weather.rainfall ?? 0) > 2) {
    return {
      summary: 'Rainy season gear',
      items: ['Raincoat', 'Umbrella', 'Waterproof shoes', 'Light cotton underneath'],
    };
  }
  if (temp >= 32) {
    return {
      summary: 'Hot weather',
      items: ['Cotton clothes', 'Hat', 'Sunglasses', 'Sunscreen', 'Light colors'],
    };
  }
  if (temp >= 25) {
    return {
      summary: 'Warm and comfortable',
      items: ['Light cotton', 'Breathable fabrics', 'Sandals or light shoes'],
    };
  }
  if (temp >= 18) {
    return {
      summary: 'Cool evenings',
      items: ['Light jacket', 'Sweater for evening', 'Long trousers'],
    };
  }
  return {
    summary: 'Cool / mountain areas',
    items: ['Warm clothing', 'Jacket', 'Closed shoes', 'Scarf for early morning'],
  };
};

const getAgricultureAdvice = (weather, region) => {
  const rain = weather.rainProbability ?? 0;
  const temp = weather.temperature ?? 25;
  const advice = [];
  if (rain > 70) {
    advice.push('Heavy rain expected — delay fertilizer application and ensure drainage.');
    advice.push('Monitor for fungal diseases on cocoa and plantain crops.');
  } else if (rain < 20 && temp > 30) {
    advice.push('Drought conditions possible — irrigate vegetable gardens early morning.');
    advice.push('Consider drought-resistant maize and sorghum varieties in northern regions.');
  } else {
    advice.push('Favorable conditions for field work and planting.');
  }
  if (region?.toLowerCase().includes('north') || region?.toLowerCase().includes('far')) {
    advice.push('Plant millet, sorghum, and cowpea during rainy season windows.');
  } else {
    advice.push('Ideal period for cassava, maize, and cocoa nursery preparation.');
  }
  return {
    dailyAdvice: advice[0],
    recommendations: advice,
    soilMoisture: rain > 50 ? 'High' : rain > 25 ? 'Moderate' : 'Low',
    cropSuggestions: rain > 50 ? ['Plantain', 'Cocoa', 'Maize'] : ['Sorghum', 'Millet', 'Groundnuts'],
    alerts: rain > 80 ? ['Flood alert for low-lying fields'] : temp > 35 ? ['Heat stress alert for livestock'] : [],
  };
};

const getCurrentWeather = async (region) => {
  const coords = resolveRegionCoords(region);
  const cached = await supabaseService.getWeatherCache(coords.label);
  if (cached?.updated_at && Date.now() - new Date(cached.updated_at).getTime() < CACHE_TTL_MS) {
    return {
      region: coords.label,
      current: {
        temperature: cached.temperature,
        humidity: cached.humidity,
        pressure: cached.pressure,
        rainfall: cached.rainfall,
        windSpeed: cached.wind_speed,
        ...cached.forecast?.current,
      },
      forecast: cached.forecast?.daily ?? [],
      cached: true,
    };
  }

  const current = await fetchOpenWeatherCurrent(coords.lat, coords.lon);
  const forecast = await fetchOpenWeatherForecast(coords.lat, coords.lon);
  const airQuality = await fetchAirQuality(coords.lat, coords.lon);
  current.uvIndex = current.uvIndex ?? Math.min(11, Math.round((current.temperature - 20) / 3));

  await supabaseService.upsertWeatherCache({
    region: coords.label,
    temperature: current.temperature,
    humidity: current.humidity,
    pressure: current.pressure,
    rainfall: current.rainfall,
    wind_speed: current.windSpeed,
    forecast: { current, daily: forecast, airQuality },
    updated_at: new Date().toISOString(),
  });

  return {
    region: coords.label,
    coordinates: coords,
    current: { ...current, airQuality },
    forecast,
    clothing: getClothingRecommendation(current),
    agriculture: getAgricultureAdvice(current, coords.label),
    cached: false,
  };
};

const getForecast = async (region) => {
  const data = await getCurrentWeather(region);
  return { region: data.region, forecast: data.forecast };
};

const getHistory = async (region, days = 7) => {
  const coords = resolveRegionCoords(region);
  let history = await supabaseService.getWeatherHistory(coords.label, days);
  if (!history.length) {
    const fetched = await fetchHistoricalWeather(coords.lat, coords.lon, days);
    if (fetched.length) {
      history = fetched.map((row) => ({ ...row, region: coords.label }));
      await supabaseService.insertWeatherHistory(history).catch(() => {});
    }
  }
  return { region: coords.label, history };
};

module.exports = {
  getCurrentWeather,
  getForecast,
  getHistory,
  getNowcast,
  getClothingRecommendation,
  getAgricultureAdvice,
  fetchAirQuality,
  reverseGeocode,
};
