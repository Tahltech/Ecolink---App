import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import buttonStyles from '../../styles/buttons';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

/**
 * Reusable gradient button.
 * Props: title, onPress, loading, disabled, variant ('primary' | 'outline')
 */
const Button = ({ title, onPress, loading = false, disabled = false, variant = 'primary' }) => {
  const isDisabled = disabled || loading;

  if (variant === 'outline') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={isDisabled}
        style={[
          buttonStyles.base,
          buttonStyles.fullWidth,
          buttonStyles.outline,
          { borderColor: colors.primary },
          isDisabled && buttonStyles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={[typography.button, { color: colors.primary }]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} disabled={isDisabled} activeOpacity={0.85}>
      <LinearGradient
        colors={colors.gradientPrimary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[buttonStyles.base, buttonStyles.fullWidth, isDisabled && buttonStyles.disabled]}
      >
        {loading ? (
          <ActivityIndicator color={colors.white} />
        ) : (
          <Text style={[typography.button, { color: colors.white }]}>{title}</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default Button;
