import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';
import globalStyles from '../../styles/globalStyles';
import colors from '../../styles/colors';
import typography from '../../styles/typography';

const Loading = ({ label = 'Loading...' }) => (
  <View style={globalStyles.center}>
    <ActivityIndicator size="large" color={colors.primary} />
    <Text style={[typography.bodySmall, { marginTop: 12, color: colors.light.textSecondary }]}>
      {label}
    </Text>
  </View>
);

export default Loading;
