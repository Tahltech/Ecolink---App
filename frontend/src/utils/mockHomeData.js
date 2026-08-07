// Placeholder data shaped like real API responses (weatherService, newsService,
// climate_tips, disease_information) so screens can be swapped to live
// endpoints later without changing component props.

export const mockWeather = {
  region: 'Yaoundé, Centre',
  temperature: 29,
  feelsLike: 32,
  description: 'Partly cloudy',
  humidity: 78,
  windSpeed: 14,
  rainChance: 40,
  uvIndex: 7,
  airQuality: 58,
};

// airQuality is a plain number in mock data but an { aqi, label, pm25 }
// object once real weather data (weatherService.fetchAirQuality) replaces
// it — normalize both shapes to a renderable value here.
const airQualityDisplay = (aq) => {
  if (aq && typeof aq === 'object') return { value: aq.label || aq.aqi || '--', unit: '' };
  return { value: aq, unit: ' AQI' };
};

export const mockWidgets = (w) => {
  const aq = airQualityDisplay(w.airQuality);
  return [
    { icon: 'thermometer-outline', label: 'Temperature', value: Math.round(w.temperature), unit: '°C' },
    { icon: 'water-outline', label: 'Humidity', value: w.humidity, unit: '%' },
    { icon: 'rainy-outline', label: 'Rain Chance', value: w.rainChance, unit: '%' },
    { icon: 'flag-outline', label: 'Wind Speed', value: w.windSpeed, unit: ' km/h' },
    { icon: 'sunny-outline', label: 'UV Index', value: w.uvIndex, unit: '' },
    { icon: 'leaf-outline', label: 'Air Quality', value: aq.value, unit: aq.unit },
  ];
};

export const mockNews = [
  {
    id: 'n1',
    title: 'Cameroon steps up reforestation efforts in the Far North',
    category: 'Forest',
    source: 'CRTV',
    published_at: '2h ago',
    image: null,
  },
  {
    id: 'n2',
    title: 'Douala drainage upgrade aims to curb urban flooding',
    category: 'Floods',
    source: 'Cameroon Tribune',
    published_at: '5h ago',
    image: null,
  },
];

export const mockTip = {
  title: 'Climate Tip of the Day',
  description: 'Collect rainwater during the rainy season to reduce pressure on water supplies during drought months.',
};

export const mockFact = {
  title: 'Daily Climate Fact',
  description: 'Cameroon hosts part of the Congo Basin, the world’s second-largest tropical rainforest and a major carbon sink.',
};

export const mockClothing = {
  title: 'Recommended Clothing',
  description: 'Hot and humid today — wear light cotton clothing, a hat, and sunscreen. Carry a light raincoat for afternoon showers.',
};

export const mockAgriculture = {
  title: 'Agriculture Advice',
  description: 'Soil moisture is favorable for planting maize this week. Monitor forecasts for heavy rain before harvesting.',
};

export const mockWaterTip = {
  title: 'Water Conservation Tip',
  description: 'Fix dripping taps promptly — a slow leak can waste over 20 litres of clean water a day.',
};
