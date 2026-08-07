import React, { useCallback, useState } from 'react';
import { View, Text, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import FloodReportCard from '../../components/FloodReportCard/FloodReportCard';
import { getReports } from '../../services/reportApi';
import { SEVERITY_LEVELS, severityColor } from '../../utils/severity';
import mapStyles from '../../styles/mapStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { FALLBACK_REPORTS } from '../../utils/mockFloodData';

// react-native-maps has no web renderer (it needs native codegen), so the
// web build falls back to this list + legend view instead of blanking the
// whole app. The native map (MapsScreen.native.jsx) is used on iOS/Android.
const MapsScreen = () => {
  const [reports, setReports] = useState(FALLBACK_REPORTS);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      getReports({ verified: 'true' })
        .then((res) => {
          const data = res.data?.reports ?? res.reports ?? [];
          if (active && data.length) setReports(data);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }, [])
  );

  return (
    <View style={mapStyles.container}>
      <Header title="Flood & Risk Map" subtitle="Verified community reports" />

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 16, marginBottom: 8 }}>
        <Ionicons name="information-circle-outline" size={16} color={colors.light.textSecondary} />
        <Text style={[typography.caption, { color: colors.light.textSecondary, marginLeft: 6 }]}>
          Interactive map view is available in the mobile app — showing reports as a list here.
        </Text>
      </View>

      <View style={[mapStyles.legend, { position: 'relative', flexDirection: 'row', marginHorizontal: 16, marginBottom: 12, alignSelf: 'flex-start' }]}>
        {SEVERITY_LEVELS.map((level) => (
          <View key={level} style={[mapStyles.legendRow, { marginRight: 12 }]}>
            <View style={[mapStyles.legendDot, { backgroundColor: severityColor(level) }]} />
            <Text style={[typography.caption, mapStyles.legendText]}>{level}</Text>
          </View>
        ))}
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        renderItem={({ item }) => <FloodReportCard report={item} onPress={() => {}} />}
      />
    </View>
  );
};

export default MapsScreen;
