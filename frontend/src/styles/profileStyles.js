import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarText: {
    color: colors.primary,
    fontWeight: '700',
  },
  name: {
    color: colors.white,
  },
  email: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    marginTop: spacing.md,
  },
  editButtonText: {
    color: colors.white,
    fontWeight: '600',
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  infoCard: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    backgroundColor: colors.light.surface,
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  menuLabel: {
    flex: 1,
    color: colors.light.text,
  },
  logoutItem: {
    marginTop: spacing.md,
  },
  logoutText: {
    color: colors.error,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

export default profileStyles;
