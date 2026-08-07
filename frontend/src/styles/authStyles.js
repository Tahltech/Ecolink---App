import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const authStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
    backgroundColor: colors.light.background,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryPale,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  logoImage: {
    width: 84,
    height: 84,
    marginBottom: spacing.sm,
  },
  logoText: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  title: {
    marginBottom: spacing.xs,
    color: colors.light.text,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: spacing.xl,
    color: colors.light.textSecondary,
    textAlign: 'center',
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.light.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.light.surface,
  },
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.sm + 4,
    fontSize: 16,
    color: colors.light.text,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.md,
  },
  successText: {
    color: colors.success,
    marginBottom: spacing.md,
  },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  linkText: {
    color: colors.primary,
    fontWeight: '600',
  },
  forgotLink: {
    textAlign: 'center',
    marginTop: spacing.md,
    color: colors.light.textSecondary,
  },
});

export default authStyles;
