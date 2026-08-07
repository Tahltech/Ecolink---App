import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, RefreshControl, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import NewsCard from '../../components/NewsCard/NewsCard';
import Loading from '../../components/Loading/Loading';
import { getNews, bookmarkArticle, unbookmarkArticle } from '../../services/newsApi';
import { useAuth } from '../../context/AuthContext';
import newsStyles from '../../styles/newsStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { FALLBACK_ARTICLES } from '../../utils/mockNewsData';

const CATEGORIES = ['All', 'Climate', 'Agriculture', 'Floods', 'Drought', 'Heat Waves', 'Forest Conservation'];
const AUTO_REFRESH_MS = 5 * 60 * 1000; // keeps the feed live while the screen is open

const NewsScreen = () => {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFallback, setIsFallback] = useState(false);
  const [bookmarked, setBookmarked] = useState({});

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setLoading(true);
      try {
        const params = { limit: 20 };
        if (category !== 'All') params.category = category;
        if (search) params.search = search;
        const res = await getNews(params);
        setArticles(res.data?.articles ?? res.articles ?? []);
        setIsFallback(false);
      } catch {
        setArticles(FALLBACK_ARTICLES);
        setIsFallback(true);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category, search]
  );

  useEffect(() => {
    const timer = setTimeout(() => load(), 300);
    return () => clearTimeout(timer);
  }, [load]);

  // Background auto-refresh — the backend proactively refreshes its cache
  // too (see newsService.refreshAllCategories), so this just keeps the
  // open screen showing whatever's newest without the user lifting a finger.
  useEffect(() => {
    const interval = setInterval(() => load(true), AUTO_REFRESH_MS);
    return () => clearInterval(interval);
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load(true);
  };

  const toggleBookmark = async (article) => {
    if (!user || !article.id) return;
    const isBookmarked = bookmarked[article.id];
    setBookmarked((prev) => ({ ...prev, [article.id]: !isBookmarked }));
    try {
      if (isBookmarked) await unbookmarkArticle(article.id);
      else await bookmarkArticle(article.id);
    } catch {
      setBookmarked((prev) => ({ ...prev, [article.id]: isBookmarked }));
    }
  };

  return (
    <View style={newsStyles.container}>
      <Header title="Climate News" subtitle="Daily updates for Cameroon" />

      <View style={newsStyles.searchWrap}>
        <Ionicons name="search-outline" size={18} color={colors.light.textSecondary} />
        <TextInput
          style={newsStyles.searchInput}
          placeholder="Search articles"
          placeholderTextColor={colors.light.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={CATEGORIES}
        keyExtractor={(item) => item}
        contentContainerStyle={newsStyles.chipsRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[newsStyles.chip, category === item && newsStyles.chipActive]}
            onPress={() => setCategory(item)}
          >
            <Text style={[newsStyles.chipText, category === item && newsStyles.chipTextActive]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      {loading ? (
        <Loading label="Loading climate news..." />
      ) : (
        <FlatList
          data={articles}
          keyExtractor={(item, index) => String(item.id || item.url || index)}
          contentContainerStyle={newsStyles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
          }
          ListHeaderComponent={
            isFallback ? (
              <Text style={newsStyles.fallbackNote}>Showing sample data — couldn't reach the server.</Text>
            ) : null
          }
          ListEmptyComponent={
            <View style={newsStyles.emptyWrap}>
              <Ionicons name="newspaper-outline" size={40} color={colors.light.textSecondary} />
              <Text style={[typography.body, newsStyles.emptyText]}>No articles found</Text>
            </View>
          }
          renderItem={({ item }) => (
            <NewsCard
              article={item}
              bookmarked={!!bookmarked[item.id]}
              onPress={() => item.url && Linking.openURL(item.url)}
              onBookmark={() => toggleBookmark(item)}
            />
          )}
        />
      )}
    </View>
  );
};

export default NewsScreen;
