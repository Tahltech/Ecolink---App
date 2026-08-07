import React, { useCallback, useState } from 'react';
import { View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import MapView, { Marker, Callout, PROVIDER_DEFAULT } from 'react-native-maps';
import Header from '../../components/Header/Header';
import { getReports } from '../../services/reportApi';
import { SEVERITY_LEVELS, severityColor } from '../../utils/severity';
import mapStyles from '../../styles/mapStyles';
import typography from '../../styles/typography';
import { FALLBACK_REPORTS } from '../../utils/mockFloodData';

// Centered on Cameroon with a wide delta so the whole country is visible.
const CAMEROON_REGION = { latitude: 5.9, longitude: 12.5, latitudeDelta: 9, longitudeDelta: 9 };

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
      <MapView provider={PROVIDER_DEFAULT} style={mapStyles.map} initialRegion={CAMEROON_REGION}>
        {reports
          .filter((r) => r.latitude && r.longitude)
          .map((report) => (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              pinColor={severityColor(report.severity)}
            >
              <View
                style={[mapStyles.markerPin, { backgroundColor: severityColor(report.severity) }]}
              />
              <Callout>
                <View style={mapStyles.calloutBox}>
                  <Text style={mapStyles.calloutTitle}>{report.village}</Text>
                  <Text style={mapStyles.calloutText}>
                    {report.severity} severity · {report.status}
                  </Text>
                </View>
              </Callout>
            </Marker>
          ))}
      </MapView>

      <View style={mapStyles.legend}>
        {SEVERITY_LEVELS.map((level) => (
          <View key={level} style={mapStyles.legendRow}>
            <View style={[mapStyles.legendDot, { backgroundColor: severityColor(level) }]} />
            <Text style={[typography.caption, mapStyles.legendText]}>{level}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default MapsScreen;
