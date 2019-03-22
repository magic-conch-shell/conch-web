import {
  AppBar,
  StyleRulesCallback,
  Theme,
  Toolbar,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import classNames from 'classnames';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface INavBarProps {
  isTransparent: boolean;
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
    height: '48px',
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
});

class NavBar extends React.Component<
  WithStyles<any> & INavBarProps,
  INavBarState
> {
  public render() {
    const { classes, isTransparent } = this.props;
    const logoColor = isTransparent ? 'black' : 'white';
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
                src={`https://s3.ca-central-1.amazonaws.com/jointable/logo_${logoColor}.png`}
              />
            </Link>
            <div className={classes.marginLeftAuto}>
              <div className={classes.actions}>{this.props.children}</div>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(NavBar);
