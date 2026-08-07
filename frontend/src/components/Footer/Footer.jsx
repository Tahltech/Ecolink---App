import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import layoutStyles from '../../styles/layout';

/**
 * Sticky bottom bar for screen-level actions (e.g. a submit button on a form).
 */
const Footer = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[layoutStyles.footer, { paddingBottom: insets.bottom || 16 }]}>{children}</View>
  );
};

export default Footer;
