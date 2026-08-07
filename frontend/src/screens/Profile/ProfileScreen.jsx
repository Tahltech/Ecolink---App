import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { updateMyProfile } from '../../services/userApi';
import profileStyles from '../../styles/profileStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { spacing } from '../../styles/spacing';

const MENU_ITEMS = [
  { label: 'Local Climate Tips', icon: 'bulb-outline', screen: 'LocalTips' },
  { label: 'Climate Education', icon: 'book-outline', screen: 'Education' },
  { label: 'Health & Diseases', icon: 'medkit-outline', screen: 'Health' },
  { label: 'Flood & Risk Map', icon: 'map-outline', screen: 'Maps' },
  { label: 'Notifications', icon: 'notifications-outline', screen: 'Notifications' },
  { label: 'Developers', icon: 'code-slash-outline', screen: 'Developers' },
  { label: 'Settings', icon: 'settings-outline', screen: 'Settings' },
];

const ProfileScreen = ({ navigation }) => {
  const { user, logout, refreshUser } = useAuth();
  const insets = useSafeAreaInsets();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullname: user?.fullname || '',
    phone: user?.phone || '',
    region: user?.region || '',
    district: user?.district || '',
  });
  const [saving, setSaving] = useState(false);

  const update = (key) => (value) => setForm((prev) => ({ ...prev, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateMyProfile(form);
      await refreshUser();
      setEditing(false);
    } catch {
      // Keep the form open so the user can retry.
    } finally {
      setSaving(false);
    }
  };

  const initial = (user?.fullname || 'E').charAt(0).toUpperCase();

  return (
    <ScrollView style={profileStyles.container}>
      <StatusBar style="light" />
      <LinearGradient colors={colors.gradientDeep} style={[profileStyles.hero, { paddingTop: insets.top + spacing.md }]}>
        <View style={profileStyles.avatar}>
          <Text style={[typography.h1, profileStyles.avatarText]}>{initial}</Text>
        </View>
        <Text style={[typography.h3, profileStyles.name]}>{user?.fullname || 'Ecolink User'}</Text>
        <Text style={[typography.bodySmall, profileStyles.email]}>{user?.email}</Text>
        <TouchableOpacity style={profileStyles.editButton} onPress={() => setEditing((v) => !v)}>
          <Ionicons name={editing ? 'close-outline' : 'create-outline'} size={16} color={colors.white} />
          <Text style={profileStyles.editButtonText}>{editing ? 'Cancel' : 'Edit Profile'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={profileStyles.section}>
        {editing ? (
          <View style={profileStyles.infoCard}>
            <TextInput
              style={profileStyles.input}
              placeholder="Full name"
              value={form.fullname}
              onChangeText={update('fullname')}
            />
            <TextInput
              style={profileStyles.input}
              placeholder="Phone"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={update('phone')}
            />
            <TextInput
              style={profileStyles.input}
              placeholder="Region"
              value={form.region}
              onChangeText={update('region')}
            />
            <TextInput
              style={profileStyles.input}
              placeholder="District"
              value={form.district}
              onChangeText={update('district')}
            />
            <TouchableOpacity onPress={handleSave} disabled={saving}>
              <Text style={{ color: colors.primary, fontWeight: '700', textAlign: 'center', padding: 8 }}>
                {saving ? 'Saving...' : 'Save changes'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={profileStyles.infoCard}>
            <Text style={typography.bodySmall}>Region: {user?.region || 'Not set'}</Text>
            <Text style={[typography.bodySmall, { marginTop: 6 }]}>
              District: {user?.district || 'Not set'}
            </Text>
            <Text style={[typography.bodySmall, { marginTop: 6 }]}>
              Phone: {user?.phone || 'Not set'}
            </Text>
          </View>
        )}
      </View>

      <View style={profileStyles.section}>
        {MENU_ITEMS.map((item) => (
          <TouchableOpacity
            key={item.label}
            style={profileStyles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={profileStyles.menuIconWrap}>
              <Ionicons name={item.icon} size={18} color={colors.primary} />
            </View>
            <Text style={[typography.body, profileStyles.menuLabel]}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.light.textSecondary} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[profileStyles.menuItem, profileStyles.logoutItem]}
          onPress={logout}
        >
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

export default ProfileScreen;
