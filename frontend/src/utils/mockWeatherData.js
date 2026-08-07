// Sample payloads shaped exactly like the /api/weather responses, used when
// the backend can't be reached so the Weather screen stays demoable.
const now = 1893456000; // fixed placeholder epoch — display only

export const FALLBACK_WEATHER = {
  region: 'Yaoundé, Centre',
  current: {
    temperature: 28,
    feelsLike: 31,
    humidity: 76,
    pressure: 1012,
    windSpeed: 12,
    windDirection: 'SW',
    visibility: 9,
    cloudCover: 60,
    description: 'Partly cloudy',
    rainProbability: 35,
    uvIndex: 6,
    sunrise: now,
    sunset: now + 40000,
    airQuality: { aqi: 2, label: 'Fair' },
  },
  forecast: Array.from({ length: 7 }).map((_, i) => ({
    date: `2026-08-${String(6 + i).padStart(2, '0')}`,
    tempMin: 20 + (i % 3),
    tempMax: 27 + (i % 4),
  })),
};

export const FALLBACK_HISTORY = {
  history: Array.from({ length: 7 }).map((_, i) => ({
    date: `2026-07-${String(30 - i).padStart(2, '0')}`,
    temperature: 24 + ((i * 3) % 6),
  })).reverse(),
};
