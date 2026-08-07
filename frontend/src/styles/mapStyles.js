import { StyleSheet } from 'react-native';
import colors from './colors';
import { spacing, radius } from './spacing';

const mapStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light.background,
  },
  map: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    left: spacing.lg,
    bottom: spacing.lg,
    backgroundColor: colors.light.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: spacing.xs,
  },
  legendText: {
    color: colors.light.text,
    fontSize: 12,
  },
  markerPin: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.white,
  },
  calloutBox: {
    width: 180,
    padding: spacing.xs,
  },
  calloutTitle: {
    color: colors.light.text,
    fontWeight: '700',
  },
  calloutText: {
    color: colors.light.textSecondary,
    marginTop: 2,
  },
});

export default mapStyles;
