import * as React from 'react';

import {
  Avatar,
  Button,
  Menu,
  MenuItem,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles
} from '@material-ui/core';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import { IUser } from '../../interfaces/User';
import { Link } from 'react-router-dom';
import { ThemeTypes } from '../../themes/mainTheme';
import classnames from 'classnames';
import { darken } from '@material-ui/core/styles/colorManipulator';

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
  avatar: {
    margin: 'auto',
    borderRadius: '5px'
  },
  accountMenuButtonContainer: {
    display: 'flex',
    '& .root:hover': {
      backgroundColor: 'rgba(0,0,0,0)'
    }
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
  userAccount: {
    display: 'flex',
    cursor: 'pointer',
    padding: theme.spacing.unit / 2,
    '&:hover': {
      backgroundColor: darken(theme.palette.background.default, 0.1)
    }
  }
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
              <>
                <div className={classes.userAccount} onClick={handleClick}>
                  <Button className={classes.accountMenuButton}>
                    {user.nickname}
                  </Button>
                  <Avatar className={classes.avatar} src={user.profileUrl} />
                </div>
                <Menu
                  id="accountOptions-menu"
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                >
                  <Link to="/profile">
                    <MenuItem>Profile</MenuItem>
                  </Link>
                  <MenuItem onClick={handleSignOut}>Sign Out</MenuItem>
                </Menu>
              </>
            )}
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(NavBarAccount));
