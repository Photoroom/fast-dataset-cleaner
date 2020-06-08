import { Theme } from "react-with-styles";

export type PhotoRoomThemeType = {
  isNightMode: boolean;
  unit: number;
  color: any;
  speed: any;
  fontSize: any;
  fontFamily: string;
  opacity: any;
} & Theme;

const COLOR_PAGE_DAY = '#fff';
const COLOR_PAGE_NIGHT = '#333';

export default (nightMode: boolean) => ({
    isNightMode: nightMode,
    unit: 8,
    color: {
      PHOTOROOM: '#00155A',
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
    }
  });