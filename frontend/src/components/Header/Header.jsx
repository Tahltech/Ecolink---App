import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import layoutStyles from '../../styles/layout';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { spacing } from '../../styles/spacing';

/**
 * Shared top app bar. Props: title, subtitle, onBack, rightIcon, onRightPress.
 * Pads itself below the status bar/notch so content never renders under it.
 */
const Header = ({ title, subtitle, onBack, rightIcon, onRightPress }) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[layoutStyles.header, { paddingTop: insets.top + spacing.sm }]}>
      <View style={layoutStyles.headerLeft}>
        {onBack ? (
          <TouchableOpacity style={layoutStyles.headerIconButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={22} color={colors.primaryDark} />
          </TouchableOpacity>
        ) : null}
        <View style={layoutStyles.headerTitleWrap}>
          <Text style={[typography.h3, layoutStyles.headerTitle]} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[typography.bodySmall, layoutStyles.headerSubtitle]} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

      {rightIcon ? (
        <TouchableOpacity style={layoutStyles.headerIconButton} onPress={onRightPress}>
          <Ionicons name={rightIcon} size={20} color={colors.primaryDark} />
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

export default Header;
