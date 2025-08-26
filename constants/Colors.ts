const PRIMARY = '#064148';
const tintColorLight = PRIMARY;
// For dark mode, use a lighter variant of the primary so it stands out on dark backgrounds.
const tintColorDark = '#5fb0aa';

export default {
  light: {
    text: '#062b28',
    background: '#ffffff',
    tint: tintColorLight,
    tabIconDefault: '#9fb5b3',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#e6fffb',
    background: '#001a19',
    tint: tintColorDark,
    tabIconDefault: '#4a6664',
    tabIconSelected: tintColorDark,
  },
};
