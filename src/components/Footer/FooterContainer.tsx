import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';
import { ThemeTypes } from '../AppContainer/AppContainer';
import Footer from './Footer';

export interface IFooterContainerProps extends WithStyles<typeof styles> {
  theme: ThemeTypes;
  toggleTheme: () => void;
}

export interface IFooterContainerState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
});

class FooterContainer extends React.Component<
  IFooterContainerProps,
  IFooterContainerState
> {
  public render() {
    const { classes, theme, toggleTheme } = this.props;
    return (
      <div className={classes.root}>
        <Footer theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }
}

export default withStyles(styles)(FooterContainer);
