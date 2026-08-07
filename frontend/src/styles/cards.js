import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const shadow = {
  shadowColor: colors.primaryDark,
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 14,
  elevation: 3,
};

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    ...shadow,
  },

  // Widget (small stat tile — Home screen grid)
  widget: {
    width: '31%',
    backgroundColor: colors.light.surface,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    marginBottom: spacing.sm,
    ...shadow,
  },
  widgetIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  widgetValue: {
    color: colors.light.text,
    marginTop: 2,
  },
  widgetLabel: {
    color: colors.light.textSecondary,
    textAlign: 'center',
  },

  // WeatherCard (hero current-conditions card)
  weatherCard: {
    borderRadius: radius.xl,
    padding: spacing.lg,
    overflow: 'hidden',
  },
  weatherRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  weatherTemp: {
    color: colors.white,
    fontSize: 56,
    fontWeight: '700',
  },
  weatherMeta: {
    color: 'rgba(255,255,255,0.9)',
  },
  weatherStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.25)',
  },
  weatherStatItem: {
    alignItems: 'center',
  },
  weatherStatLabel: {
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },

  // NewsCard
  newsCard: {
    flexDirection: 'row',
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    ...shadow,
  },
  newsImage: {
    width: 96,
    height: 96,
    backgroundColor: colors.primaryPale,
  },
  newsBody: {
    flex: 1,
    padding: spacing.sm,
    justifyContent: 'space-between',
  },
  newsCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    marginBottom: 4,
  },
  newsCategoryText: {
    color: colors.primaryDark,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  newsTitle: {
    color: colors.light.text,
  },
  newsFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  newsSource: {
    color: colors.light.textSecondary,
  },

  // ClimateCard (tip / fact)
  climateCard: {
    flexDirection: 'row',
    backgroundColor: colors.primaryPale,
    borderRadius: radius.lg,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  climateIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
    ...shadow,
  },
  climateTextWrap: {
    flex: 1,
  },
  climateTitle: {
    color: colors.primaryDark,
    marginBottom: 2,
  },
  climateBody: {
    color: colors.light.text,
  },

  // FloodReportCard
  floodCard: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  floodHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  floodLocation: {
    color: colors.light.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  severityBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.pill,
  },
  severityBadgeText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  floodDescription: {
    color: colors.light.textSecondary,
    marginBottom: spacing.xs,
  },
  floodFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusPill: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.pill,
    borderWidth: 1,
  },

  // DiseaseCard
  diseaseCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadow,
  },
  diseaseIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  diseaseTextWrap: {
    flex: 1,
  },
  diseaseName: {
    color: colors.light.text,
  },
  diseaseSubtext: {
    color: colors.light.textSecondary,
    marginTop: 2,
  },
});

export default cardStyles;
