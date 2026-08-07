import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const healthStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  listContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  detailContainer: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  detailBody: {
    padding: spacing.lg,
  },
  detailIconWrap: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  detailTitle: {
    color: colors.light.text,
    marginBottom: spacing.lg,
  },
  infoBlock: {
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
  },
  infoLabel: {
    color: colors.primaryDark,
    fontWeight: '700',
    marginBottom: 4,
  },
  infoText: {
    color: colors.light.text,
    lineHeight: 22,
  },
});

export default healthStyles;
