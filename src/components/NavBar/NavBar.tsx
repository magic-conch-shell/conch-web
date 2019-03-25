import {
  AppBar,
  StyleRulesCallback,
  Theme,
  Toolbar,
  WithStyles,
  withStyles,
  IconButton,
} from '@material-ui/core';
import { FlashOn, FlashOff } from '@material-ui/icons';
import classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { ThemeTypes } from '../AppContainer/AppContainer';

export interface INavBarProps {
  isTransparent: boolean;
  theme: ThemeTypes;
  toggleTheme: () => void;
}

export interface INavBarState {
  placeholder?: string;
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
  root: {
    height: '90px',
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
  public render() {
    const { classes, isTransparent, theme, toggleTheme } = this.props;
    const logoColor = theme === ThemeTypes.LIGHT ? 'purple' : 'white';
    return (
      <div className={classes.root}>
        <AppBar
          position="fixed"
          className={classNames(
            classes.appBar,
            isTransparent && classes.appBarTransparent
          )}
        >
          <Toolbar className={classes.toolbar}>
            <Link to="/">
              <img
                className={classes.appBarLogo}
                src={`https://s3.ca-central-1.amazonaws.com/conch-resources/conch_logo_${logoColor}.png`}
              />
            </Link>
            <div className={classes.marginLeftAuto}>
              <IconButton onClick={toggleTheme}>
                {theme === ThemeTypes.LIGHT && (
                  <FlashOn className={classes.lightIcon} />
                )}
                {theme === ThemeTypes.DARK && (
                  <FlashOff className={classes.darkIcon} />
                )}
              </IconButton>
              <div className={classes.actions}>{this.props.children}</div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
