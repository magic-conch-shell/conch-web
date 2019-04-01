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
import { ThemeTypes } from '../AppContainer/AppContainer';
import axios from 'axios';
import faker from 'faker';

export interface IAppState {
  loading: boolean;
  navBarAnchorEl: HTMLElement | undefined;
  user: IUser | null;
}

export interface IAppProps {
  toggleTheme: () => void;
  theme: ThemeTypes;
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
        const { id, nickname, email, phone } = data;
        this.handleSignIn({
          id,
          nickname,
          email,
          phone,
          profileUrl: faker.image.avatar(),
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

  public navBarHandleClose = () => {
    this.setState({ navBarAnchorEl: undefined });
  };

  public handleSignIn = (user: IUser) => {
    this.setState({ user }, () => {
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

  public render() {
    const { navBarAnchorEl, loading, user } = this.state;
    const { classes, location, toggleTheme, theme } = this.props;
    const isTransparent = location.pathname === '/';
    return (
      <div className={classes.root}>
        <NavBar
          isTransparent={isTransparent}
          toggleTheme={toggleTheme}
          theme={theme}
        >
          <NavBarAccount
            anchorEl={navBarAnchorEl}
            handleClick={this.navBarHandleClick}
            handleClose={this.navBarHandleClose}
            handleSignOut={this.handleSignOut}
            isTransparent={isTransparent}
            theme={theme}
            user={user}
          />
        </NavBar>
        {loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress className={classes.loading} size={96} />
          </div>
        ) : (
            <MainContent user={user} handleSignIn={this.handleSignIn} />
          )}
        <FooterContainer theme={theme} toggleTheme={toggleTheme} />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
