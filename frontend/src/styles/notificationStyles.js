import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const notificationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  markAllRow: {
    paddingHorizontal: spacing.lg,
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
  },
  markAllText: {
    color: colors.primary,
    fontWeight: '600',
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  itemUnread: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  title: {
    color: colors.light.text,
  },
  message: {
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  time: {
    color: colors.light.textSecondary,
    marginTop: 4,
  },
  emptyWrap: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  emptyText: {
    color: colors.light.textSecondary,
    marginTop: spacing.sm,
  },
});

export default notificationStyles;
