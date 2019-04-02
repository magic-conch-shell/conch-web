import { ThemeTypes } from '../themes/mainTheme';

export interface ISettings extends INumberSettings, IStringSettings {}

export interface INumberSettings {
  themeType: ThemeTypes;
}

export interface IStringSettings {
  timeZone: string;
}
