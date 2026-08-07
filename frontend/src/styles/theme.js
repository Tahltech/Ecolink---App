import colors from './colors';

const buildTheme = (mode) => ({
  mode,
  colors: {
    ...colors,
    ...colors[mode],
  },
});

export const lightTheme = buildTheme('light');
export const darkTheme = buildTheme('dark');

export const getTheme = (mode) => (mode === 'dark' ? darkTheme : lightTheme);
