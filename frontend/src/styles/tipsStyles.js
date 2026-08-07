import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const tipsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  hero: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  heroTitle: {
    color: colors.white,
  },
  heroSummary: {
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.xs,
  },
  dailyBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  dailyBadgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 11,
    textTransform: 'uppercase',
  },
  section: {
    padding: spacing.lg,
  },
  sectionTitle: {
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  stackGap: {
    marginBottom: spacing.sm,
  },
});

export default tipsStyles;
