import React, { useMemo, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import useApiData from '../../hooks/useApiData';
import { getEducationContent } from '../../services/educationApi';
import educationStyles from '../../styles/educationStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { FALLBACK_EDUCATION } from '../../utils/mockEducationData';

const CATEGORY_ICON = {
  Fundamentals: 'school-outline',
  'Cameroon Regions': 'map-outline',
  Action: 'flash-outline',
  Solutions: 'bulb-outline',
};

const EducationScreen = ({ navigation }) => {
  const [category, setCategory] = useState('All');
  const { data, loading, isFallback } = useApiData(
    () => getEducationContent({}),
    { content: FALLBACK_EDUCATION },
    []
  );

  const content = data.content?.length ? data.content : FALLBACK_EDUCATION;
  const categories = useMemo(
    () => ['All', ...new Set(content.map((c) => c.category))],
    [content]
  );
  const filtered = category === 'All' ? content : content.filter((c) => c.category === category);

  if (loading) return <Loading label="Loading education topics..." />;

  return (
    <View style={educationStyles.container}>
      <Header title="Climate Education" subtitle="Learn how climate change affects Cameroon" />

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item}
        contentContainerStyle={educationStyles.chipsRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[educationStyles.chip, category === item && educationStyles.chipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[educationStyles.chipText, category === item && educationStyles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {isFallback ? (
        <Text style={[typography.caption, { textAlign: 'center', color: colors.light.textSecondary }]}>
          Showing sample data — couldn't reach the server.
        </Text>
      ) : null}

      <FlatList
        data={filtered}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={educationStyles.listContent}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={educationStyles.topicCard}
            onPress={() => navigation.navigate('EducationDetail', { topic: item })}
          >
            <View style={educationStyles.topicIconWrap}>
              <Ionicons
                name={CATEGORY_ICON[item.category] || 'leaf-outline'}
                size={20}
                color={colors.primary}
              />
            </View>
            <View style={educationStyles.topicTextWrap}>
              <Text style={[typography.body, educationStyles.topicTitle]}>{item.title}</Text>
              <Text style={[typography.caption, educationStyles.topicCategory]}>{item.category}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.light.textSecondary} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default EducationScreen;
