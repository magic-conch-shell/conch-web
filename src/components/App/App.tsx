import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import {
  WithStyles,
  StyleRulesCallback,
  Theme,
  withStyles,
} from '@material-ui/core';
import NavBar from '../NavBar/NavBar';
import MainContent from '../MainContent/MainContent';
import { IUser } from '../../interfaces/User';
import NavBarAccount from '../NavBar/NavBarAccount';
// import axios from 'axios';

export interface IAppState {
  loading: boolean;
  navBarAnchorEl: HTMLElement | undefined;
  user: IUser | null;
}

export interface IAppProps {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
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
    const { navBarAnchorEl, user } = this.state;
    const { classes, location } = this.props;
    const isTransparent = location.pathname === '/';
    return (
      <div className={classes.root}>
        <NavBar isTransparent={isTransparent}>
          <NavBarAccount
            anchorEl={navBarAnchorEl}
            handleClick={this.navBarHandleClick}
            handleClose={this.navBarHandleClose}
            handleSignOut={this.handleSignOut}
            isTransparent={isTransparent}
            user={user}
          />
        </NavBar>
        <MainContent />
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
