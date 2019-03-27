import {
  Button,
  Menu,
  MenuItem,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import classnames from 'classnames';
import * as React from 'react';

import { IUser } from '../../interfaces/User';
import { ThemeTypes } from '../../themes/mainTheme';
import { withRouter, RouteComponentProps, Redirect } from 'react-router-dom';

export interface INavBarAccountProps extends WithStyles<typeof styles> {
  anchorEl: HTMLElement | undefined;
  handleClick: (event: any) => void;
  handleClose: () => void;
  handleSignOut: () => void;
  isTransparent: boolean;
  theme: ThemeTypes;
  user: IUser | null;
}

export interface INavBarAccountState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  accountMenuButtonContainer: {
    display: 'flex',
  },
  accountMenuButton: {
    color: theme.palette.primary.main,
    fontSize: '1.25rem',
    fontWeight: 'bold',
  },
  whiteText: {
    '& *': {
      color: 'white',
    },
  },
  verticalDivider: {
    marginLeft: '15px',
    marginRight: '15px',
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: '1.5rem',
    fontWeight: 'lighter',
  },
});

class NavBarAccount extends React.Component<
  RouteComponentProps<any> & INavBarAccountProps,
  INavBarAccountState
> {
  public render() {
    const {
      anchorEl,
      classes,
      handleClick,
      handleClose,
      handleSignOut,
      location,
      theme,
      user,
    } = this.props;
    return (
      <div
        className={classnames(
          classes.navBarAccountContainers,
          theme === ThemeTypes.DARK && classes.whiteText
        )}
      >
        {location.pathname === '/login' ||
        location.pathname === '/register' ? null : !user ? (
          <div className={classes.accountMenuButtonContainer}>
            <Button
              variant="text"
              className={classes.accountMenuButton}
              onClick={() => <Redirect to="/login" />}
            >
              Log In
            </Button>
            {/* <div className={classes.verticalDivider}>|</div> */}
            {/* <Button variant="text" className={classes.accountMenuButton}>
              Sign Up
            </Button> */}
          </div>
        ) : (
          <div className={classes.userAccount}>
            <Button className={classes.accountMenuButton} onClick={handleClick}>
              {user.nickname}
            </Button>
            <Menu
              id="accountOptions-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
            </Menu>
          </div>
        )}
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(NavBarAccount));
