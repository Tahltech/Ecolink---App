import React from 'react';
import { View, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import authStyles from '../../styles/authStyles';
import colors from '../../styles/colors';

/**
 * Text field with a leading icon, used across the auth flow.
 * Props: icon (Ionicons name), plus any standard TextInput prop.
 */
const Input = ({ icon, ...inputProps }) => (
  <View style={authStyles.inputWrap}>
    <Ionicons name={icon} size={18} color={colors.primary} style={authStyles.inputIcon} />
    <TextInput
      style={authStyles.input}
      placeholderTextColor={colors.light.textSecondary}
      {...inputProps}
    />
  </View>
);

export default Input;
