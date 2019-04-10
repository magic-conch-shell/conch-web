import * as React from 'react';

import { Avatar, Menu, MenuItem, StyleRulesCallback, Theme, WithStyles, withStyles } from '@material-ui/core';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import AccountMenuSummary from './AccountMenuSummary';
import { IUser } from '../../interfaces/User';
import { ThemeTypes } from '../../themes/mainTheme';
import classnames from 'classnames';
import { darken } from '@material-ui/core/styles/colorManipulator';

export interface INavBarAccountProps extends WithStyles<typeof styles> {
  anchorEl: HTMLElement | undefined;
  handleClick: (event: any) => void;
  handleClose: (callback?: () => void) => void;
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
  link: {
    textDecoration: 'none',
  },
  avatar: {
    margin: 'auto',
    borderRadius: '5px',
    [theme.breakpoints.only('xs')]: {
      height: '32px',
      width: '32px'
    }
  },
  accountMenuButtonContainer: {
    display: 'flex',
    '& .root:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
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
  menuList: {
    marginTop: '60px',
  },
  spacing: {
    marginLeft: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 2,
    }
  },
  userAccount: {
    display: 'flex',
    cursor: 'pointer',
    padding: theme.spacing.unit / 2,
    '&:hover': {
      backgroundColor: darken(theme.palette.background.default, 0.1),
    },
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
          location.pathname === '/register' ? null : user &&
          <>
            <div className={classes.spacing}>
              <div className={classes.userAccount} onClick={handleClick}>
                <Avatar className={classes.avatar} src={user.avatar_url} />
              </div>
            </div>
            <Menu
              id="accountOptions-menu"
              className={classes.accountMenu}
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => handleClose()}
              classes={{
                paper: classes.menuList,
              }}
            >
              <AccountMenuSummary user={user} />
              <Link
                className={classes.link}
                to="/profile"
                onClick={() => handleClose()}
              >
                <MenuItem>Profile</MenuItem>
              </Link>
              <MenuItem onClick={() => handleClose(handleSignOut)}>
                Sign Out
              </MenuItem>
            </Menu>
          </>
        }
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(NavBarAccount));
