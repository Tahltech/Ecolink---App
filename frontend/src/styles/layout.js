import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const layoutStyles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    backgroundColor: colors.light.background,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primaryPale,
  },
  headerTitleWrap: {
    marginLeft: spacing.sm,
    flexShrink: 1,
  },
  headerTitle: {
    color: colors.light.text,
  },
  headerSubtitle: {
    color: colors.light.textSecondary,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.light.border,
    backgroundColor: colors.light.surface,
    padding: spacing.md,
  },
});

export default layoutStyles;
