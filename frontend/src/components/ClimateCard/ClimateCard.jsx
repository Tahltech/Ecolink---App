import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cardStyles from '../../styles/cards';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

/**
 * Climate tip / daily fact card. Props: icon, title, description
 */
const ClimateCard = ({ icon = 'leaf', title, description }) => (
  <View style={cardStyles.climateCard}>
    <View style={cardStyles.climateIconWrap}>
      <Ionicons name={icon} size={22} color={colors.primary} />
    </View>
    <View style={cardStyles.climateTextWrap}>
      <Text style={[typography.body, cardStyles.climateTitle]}>{title}</Text>
      <Text style={[typography.bodySmall, cardStyles.climateBody]}>{description}</Text>
    </View>
  </View>
);

export default ClimateCard;
