import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import healthStyles from '../../styles/healthStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

const InfoBlock = ({ label, text }) => (
  <View style={healthStyles.infoBlock}>
    <Text style={healthStyles.infoLabel}>{label}</Text>
    <Text style={healthStyles.infoText}>{text}</Text>
  </View>
);

const DiseaseDetailScreen = ({ route, navigation }) => {
  const { disease } = route.params;

  return (
    <View style={healthStyles.detailContainer}>
      <Header title="Disease Information" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={healthStyles.detailBody}>
        <View style={healthStyles.detailIconWrap}>
          <Ionicons name={disease.icon || 'medkit-outline'} size={30} color={colors.primary} />
        </View>
        <Text style={[typography.h2, healthStyles.detailTitle]}>{disease.disease_name}</Text>

        <InfoBlock label="Symptoms" text={disease.symptoms} />
        <InfoBlock label="Relationship to Climate Change" text={disease.climate_relation} />
        <InfoBlock label="Prevention" text={disease.prevention} />
        <InfoBlock label="Recommended Action" text={disease.recommended_action} />
      </ScrollView>
    </View>
  );
};

export default DiseaseDetailScreen;
