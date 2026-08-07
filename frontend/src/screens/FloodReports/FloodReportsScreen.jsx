import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import FloodReportCard from '../../components/FloodReportCard/FloodReportCard';
import ClimateCard from '../../components/ClimateCard/ClimateCard';
import Loading from '../../components/Loading/Loading';
import { getReports, getMyReports } from '../../services/reportApi';
import { getNowcast } from '../../services/weatherApi';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import useApiData from '../../hooks/useApiData';
import floodStyles from '../../styles/floodStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { FALLBACK_REPORTS } from '../../utils/mockFloodData';

const FALLBACK_NOWCAST = {
  summary: 'Rain forecast unavailable right now.',
  isRainingNow: false,
  willRainSoon: false,
};

const FloodReportsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { region } = useLocation();
  const [tab, setTab] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);

  const { data: nowcast } = useApiData(
    () => getNowcast(region || user?.region),
    FALLBACK_NOWCAST,
    [region, user?.region]
  );
  const nowcastIcon = nowcast.isRainingNow
    ? 'rainy-outline'
    : nowcast.willRainSoon
    ? 'cloud-outline'
    : 'sunny-outline';

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = tab === 'mine' ? await getMyReports() : await getReports();
      setReports(res.data?.reports ?? res.reports ?? []);
      setIsFallback(false);
    } catch {
      setReports(FALLBACK_REPORTS);
      setIsFallback(true);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <View style={floodStyles.container}>
      <Header title="Flood Reports" subtitle="Community-verified flood incidents" />

      <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.sm }}>
        <ClimateCard
          icon={nowcastIcon}
          title={nowcast.region ? `Rain outlook — ${nowcast.region}` : 'Rain outlook'}
          description={nowcast.summary}
        />
      </View>

      <View style={floodStyles.tabRow}>
        <TouchableOpacity
          style={[floodStyles.tabButton, tab === 'all' && floodStyles.tabButtonActive]}
          onPress={() => setTab('all')}
        >
          <Text style={[floodStyles.tabText, tab === 'all' && floodStyles.tabTextActive]}>
            All Reports
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[floodStyles.tabButton, tab === 'mine' && floodStyles.tabButtonActive]}
          onPress={() => (user ? setTab('mine') : null)}
        >
          <Text style={[floodStyles.tabText, tab === 'mine' && floodStyles.tabTextActive]}>
            My Reports
          </Text>
        </TouchableOpacity>
      </View>

      {isFallback ? (
        <Text style={[typography.caption, { textAlign: 'center', color: colors.light.textSecondary, marginBottom: 8 }]}>
          Showing sample data — couldn't reach the server.
        </Text>
      ) : null}

      {loading ? (
        <Loading label="Loading flood reports..." />
      ) : (
        <FlatList
          data={reports}
          keyExtractor={(item, index) => String(item.id ?? index)}
          contentContainerStyle={floodStyles.listContent}
          ListEmptyComponent={
            <View style={floodStyles.emptyWrap}>
              <Ionicons name="rainy-outline" size={40} color={colors.light.textSecondary} />
              <Text style={[typography.body, floodStyles.emptyText]}>No reports yet</Text>
            </View>
          }
          renderItem={({ item }) => <FloodReportCard report={item} onPress={() => {}} />}
        />
      )}

      {user ? (
        <TouchableOpacity
          style={floodStyles.fab}
          onPress={() => navigation.navigate('FloodReportForm')}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default FloodReportsScreen;
