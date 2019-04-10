import * as React from 'react';

import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { StyleRulesCallback, Theme, Toolbar, WithStyles, withStyles } from '@material-ui/core';

export interface INavBarToolbarProps extends WithStyles<typeof styles> {
  logoColor: string;
}

export interface INavBarToolbarState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  appBarLogo: {
    height: '64px',
    [theme.breakpoints.only('xs')]: {
      height: '42px'
    },
  },
  toolbar: {
    display: 'flex',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
  toolbarAuth: {
    display: 'flex',
    marginTop: 'auto',
    marginBottom: 'auto',
    '& > a': {
      [theme.breakpoints.only('xs')]: {
        width: '100%',
        display: 'flex',
        marginTop: '50px'
      }
    }
  },
  appBarLogoAuthPage: {
    height: '64px',
    [theme.breakpoints.only('xs')]: {
      height: '80px',
      margin: 'auto',
    }
  },
  marginLeftAuto: {
    marginLeft: 'auto',
    display: 'flex'
  },
});

class NavBarToolbar extends React.Component<
  RouteComponentProps<any> & INavBarToolbarProps,
  INavBarToolbarState
  > {
  public render() {
    const { classes, location, logoColor } = this.props;
    return (
      <Toolbar className={location.pathname === '/login' ? classes.toolbarAuth : classes.toolbar}>
        <Link to="/">
          <img
            className={location.pathname === '/login' ? classes.appBarLogoAuthPage : classes.appBarLogo}
            src={`https://s3.ca-central-1.amazonaws.com/conch-resources/conch_logo_${logoColor}.png`}
          />
        </Link>
        <div className={classes.marginLeftAuto}>{this.props.children}</div>
      </Toolbar>
    );
  }
}

export default withRouter(withStyles(styles)(NavBarToolbar));
