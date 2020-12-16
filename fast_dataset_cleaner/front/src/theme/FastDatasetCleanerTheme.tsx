import { Theme } from "react-with-styles";

export type FastDatasetCleanerThemeType = {
  isNightMode: boolean;
  unit: number;
  color: any;
  speed: any;
  fontSize: any;
  fontFamily: string;
  opacity: any;
  breakpoints: any;
} & Theme;

const COLOR_PAGE_DAY = '#fff';
const COLOR_PAGE_NIGHT = '#333';

export default (nightMode: boolean) => ({
    isNightMode: nightMode,
    unit: 8,
    color: {
      FAST_DATASET_CLEANER: '#00155A',
      FAST_DATASET_CLEANER_LIGHT: '#2457ff',
      page: nightMode ? COLOR_PAGE_NIGHT : COLOR_PAGE_DAY,
      reversePage: nightMode ? COLOR_PAGE_DAY : COLOR_PAGE_NIGHT,
      pageNight: COLOR_PAGE_NIGHT,
      pageDay: COLOR_PAGE_DAY,
      VALID: '#3caf40',
      NOTVALID: '#e45247',
      banner: '#000e3e',
      bannerText: '#fff',
      bannerSeparator: '#ddd',
      overlay: '#000',
    },
    speed: {
      fast: 0.3,
      veryFast: 0.15,
      ultraFast: 0,
    },
    fontSize: {
      small: 10,
      medium: 14,
      large: 16,
      xlarge: 20,
    },
    fontFamily: 'Ubuntu',
    opacity: {
      light: 0.2,
      medium: 0.5,
      dark: 0.8,
    },
    breakpoints: {
      small: '@media (max-width: 639px)',
      medium: '@media (min-width: 640px) and (max-width: 1047px)',
      large: '@media (min-width: 1048px) and (max-width: 1450px)',
      xlarge: '@media (min-width: 1451px)',
    }
  });