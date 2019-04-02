import {
  CircularProgress,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import FooterContainer from '../Footer/FooterContainer';
import { IUser } from '../../interfaces/User';
import MainContent from '../MainContent/MainContent';
import NavBar from '../NavBar/NavBar';
import NavBarAccount from '../NavBar/NavBarAccount';
import axios from 'axios';
import { ISettings } from '../../interfaces/Settings';

export interface IAppState {
  loading: boolean;
  navBarAnchorEl: HTMLElement | undefined;
  user: IUser | null;
}

export interface IAppProps {
  toggleTheme: () => void;
  setTimeZone: (timeZone: string) => void;
  userSettings: ISettings;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    height: '100%',
    display: 'flex',
  },
  loading: {
    margin: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    width: '25%',
    height: '25%',
    margin: 'auto',
  },
});

class App extends Component<
  RouteComponentProps<any> & WithStyles<any> & IAppProps,
  IAppState
> {
  public state = {
    loading: true,
    navBarAnchorEl: undefined,
    user: null,
  };

  public componentDidMount() {
    axios({
      method: 'post',
      url: '/login',
      params: {},
    })
      .then((result) => {
        const { data } = result;
        const { id, avatar, nickname, email, phone } = data;
        this.handleSignIn({
          id,
          nickname,
          email,
          phone,
          avatar,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => this.finishLoading());
  }

  public finishLoading = () => {
    this.setState({ loading: false });
  };

  public navBarHandleClick = (event: any) => {
    this.setState({ navBarAnchorEl: event.currentTarget });
  };

  public navBarHandleClose = (callback?: () => void) => {
    this.setState({ navBarAnchorEl: undefined }, callback);
  };

  public handleSignIn = (user: IUser) => {
    console.log('handle signIn');
    if (user.avatar === '') {
      user.avatar =
        'https://www.wittenberg.edu/sites/default/files/2017-11/nouser_0.jpg';
    }
    this.setState({ user }, () => {
      console.log('push homepage');
      this.props.history.push('/');
    });
  };

  public handleSignOut = () => {
    axios({
      method: 'post',
      url: '/logout',
    })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({ user: null }, () => this.props.history.push('/'));
      });
  };

  public editUser = (newUser: IUser) => {
    this.setState({ user: newUser });
  };

  public render() {
    const { navBarAnchorEl, loading, user } = this.state;
    const {
      classes,
      location,
      setTimeZone,
      toggleTheme,
      userSettings,
    } = this.props;
    const { themeType } = userSettings;
    const isTransparent = location.pathname === '/';
    return (
      <div className={classes.root}>
        <NavBar
          isTransparent={isTransparent}
          toggleTheme={toggleTheme}
          theme={themeType}
        >
          <NavBarAccount
            anchorEl={navBarAnchorEl}
            handleClick={this.navBarHandleClick}
            handleClose={this.navBarHandleClose}
            handleSignOut={this.handleSignOut}
            isTransparent={isTransparent}
            theme={themeType}
            user={user}
          />
        </NavBar>
        {loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress className={classes.loading} size={96} />
          </div>
        ) : (
          <MainContent
            user={user}
            userSettings={userSettings}
            handleSignIn={this.handleSignIn}
            setTimeZone={setTimeZone}
            toggleTheme={toggleTheme}
            editUser={this.editUser}
          />
        )}
        <FooterContainer theme={themeType} toggleTheme={toggleTheme} />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
