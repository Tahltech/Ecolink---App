import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import ClimateCard from '../../components/ClimateCard/ClimateCard';
import Loading from '../../components/Loading/Loading';
import useApiData from '../../hooks/useApiData';
import { getRegionalTips } from '../../services/educationApi';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import tipsStyles from '../../styles/tipsStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { spacing } from '../../styles/spacing';
import { FALLBACK_REGIONAL_TIPS } from '../../utils/mockTipsData';

const TIP_ICONS = ['water-outline', 'leaf-outline', 'home-outline', 'sunny-outline', 'rainy-outline'];

const LocalTipsScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const { region: liveRegion } = useLocation();
  const insets = useSafeAreaInsets();
  const region = route.params?.region || liveRegion || user?.region;

  const { data, loading, isFallback } = useApiData(
    () => getRegionalTips(region),
    FALLBACK_REGIONAL_TIPS(region || 'Cameroon'),
    [region]
  );

  if (loading) return <Loading label="Loading local climate tips..." />;

  return (
    <ScrollView style={tipsStyles.container} showsVerticalScrollIndicator={false}>
      <StatusBar style="light" />
      <LinearGradient colors={colors.gradientDeep} style={[tipsStyles.hero, { paddingTop: insets.top + spacing.sm }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={tipsStyles.backButton}>
          <Ionicons name="chevron-back" size={22} color={colors.white} />
        </TouchableOpacity>
        <View style={tipsStyles.dailyBadge}>
          <Text style={tipsStyles.dailyBadgeText}>Today's tip</Text>
        </View>
        <Text style={[typography.h2, tipsStyles.heroTitle]}>{data.region || region}</Text>
        <Text style={[typography.body, tipsStyles.heroSummary]}>{data.summary}</Text>
      </LinearGradient>

      {isFallback ? (
        <Text style={[typography.caption, { textAlign: 'center', color: colors.light.textSecondary, marginTop: 8 }]}>
          Showing sample data — couldn't reach the server.
        </Text>
      ) : null}

      <View style={tipsStyles.section}>
        <ClimateCard icon="star-outline" title="Daily highlight" description={data.dailyTip} />
      </View>

      <View style={tipsStyles.section}>
        <Text style={[typography.h3, tipsStyles.sectionTitle]}>
          All tips to make {data.region || region}'s climate better
        </Text>
        {(data.tips || []).map((tip, index) => (
          <View key={tip} style={tipsStyles.stackGap}>
            <ClimateCard icon={TIP_ICONS[index % TIP_ICONS.length]} title={`Tip ${index + 1}`} description={tip} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default LocalTipsScreen;
