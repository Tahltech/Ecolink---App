import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const educationStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  chipsRow: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.pill,
    backgroundColor: colors.light.surface,
    borderWidth: 1,
    borderColor: colors.light.border,
    marginRight: spacing.sm,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    color: colors.light.textSecondary,
    fontWeight: '600',
    fontSize: 13,
  },
  chipTextActive: {
    color: colors.white,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  topicCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  topicIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  topicTextWrap: {
    flex: 1,
  },
  topicTitle: {
    color: colors.light.text,
  },
  topicCategory: {
    color: colors.light.textSecondary,
    marginTop: 2,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  detailBody: {
    padding: spacing.lg,
  },
  detailCategoryTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.primaryPale,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.pill,
    marginBottom: spacing.sm,
  },
  detailCategoryText: {
    color: colors.primaryDark,
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  detailTitle: {
    color: colors.light.text,
    marginBottom: spacing.md,
  },
  detailText: {
    color: colors.light.text,
    lineHeight: 24,
  },
});

export default educationStyles;
