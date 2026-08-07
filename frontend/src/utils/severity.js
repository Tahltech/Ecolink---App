import colors from '../styles/colors';

export const SEVERITY_LEVELS = ['Low', 'Medium', 'High', 'Critical'];

export const severityColor = (severity) => {
  switch (severity) {
    case 'Low':
      return colors.severityLow;
    case 'Medium':
      return colors.severityMedium;
    case 'High':
      return colors.severityHigh;
    case 'Critical':
      return colors.severityCritical;
    default:
      return colors.severityLow;
  }
};

export const STATUS_LEVELS = ['Pending', 'Verified', 'Rejected', 'Resolved'];

export const statusColor = (status) => {
  switch (status) {
    case 'Verified':
      return colors.success;
    case 'Rejected':
      return colors.error;
    case 'Resolved':
      return colors.primaryDark;
    default:
      return colors.warning;
  }
};
