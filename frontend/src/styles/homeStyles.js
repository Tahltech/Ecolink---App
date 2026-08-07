import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  hero: {
    paddingTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + spacing.lg,
    borderBottomLeftRadius: radius.xl,
    borderBottomRightRadius: radius.xl,
    overflow: 'hidden',
  },
  treeline: {
    position: 'absolute',
    bottom: -10,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandImage: {
    width: 34,
    height: 34,
    marginRight: spacing.xs,
  },
  brandText: {
    color: colors.white,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  bellButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    color: colors.white,
    marginTop: spacing.lg,
  },
  subGreeting: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  weatherCardFloating: {
    marginTop: spacing.lg,
  },
  weatherCardWrap: {
    paddingHorizontal: spacing.lg,
    marginTop: -spacing.xl,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    color: colors.light.text,
  },
  seeAll: {
    color: colors.primary,
    fontWeight: '600',
  },
  widgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  alertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: radius.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.severityHigh,
    padding: spacing.sm,
    marginBottom: spacing.sm,
  },
  alertIconWrap: {
    marginRight: spacing.sm,
  },
  alertType: {
    color: colors.light.text,
    fontWeight: '700',
  },
  alertMessage: {
    color: colors.light.textSecondary,
  },
  stackGap: {
    marginBottom: spacing.sm,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

export default homeStyles;
