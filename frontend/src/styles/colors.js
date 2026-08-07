// Ecolink brand palette — green & white only. No blues/oranges in the UI chrome.
// Severity colors are a functional exception: the spec requires color-coded
// flood markers (green/yellow/orange/red), which must stay visually distinct
// from the green brand color to remain legible on the map.
const colors = {
  primary: '#0E7A3D',
  primaryDark: '#095C2E',
  primaryLight: '#3FA866',
  primaryPale: '#E4F3E8',
  mint: '#7FD99A',

  gradientPrimary: ['#0E7A3D', '#3FA866'],
  gradientDeep: ['#095C2E', '#0E7A3D'],
  gradientHero: ['rgba(6, 46, 24, 0.35)', 'rgba(6, 46, 24, 0.85)'],

  // Severity / alert colors (functional — used for flood report markers only)
  severityLow: '#2E9E5B',
  severityMedium: '#E0B400',
  severityHigh: '#E08A00',
  severityCritical: '#D13B3B',

  light: {
    background: '#F5FAF6',
    surface: '#FFFFFF',
    surfaceAlt: '#EAF6EE',
    text: '#0F241A',
    textSecondary: '#5C6F63',
    border: '#DCEBE1',
  },

  dark: {
    background: '#08150F',
    surface: '#102019',
    surfaceAlt: '#152A20',
    text: '#EAF5EE',
    textSecondary: '#9CB3A5',
    border: '#1E3327',
  },

  white: '#FFFFFF',
  black: '#000000',
  error: '#D13B3B',
  success: '#2E9E5B',
  warning: '#E0B400',
};

export default colors;
