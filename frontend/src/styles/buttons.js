import { StyleSheet } from 'react-native';
import { spacing, radius } from './spacing';

const buttonStyles = StyleSheet.create({
  base: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  outline: {
    borderWidth: 1.5,
    backgroundColor: 'transparent',
  },
});

export default buttonStyles;
