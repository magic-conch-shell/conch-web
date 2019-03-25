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

export enum ThemeTypes {
  LIGHT,
  DARK,
}

export interface IAppContainerProps {
  placeholder?: string;
}

export interface IAppContainerState {
  theme: ThemeTypes;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class AppContainer extends React.Component<
  WithStyles<any> & IAppContainerProps,
  IAppContainerState
> {
  public state = {
    theme: ThemeTypes.LIGHT,
  };

  public componentDidMount() {
    const themeType = localStorage.getItem('themeType');

    if (!themeType) {
      localStorage.setItem('themeType', `${ThemeTypes.LIGHT}`);
    } else {
      const asThemeType = parseInt(themeType, 10) as ThemeTypes;
      this.setState({ theme: asThemeType });
    }
  }

  public toggleTheme = () => {
    this.setState(
      (prevState) => ({ theme: 1 - prevState.theme }),
      () => localStorage.setItem('themeType', `${this.state.theme}`)
    );
  };

  public render() {
    const { theme } = this.state;
    const currentTheme = mainTheme(theme);
    console.log(currentTheme);
    return (
      <MuiThemeProvider theme={currentTheme}>
        <App toggleTheme={this.toggleTheme} theme={theme} />
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(AppContainer);
