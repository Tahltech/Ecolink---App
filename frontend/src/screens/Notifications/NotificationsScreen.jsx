import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../../services/notificationApi';
import notificationStyles from '../../styles/notificationStyles';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { FALLBACK_NOTIFICATIONS } from '../../utils/mockNotificationData';

const ICONS = {
  weather: 'rainy-outline',
  flood: 'warning-outline',
  heat: 'flame-outline',
  disease: 'medkit-outline',
  tip: 'bulb-outline',
  news: 'newspaper-outline',
};

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getNotifications();
      setNotifications(res.data?.notifications ?? res.notifications ?? []);
    } catch {
      setNotifications(FALLBACK_NOTIFICATIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handlePress = async (item) => {
    if (!item.read) {
      setNotifications((prev) => prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)));
      try {
        await markNotificationRead(item.id);
      } catch {
        // Non-critical — the item stays visually read for this session.
      }
    }

    // Tip notifications open the full local-tips list for that region so
    // users can read everything to improve their area's climate, not just
    // the one line that fit in the notification.
    if (item.type === 'tip') {
      navigation.navigate('LocalTips', { region: item.region });
    }
  };

  const handleMarkAll = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await markAllNotificationsRead();
    } catch {
      // Non-critical.
    }
  };

  if (loading) return <Loading label="Loading notifications..." />;

  return (
    <View style={notificationStyles.container}>
      <Header title="Notifications" onBack={() => navigation.goBack()} />

      {notifications.length ? (
        <View style={notificationStyles.markAllRow}>
          <TouchableOpacity onPress={handleMarkAll}>
            <Text style={notificationStyles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <FlatList
        data={notifications}
        keyExtractor={(item, index) => String(item.id ?? index)}
        contentContainerStyle={notificationStyles.listContent}
        ListEmptyComponent={
          <View style={notificationStyles.emptyWrap}>
            <Ionicons name="notifications-off-outline" size={40} color={colors.light.textSecondary} />
            <Text style={[typography.body, notificationStyles.emptyText]}>You're all caught up</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[notificationStyles.item, !item.read && notificationStyles.itemUnread]}
            onPress={() => handlePress(item)}
          >
            <View style={notificationStyles.iconWrap}>
              <Ionicons name={ICONS[item.type] || 'notifications-outline'} size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.body, notificationStyles.title]}>{item.title}</Text>
              <Text style={[typography.bodySmall, notificationStyles.message]}>{item.message}</Text>
              <Text style={[typography.caption, notificationStyles.time]}>{item.created_at}</Text>
            </View>
            {item.type === 'tip' ? (
              <Ionicons name="chevron-forward" size={18} color={colors.light.textSecondary} />
            ) : null}
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default NotificationsScreen;
