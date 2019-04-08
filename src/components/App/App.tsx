import {
  Button,
  CircularProgress,
  IconButton,
  Snackbar,
  SnackbarContent,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import Close from '@material-ui/icons/Close';
import FooterContainer from '../Footer/FooterContainer';
import { ISettings } from '../../interfaces/Settings';
import { IUser } from '../../interfaces/User';
import { Link } from 'react-router-dom';
import MainContent from '../MainContent/MainContent';
import NavBar from '../NavBar/NavBar';
import NavBarAccount from '../NavBar/NavBarAccount';
import NavBarMentorSignUp from '../NavBar/NavBarMentorSignUp';
import NavBarMentorStatus from '../NavBar/NavBarMentorStatus';
import PubNubReact from 'pubnub-react';
import axios from 'axios';

export interface IAppState {
  loading: boolean;
  navBarAnchorEl: HTMLElement | undefined;
  snackbarQuestionId: number | undefined;
  snackbarOpen: boolean;
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
    minHeight: '100%',
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
  public pubNub: PubNubReact;
  constructor(props: RouteComponentProps<any> & WithStyles<any> & IAppProps) {
    super(props);
    this.state = {
      loading: true,
      snackbarQuestionId: undefined,
      snackbarOpen: false,
      navBarAnchorEl: undefined,
      user: null,
    }
    this.pubNub = new PubNubReact({
      publishKey: process.env.REACT_APP_PN_PUBLISH_KEY,
      subscribeKey: process.env.REACT_APP_PN_SUBSCRIBE_KEY
    });

    this.pubNub.init(this);
  }

  public componentDidMount() {
    axios({
      method: 'post',
      url: '/login',
      params: {},
    })
      .then((result) => {
        const { data } = result;
        const { id, avatar, nickname, email, phone, is_mentor, tags } = data;
        this.handleSignIn({
          id,
          nickname,
          email,
          phone,
          avatar,
          is_mentor,
          tags
        });
      })
      .catch((err) => console.log(err))
      .finally(() => this.finishLoading());
  };

  public componentWillUnmount() {
    const { user } = this.state;

    if (user) {
      const channels: string[] = [];
      const baseChannel = `user-${(user as IUser).id}`;
      if (user.is_mentor) {
        const mentorChannel = `${baseChannel}-mentor`;
        channels.push(mentorChannel);
      }
      const clientChannel = `${baseChannel}-client`;
      channels.push(clientChannel);
      this.pubNub.unsubscribe({
        channels
      });
    }
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
    if (!user.avatar || user.avatar === '') {
      user.avatar =
        'https://www.wittenberg.edu/sites/default/files/2017-11/nouser_0.jpg';
    }
    this.setState({ user }, () => {
      this.pubNubSub();
    });
  };

  public pubNubSub = () => {
    const { user } = this.state;

    if (user) {
      const channels: string[] = [];
      const baseChannel = `user-${(user as IUser).id}`;
      const mentorChannel = `${baseChannel}-mentor`;
      if (user.is_mentor) {
        channels.push(mentorChannel);
      }
      const clientChannel = `${baseChannel}-client`;
      channels.push(clientChannel);
      this.pubNub.subscribe({
        channels
      });

      // @ts-ignore
      this.pubNub.getMessage(clientChannel, (msg: any) => {
        this.handlePubNubMsgAsClient(msg);
      });

      if (user.is_mentor) {
        // @ts-ignore
        this.pubNub.getMessage(mentorChannel, (msg: any) => {
          this.handlePubNubMsgAsMentor(msg);
        });
      }
    }
  };

  public handlePubNubMsgAsClient = (msg: any) => {
    console.log('[handlePubNubMsgAsClient]');
    const { message } = msg;
    const { question_id } = message;
    console.log(msg);
    this.setState({ snackbarQuestionId: question_id, snackbarOpen: true });
  };

  public handlePubNubMsgAsMentor = (msg: any) => {
    console.log('[handlePubNubMsgAsMentor]');
    const { message } = msg;
    const { question_id } = message;
    console.log(msg);
    this.setState({ snackbarQuestionId: question_id, snackbarOpen: true });
  }

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

  public handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  public render() {
    const { navBarAnchorEl, loading, snackbarOpen, snackbarQuestionId, user } = this.state;
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
        {loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress className={classes.loading} size={96} />
          </div>
        ) : (
            <>
              <NavBar
                isTransparent={isTransparent}
                toggleTheme={toggleTheme}
                theme={themeType}
              >
                {user && (user as IUser).is_mentor ? (
                  <NavBarMentorStatus />
                ) : (
                    <NavBarMentorSignUp />
                  )}
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
              <MainContent
                user={user}
                userSettings={userSettings}
                handleSignIn={this.handleSignIn}
                setTimeZone={setTimeZone}
                toggleTheme={toggleTheme}
                editUser={this.editUser}
              />
              <Snackbar
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'center'
                }}
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={this.handleSnackbarClose}
              >
                <SnackbarContent
                  className={classes.snackbarContent}
                  message={
                    <span id="client-snackbar" className={classes.snackbarMessage}>
                      🐚 Message from PubNub! Fill with context!
                    </span>
                  }
                  action={[
                    <Link key={snackbarQuestionId} to={`/results/${snackbarQuestionId}`} style={{ textDecoration: 'none' }}>
                      <Button color='primary' variant='flat' size='small'>Go To Question</Button>
                    </Link>,
                    <IconButton
                      key='close'
                      color='inherit'
                      onClick={this.handleSnackbarClose}
                    >
                      <Close />
                    </IconButton>
                  ]}
                />
              </Snackbar>
              <FooterContainer theme={themeType} toggleTheme={toggleTheme} />
            </>
          )}
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(App));
