import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const aboutStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  body: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoImage: {
    width: 76,
    height: 76,
    marginBottom: spacing.sm,
  },
  appName: {
    color: colors.light.text,
  },
  tagline: {
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  paragraph: {
    color: colors.light.text,
    lineHeight: 22,
    marginBottom: spacing.sm,
  },
  paragraphLast: {
    marginBottom: 0,
  },
  sectionTitle: {
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  featureIconWrap: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  featureTextWrap: {
    flex: 1,
  },
  featureTitle: {
    color: colors.light.text,
    fontWeight: '700',
  },
  featureDescription: {
    color: colors.light.textSecondary,
    marginTop: 2,
    lineHeight: 19,
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  footerText: {
    color: colors.light.textSecondary,
  },
});

export default aboutStyles;
