import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Header from '../../components/Header/Header';
import DiseaseCard from '../../components/DiseaseCard/DiseaseCard';
import Loading from '../../components/Loading/Loading';
import useApiData from '../../hooks/useApiData';
import { getDiseases } from '../../services/educationApi';
import healthStyles from '../../styles/healthStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { FALLBACK_DISEASES } from '../../utils/mockHealthData';

const HealthScreen = ({ navigation }) => {
  const { data, loading, isFallback } = useApiData(
    () => getDiseases(),
    { diseases: FALLBACK_DISEASES },
    []
  );
  const diseases = data.diseases?.length ? data.diseases : FALLBACK_DISEASES;

  if (loading) return <Loading label="Loading health information..." />;

  return (
    <View style={healthStyles.container}>
      <Header title="Health & Climate" subtitle="Diseases linked to climate change" />
      {isFallback ? (
        <Text style={[typography.caption, { textAlign: 'center', color: colors.light.textSecondary }]}>
          Showing sample data — couldn't reach the server.
        </Text>
      ) : null}
      <FlatList
        data={diseases}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={healthStyles.listContent}
        renderItem={({ item }) => (
          <DiseaseCard disease={item} onPress={() => navigation.navigate('DiseaseDetail', { disease: item })} />
        )}
      />
    </View>
  );
};

export default HealthScreen;
