import * as React from 'react';

import {
  IconButton,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import FlashOff from '@material-ui/icons/FlashOff';
import FlashOn from '@material-ui/icons/FlashOn';
import { ThemeTypes } from '../AppContainer/AppContainer';

export interface IFooterProps extends WithStyles<typeof styles> {
  theme: ThemeTypes;
  toggleTheme: () => void;
}

export interface IFooterState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    display: 'flex',
  },
  toggleThemeButtonContainer: {
    marginLeft: 'auto',
    marginRight: '5px',
    marginBottom: '5px',
  },
});

class Footer extends React.Component<IFooterProps, IFooterState> {
  public render() {
    const { classes, theme, toggleTheme } = this.props;
    return (
      <div className={classes.root}>
        <div className={classes.toggleThemeButtonContainer}>
          <IconButton onClick={toggleTheme}>
            {theme === ThemeTypes.LIGHT && (
              <FlashOn className={classes.lightIcon} />
            )}
            {theme === ThemeTypes.DARK && (
              <FlashOff className={classes.darkIcon} />
            )}
          </IconButton>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Footer);
