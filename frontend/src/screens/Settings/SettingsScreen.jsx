import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';
import profileStyles from '../../styles/profileStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const Row = ({ icon, label, right }) => (
  <View style={[profileStyles.menuItem, { justifyContent: 'space-between' }]}>
    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
      <View style={profileStyles.menuIconWrap}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[typography.body, profileStyles.menuLabel]}>{label}</Text>
    </View>
    {right}
  </View>
);

const SettingsScreen = ({ navigation }) => {
  const { logout } = useAuth();
  const { mode, toggleTheme } = useThemeMode();
  const [pushEnabled, setPushEnabled] = useState(true);
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  return (
    <ScrollView style={profileStyles.container}>
      <Header title="Settings" onBack={() => navigation.goBack()} />

      <View style={[profileStyles.section, { marginTop: spacing.md }]}>
        <Row
          icon="moon-outline"
          label="Dark Mode"
          right={
            <Switch
              value={mode === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.light.border, true: colors.primary }}
            />
          }
        />
        <Row
          icon="notifications-outline"
          label="Push Notifications"
          right={
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.light.border, true: colors.primary }}
            />
          }
        />
        <Row
          icon="warning-outline"
          label="Emergency Alerts"
          right={
            <Switch
              value={alertsEnabled}
              onValueChange={setAlertsEnabled}
              trackColor={{ false: colors.light.border, true: colors.primary }}
            />
          }
        />
      </View>

      <View style={profileStyles.section}>
        <TouchableOpacity style={profileStyles.menuItem} onPress={() => navigation.navigate('About')}>
          <View style={profileStyles.menuIconWrap}>
            <Ionicons name="information-circle-outline" size={18} color={colors.primary} />
          </View>
          <Text style={[typography.body, profileStyles.menuLabel]}>About Ecolink</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.light.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity style={[profileStyles.menuItem, profileStyles.logoutItem]} onPress={logout}>
          <View style={profileStyles.menuIconWrap}>
            <Ionicons name="log-out-outline" size={18} color={colors.error} />
          </View>
          <Text style={[typography.body, profileStyles.logoutText]}>Log out</Text>
        </TouchableOpacity>
      </View>

      <View style={profileStyles.bottomSpacer} />
    </ScrollView>
  );
};

export default SettingsScreen;
