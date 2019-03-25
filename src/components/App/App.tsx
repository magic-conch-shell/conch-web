import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { IUser } from '../../interfaces/User';
import { ThemeTypes } from '../AppContainer/AppContainer';
import MainContent from '../MainContent/MainContent';
import NavBar from '../NavBar/NavBar';

// import axios from 'axios';

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
  },
});

class App extends Component<
  RouteComponentProps<any> & WithStyles<any> & IAppProps,
  IAppState
> {
  public state = {
    loading: false,
    navBarAnchorEl: undefined,
    user: {
      id: 0,
      email: 'scoot.donnelly@gmail.com',
      phone: '647-381-4426',
      nickname: 'sdonnelly',
    },
  };

  public componentDidMount() {
    // axios.post(`https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode?key=${process.env.REACT_APP_FB_RESET_PW_KEY}`, payload)
    //   .then(resp => {
    //     this.handleSendPasswordResetSuccess(resp.data);
    //   })
    //   .catch(err => {
    //     this.handleSendPasswordResetError(err);
    //   });
  }
  public navBarHandleClick = (event: any) => {
    this.setState({ navBarAnchorEl: event.currentTarget });
  };

  public navBarHandleClose = () => {
    this.setState({ navBarAnchorEl: undefined });
  };

  public handleSignOut = () => {
    this.setState({ user: null });
  };

  public render() {
    const { classes, location, toggleTheme, theme } = this.props;
    const isTransparent = location.pathname === '/';
    return (
      <div className={classes.root}>
        <NavBar
          isTransparent={isTransparent}
          toggleTheme={toggleTheme}
          theme={theme}
        >
          {/* <NavBarAccount
              anchorEl={navBarAnchorEl}
              handleClick={this.navBarHandleClick}
              handleClose={this.navBarHandleClose}
              handleSignOut={this.handleSignOut}
              isTransparent={isTransparent}
              user={user}
            /> */}
        </NavBar>
        <MainContent />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
