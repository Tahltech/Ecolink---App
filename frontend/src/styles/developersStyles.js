import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const developersStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  body: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  intro: {
    color: colors.light.textSecondary,
    marginBottom: spacing.lg,
    lineHeight: 21,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  infoWrap: {
    flex: 1,
  },
  name: {
    color: colors.light.text,
  },
  role: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  bornRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  bornText: {
    color: colors.light.textSecondary,
    marginLeft: 4,
  },
  bio: {
    color: colors.light.textSecondary,
    marginTop: spacing.sm,
    lineHeight: 20,
  },
  socialRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    marginRight: spacing.sm,
  },
  socialButtonDisabled: {
    backgroundColor: colors.light.border,
  },
  socialButtonText: {
    color: colors.primaryDark,
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  socialButtonTextDisabled: {
    color: colors.light.textSecondary,
  },
  sectionTitle: {
    color: colors.light.text,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  contactCard: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  contactIntro: {
    color: colors.light.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
  },
  contactRowFirst: {
    borderTopWidth: 0,
  },
  contactNumber: {
    color: colors.light.text,
    fontWeight: '600',
  },
  contactActions: {
    flexDirection: 'row',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    marginLeft: spacing.sm,
  },
  contactButtonText: {
    color: colors.primaryDark,
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
});

export default developersStyles;
