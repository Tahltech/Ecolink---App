import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const weatherStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  section: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    color: colors.light.text,
    marginBottom: spacing.sm,
  },
  sunRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
  },
  sunItem: {
    alignItems: 'center',
  },
  sunLabel: {
    color: colors.light.textSecondary,
    marginTop: 4,
  },
  sunValue: {
    color: colors.light.text,
  },
  widgetGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  forecastCard: {
    width: 84,
    backgroundColor: colors.light.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    marginRight: spacing.sm,
  },
  forecastDay: {
    color: colors.light.textSecondary,
  },
  forecastTemp: {
    color: colors.light.text,
    marginTop: spacing.xs,
  },
  forecastTempLow: {
    color: colors.light.textSecondary,
  },
  chartCard: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  chartRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  chartBarWrap: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
  },
  chartLabel: {
    color: colors.light.textSecondary,
    marginTop: spacing.xs,
  },
  fallbackNote: {
    color: colors.light.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    marginHorizontal: spacing.lg,
  },
  initiativeCard: {
    marginBottom: spacing.sm,
  },
  initiativeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  initiativeName: {
    color: colors.light.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  initiativeFocusTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  initiativeFocusText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
  },
  initiativeDescription: {
    color: colors.light.textSecondary,
    marginBottom: spacing.sm,
  },
  initiativeSourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  initiativeSourceText: {
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  bottomSpacer: {
    height: spacing.xxl,
  },
});

export default weatherStyles;
