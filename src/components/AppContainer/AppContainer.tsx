import {
  MuiThemeProvider,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';

import { mainTheme } from '../../themes/mainTheme';
import App from '../App/App';
import {
  ISettings,
  INumberSettings,
  IStringSettings,
} from '../../interfaces/Settings';

export enum ThemeTypes {
  LIGHT,
  DARK,
}

export interface IAppContainerProps {
  placeholder?: string;
}

export interface IAppContainerState {
  userSettings: ISettings;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class AppContainer extends React.Component<
  WithStyles<any> & IAppContainerProps,
  IAppContainerState
> {
  public state = {
    userSettings: {
      themeType: ThemeTypes.LIGHT,
    } as ISettings,
  };

  public componentDidMount() {
    this.getAllSettings();
  }

  public getAllSettings = () => {
    const { userSettings } = this.state;

    const defaultNumberSettings: INumberSettings = {
      themeType: ThemeTypes.LIGHT,
    };

    const defaultStringSettings: IStringSettings = {
      timeZone: 'America/Toronto',
    };

    Object.keys(defaultNumberSettings).map((key) => {
      const localSetting =
        localStorage.getItem(key) || defaultNumberSettings[key];
      const asNumber = parseInt(localSetting, 10);
      userSettings[key] = asNumber;
      this.setState({ userSettings });
    });

    Object.keys(defaultStringSettings).map((key) => {
      const localSetting =
        localStorage.getItem(key) || defaultStringSettings[key];
      userSettings[key] = localSetting;
      this.setState({ userSettings });
    });
  };

  public toggleTheme = () => {
    const newSettings = { ...this.state.userSettings };
    newSettings.themeType = 1 - newSettings.themeType;
    this.setState({ userSettings: newSettings }, () =>
      localStorage.setItem('themeType', `${newSettings.themeType}`)
    );
  };

  public setTimeZone = (timeZone: string) => {
    const newSettings = { ...this.state.userSettings };
    newSettings.timeZone = timeZone;
    this.setState({ userSettings: newSettings }, () =>
      localStorage.setItem('timeZone', `${newSettings.timeZone}`)
    );
  };

  public render() {
    const { userSettings } = this.state;
    const { themeType } = userSettings;
    const currentTheme = mainTheme(themeType);
    return (
      <MuiThemeProvider theme={currentTheme}>
        <App
          toggleTheme={this.toggleTheme}
          setTimeZone={this.setTimeZone}
          userSettings={userSettings}
        />
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(AppContainer);
