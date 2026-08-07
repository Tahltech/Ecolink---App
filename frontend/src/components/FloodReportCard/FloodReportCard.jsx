import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import cardStyles from '../../styles/cards';
import typography from '../../styles/typography';
import colors from '../../styles/colors';
import { severityColor, statusColor } from '../../utils/severity';

/**
 * List item for a community flood report.
 * Props: report {village, subdivision, description, severity, status, created_at}, onPress
 */
const FloodReportCard = ({ report, onPress }) => (
  <TouchableOpacity style={cardStyles.floodCard} activeOpacity={0.85} onPress={onPress}>
    <View style={cardStyles.floodHeaderRow}>
      <Text style={[typography.body, cardStyles.floodLocation]} numberOfLines={1}>
        {report.village}, {report.subdivision}
      </Text>
      <View style={[cardStyles.severityBadge, { backgroundColor: severityColor(report.severity) }]}>
        <Text style={cardStyles.severityBadgeText}>{report.severity}</Text>
      </View>
    </View>

    <Text style={[typography.bodySmall, cardStyles.floodDescription]} numberOfLines={2}>
      {report.description}
    </Text>

    <View style={cardStyles.floodFooterRow}>
      <View style={[cardStyles.statusPill, { borderColor: statusColor(report.status) }]}>
        <Text style={[typography.caption, { color: statusColor(report.status), fontWeight: '600' }]}>
          {report.status}
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Ionicons name="time-outline" size={14} color={colors.light.textSecondary} />
        <Text style={[typography.caption, { color: colors.light.textSecondary, marginLeft: 4 }]}>
          {report.created_at}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default FloodReportCard;
