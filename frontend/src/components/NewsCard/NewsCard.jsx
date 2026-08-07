import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cardStyles from '../../styles/cards';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

/**
 * Article list item. Props: article {title, category, source, image, published_at},
 * bookmarked, onPress, onBookmark
 */
const NewsCard = ({ article, bookmarked = false, onPress, onBookmark }) => (
  <TouchableOpacity style={cardStyles.newsCard} activeOpacity={0.85} onPress={onPress}>
    <Image
      source={article.image ? { uri: article.image } : undefined}
      style={cardStyles.newsImage}
    />
    <View style={cardStyles.newsBody}>
      <View style={cardStyles.newsCategoryTag}>
        <Text style={cardStyles.newsCategoryText}>{article.category}</Text>
      </View>
      <Text style={[typography.bodySmall, cardStyles.newsTitle]} numberOfLines={2}>
        {article.title}
      </Text>
      <View style={cardStyles.newsFooterRow}>
        <Text style={[typography.caption, cardStyles.newsSource]} numberOfLines={1}>
          {article.source} · {article.published_at}
        </Text>
        <TouchableOpacity onPress={onBookmark} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons
            name={bookmarked ? 'bookmark' : 'bookmark-outline'}
            size={18}
            color={colors.primary}
          />
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

export default NewsCard;
