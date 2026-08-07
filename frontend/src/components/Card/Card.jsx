import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import cardStyles from '../../styles/cards';

/**
 * Generic white surface card with rounded corners and soft shadow.
 * Renders as a TouchableOpacity when onPress is provided.
 */
const Card = ({ children, onPress, style }) => {
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.85} onPress={onPress} style={[cardStyles.card, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return <View style={[cardStyles.card, style]}>{children}</View>;
};

export default Card;
