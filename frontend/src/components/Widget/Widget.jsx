import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cardStyles from '../../styles/cards';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

/**
 * Small stat tile used in grids (Temperature, Humidity, UV Index, AQI, etc.)
 * Props: icon (Ionicons name), label, value, unit, onPress, iconColor
 */
const Widget = ({ icon, label, value, unit = '', onPress, iconColor = colors.primary }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper style={cardStyles.widget} onPress={onPress} activeOpacity={0.85}>
      <View style={cardStyles.widgetIconWrap}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <Text style={[typography.h3, cardStyles.widgetValue]}>
        {value}
        {unit ? <Text style={typography.bodySmall}>{unit}</Text> : null}
      </Text>
      <Text style={[typography.caption, cardStyles.widgetLabel]}>{label}</Text>
    </Wrapper>
  );
};

export default Widget;
