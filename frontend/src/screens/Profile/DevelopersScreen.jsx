import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import developersStyles from '../../styles/developersStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';

const DEVELOPERS = [
  {
    name: 'Tahla Ebenisa Burinyuy',
    role: 'Developer',
    born: 'November 2, 2003',
    initials: 'TE',
    bio: 'Software Developer Student at Eschosys Bihmet, Yaoundé.',
    email: 'tahlaebenezer@gmail.com',
    github: 'https://github.com/Tahltech',
    linkedin: 'https://www.linkedin.com/in/tahla-ebenezer-9425a0302',
  },
  {
    name: 'Ndefru Blessing Azweh',
    role: 'Developer',
    born: 'August 8, 2008',
    initials: 'NB',
    bio: 'Computer Engineering Student at Polytechnique, Bamenda.',
    email: 'ndefrublessing26@gmail.com',
    github: null,
    linkedin: null,
  },
];

const CONTACT_NUMBERS = ['+237680190906', '+237673545461'];

const SocialButton = ({ icon, label, url }) => (
  <TouchableOpacity
    style={[developersStyles.socialButton, !url && developersStyles.socialButtonDisabled]}
    onPress={() => url && Linking.openURL(url)}
    disabled={!url}
  >
    <Ionicons
      name={icon}
      size={14}
      color={url ? colors.primaryDark : colors.light.textSecondary}
    />
    <Text
      style={[
        developersStyles.socialButtonText,
        !url && developersStyles.socialButtonTextDisabled,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const DevelopersScreen = ({ navigation }) => (
  <View style={developersStyles.container}>
    <Header title="Developers" onBack={() => navigation.goBack()} />
    <ScrollView contentContainerStyle={developersStyles.body}>
      <Text style={[typography.bodySmall, developersStyles.intro]}>
        Ecolink was built and is maintained by the following developers.
      </Text>

      {DEVELOPERS.map((dev) => (
        <View key={dev.name} style={developersStyles.card}>
          <View style={developersStyles.cardTopRow}>
            <View style={developersStyles.avatar}>
              <Text style={[typography.h3, developersStyles.avatarText]}>{dev.initials}</Text>
            </View>
            <View style={developersStyles.infoWrap}>
              <Text style={[typography.body, developersStyles.name]}>{dev.name}</Text>
              <Text style={[typography.caption, developersStyles.role]}>{dev.role}</Text>
              <View style={developersStyles.bornRow}>
                <Ionicons name="gift-outline" size={13} color={colors.light.textSecondary} />
                <Text style={[typography.caption, developersStyles.bornText]}>Born {dev.born}</Text>
              </View>
            </View>
          </View>

          <Text style={[typography.bodySmall, developersStyles.bio]}>{dev.bio}</Text>

          <View style={developersStyles.socialRow}>
            <SocialButton icon="mail-outline" label="Email" url={`mailto:${dev.email}`} />
            <SocialButton icon="logo-github" label="GitHub" url={dev.github} />
            <SocialButton icon="logo-linkedin" label="LinkedIn" url={dev.linkedin} />
          </View>
        </View>
      ))}

      <Text style={[typography.h3, developersStyles.sectionTitle]}>Corrections & Suggestions</Text>
      <View style={developersStyles.contactCard}>
        <Text style={[typography.bodySmall, developersStyles.contactIntro]}>
          Spotted something wrong, or have an idea to make Ecolink better? Reach out to the
          developers directly by call or WhatsApp.
        </Text>
        {CONTACT_NUMBERS.map((number, index) => (
          <View
            key={number}
            style={[developersStyles.contactRow, index === 0 && developersStyles.contactRowFirst]}
          >
            <Text style={developersStyles.contactNumber}>{number}</Text>
            <View style={developersStyles.contactActions}>
              <TouchableOpacity
                style={developersStyles.contactButton}
                onPress={() => Linking.openURL(`tel:${number}`)}
              >
                <Ionicons name="call-outline" size={14} color={colors.primaryDark} />
                <Text style={developersStyles.contactButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={developersStyles.contactButton}
                onPress={() => Linking.openURL(`https://wa.me/${number.replace('+', '')}`)}
              >
                <Ionicons name="logo-whatsapp" size={14} color={colors.primaryDark} />
                <Text style={developersStyles.contactButtonText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  </View>
);

export default DevelopersScreen;
