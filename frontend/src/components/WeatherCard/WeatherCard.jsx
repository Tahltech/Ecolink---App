import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import cardStyles from '../../styles/cards';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

/**
 * Hero current-conditions card for the Home and Weather screens.
 * Props: region, temperature, feelsLike, description, humidity, windSpeed, rainChance
 */
const WeatherCard = ({
  region,
  temperature,
  feelsLike,
  description = 'Partly cloudy',
  humidity,
  windSpeed,
  rainChance,
}) => (
  <LinearGradient
    colors={colors.gradientPrimary}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={cardStyles.weatherCard}
  >
    <View style={cardStyles.weatherRow}>
      <View>
        <Text style={[typography.body, cardStyles.weatherMeta]}>{region}</Text>
        <Text style={cardStyles.weatherTemp}>{Math.round(temperature)}°</Text>
        <Text style={[typography.bodySmall, cardStyles.weatherMeta]}>
          Feels like {Math.round(feelsLike)}° · {description}
        </Text>
      </View>
      <Ionicons name="partly-sunny" size={64} color={colors.white} />
    </View>

    <View style={cardStyles.weatherStatsRow}>
      <View style={cardStyles.weatherStatItem}>
        <Ionicons name="water-outline" size={18} color={colors.white} />
        <Text style={[typography.caption, cardStyles.weatherStatLabel]}>{humidity}% Humidity</Text>
      </View>
      <View style={cardStyles.weatherStatItem}>
        <Ionicons name="flag-outline" size={18} color={colors.white} />
        <Text style={[typography.caption, cardStyles.weatherStatLabel]}>{windSpeed} km/h</Text>
      </View>
      <View style={cardStyles.weatherStatItem}>
        <Ionicons name="rainy-outline" size={18} color={colors.white} />
        <Text style={[typography.caption, cardStyles.weatherStatLabel]}>{rainChance}% Rain</Text>
      </View>
    </View>
  </LinearGradient>
);

export default WeatherCard;
