import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import Header from '../../components/Header/Header';
import educationStyles from '../../styles/educationStyles';
import typography from '../../styles/typography';

const EducationDetailScreen = ({ route, navigation }) => {
  const { topic } = route.params;

  return (
    <View style={educationStyles.detailContainer}>
      <Header title="Learn" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={educationStyles.detailBody}>
        <View style={educationStyles.detailCategoryTag}>
          <Text style={educationStyles.detailCategoryText}>{topic.category}</Text>
        </View>
        <Text style={[typography.h2, educationStyles.detailTitle]}>{topic.title}</Text>
        <Text style={[typography.body, educationStyles.detailText]}>{topic.content}</Text>
      </ScrollView>
    </View>
  );
};

export default EducationDetailScreen;
