import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cardStyles from '../../styles/cards';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

/**
 * List item for the Health module. Props: disease {disease_name, symptoms, icon}, onPress
 */
const DiseaseCard = ({ disease, onPress }) => (
  <TouchableOpacity style={cardStyles.diseaseCard} activeOpacity={0.85} onPress={onPress}>
    <View style={cardStyles.diseaseIconWrap}>
      <Ionicons name={disease.icon || 'medkit-outline'} size={22} color={colors.primary} />
    </View>
    <View style={cardStyles.diseaseTextWrap}>
      <Text style={[typography.body, cardStyles.diseaseName]}>{disease.disease_name}</Text>
      <Text style={[typography.caption, cardStyles.diseaseSubtext]} numberOfLines={1}>
        {disease.symptoms}
      </Text>
    </View>
    <Ionicons name="chevron-forward" size={18} color={colors.light.textSecondary} />
  </TouchableOpacity>
);

export default DiseaseCard;
