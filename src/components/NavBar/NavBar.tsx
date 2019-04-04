import {
  AppBar,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import classNames from 'classnames';
import * as React from 'react';

import { ThemeTypes } from '../AppContainer/AppContainer';
import NavBarToolbar from './NavBarToolbar';

export interface INavBarProps {
  isTransparent: boolean;
  theme: ThemeTypes;
  toggleTheme: () => void;
}

export interface INavBarState {
  scrollTop: number;
}

export const DRAWER_WIDTH = 280;

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    height: '90px',
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    backgroundColor: theme.palette.background.paper,
  },
  appBarShift: {
    marginLeft: DRAWER_WIDTH,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarTransparent: {
    backgroundColor: 'rgba(0,0,0,0)',
    boxShadow: 'none',
  },
  appBarLogo: {
    height: '64px',
  },
  toolbar: {
    display: 'flex',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  marginLeftAuto: {
    marginLeft: 'auto',
    display: 'flex',
  },
  addressContainer: {
    marginRight: theme.spacing.unit * 4,
    '& > p,h3,span': {
      color: 'white',
    },
    '& > h3': {
      fontSize: '1rem',
      fontWeight: 'bold',
    },
  },
  addressLabel: {
    textAlign: 'right',
  },
  lightIcon: {
    color: theme.palette.primary.main,
  },
  darkIcon: {
    color: theme.palette.text.primary,
  },
});

class NavBar extends React.Component<
  WithStyles<any> & INavBarProps,
  INavBarState
> {
  public state = {
    scrollTop: 0,
  };

  public componentDidMount() {
    window.addEventListener('scroll', () => {
      this.setState({ scrollTop: document.documentElement.scrollTop });
    });
  }

  public render() {
    const { scrollTop } = this.state;
    const { children, classes, isTransparent, theme } = this.props;
    const localIsTransparent = isTransparent || scrollTop === 0;
    const logoColor = theme === ThemeTypes.LIGHT ? 'purple' : 'white';
    return (
      <AppBar
        position="fixed"
        className={classNames(
          classes.appBar,
          localIsTransparent && classes.appBarTransparent
        )}
      >
        <NavBarToolbar logoColor={logoColor}>{children}</NavBarToolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(NavBar);
