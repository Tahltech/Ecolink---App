import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import aboutStyles from '../../styles/aboutStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

const FEATURES = [
  {
    icon: 'partly-sunny-outline',
    title: 'Real-time weather',
    description: 'Current conditions, 7-day forecasts, and historical trends for your exact region.',
  },
  {
    icon: 'bulb-outline',
    title: 'Local climate tips',
    description: "Daily, location-specific guidance on making your area's climate safer and more comfortable — delivered as push notifications.",
  },
  {
    icon: 'water-outline',
    title: 'Community flood reporting',
    description: 'Report flooding as it happens and view verified reports on an interactive, color-coded map.',
  },
  {
    icon: 'medkit-outline',
    title: 'Climate & health education',
    description: "Learn how climate change affects Cameroon's regions and the health risks that come with it.",
  },
  {
    icon: 'newspaper-outline',
    title: 'Verified climate news',
    description: 'Continuously updated coverage from multiple sources — not just one outlet.',
  },
  {
    icon: 'people-outline',
    title: 'Climate initiatives directory',
    description: 'Discover real organizations doing climate work across Cameroon, each linked to its official source.',
  },
  {
    icon: 'shirt-outline',
    title: 'Smart recommendations',
    description: 'Clothing and agriculture advice generated from current weather conditions.',
  },
];

const AboutScreen = ({ navigation }) => (
  <View style={aboutStyles.container}>
    <Header title="About Ecolink" onBack={() => navigation.goBack()} />
    <ScrollView contentContainerStyle={aboutStyles.body}>
      <View style={aboutStyles.logoWrap}>
        <Image
          source={require('../../../assets/logo-mark.png')}
          style={aboutStyles.logoImage}
          resizeMode="contain"
        />
        <Text style={[typography.h2, aboutStyles.appName]}>Ecolink</Text>
        <Text style={[typography.bodySmall, aboutStyles.tagline]}>Cameroon Climate Action</Text>
      </View>

      <View style={aboutStyles.card}>
        <Text style={[typography.body, aboutStyles.paragraph]}>
          Ecolink is a mobile platform built to help people across Cameroon understand, prepare
          for, and respond to the realities of a changing climate. It brings together real-time
          weather, climate education, community flood reporting, and daily local guidance in one
          place — so that staying informed and staying safe don't have to be two different things.
        </Text>
        <Text style={[typography.body, aboutStyles.paragraph, aboutStyles.paragraphLast]}>
          Climate resilience starts with information that is timely, accurate, and relevant to
          where you actually live. A farmer in the Far North watching for the next rains, a
          family in Douala navigating flood season, and a student learning how climate change
          affects their community all have different needs — Ecolink uses your location to tailor
          weather, alerts, and guidance to each of them individually.
        </Text>
      </View>

      <Text style={[typography.h3, aboutStyles.sectionTitle]}>What you can do with Ecolink</Text>
      {FEATURES.map((feature) => (
        <View key={feature.title} style={aboutStyles.featureRow}>
          <View style={aboutStyles.featureIconWrap}>
            <Ionicons name={feature.icon} size={18} color={colors.primary} />
          </View>
          <View style={aboutStyles.featureTextWrap}>
            <Text style={[typography.bodySmall, aboutStyles.featureTitle]}>{feature.title}</Text>
            <Text style={[typography.caption, aboutStyles.featureDescription]}>{feature.description}</Text>
          </View>
        </View>
      ))}

      <View style={aboutStyles.card}>
        <Text style={[typography.body, aboutStyles.paragraph, aboutStyles.paragraphLast]}>
          Ecolink is an independent platform and is not affiliated with any government body.
          Every organization, statistic, and news source referenced in the app links back to its
          original, verifiable source, so you can always dig deeper into where information comes
          from.
        </Text>
      </View>

      <View style={aboutStyles.footer}>
        <Text style={[typography.caption, aboutStyles.footerText]}>Version 1.0.0</Text>
        <Text style={[typography.caption, aboutStyles.footerText]}>Built for Cameroon</Text>
      </View>
    </ScrollView>
  </View>
);

export default AboutScreen;
