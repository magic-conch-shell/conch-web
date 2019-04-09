import { AnswerStatusTypes, IAnswer } from '../../interfaces/Answer';
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
import { IQuestion, ResultStatusTypes } from '../../interfaces/Question';
import React, { Component } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';
import { getAnswersByUserId, getQuestionsByUserId } from '../../api';

import Close from '@material-ui/icons/Close';
import FooterContainer from '../Footer/FooterContainer';
import { IPNMessage } from '../../interfaces/Message';
import { ISettings } from '../../interfaces/Settings';
import { IUser } from '../../interfaces/User';
import { Link } from 'react-router-dom';
import MainContent from '../MainContent/MainContent';
import NavBar from '../NavBar/NavBar';
import NavBarAccount from '../NavBar/NavBarAccount';
import NavBarListQuestions from '../NavBar/NavBarListQuestions';
import NavBarMentorSignUp from '../NavBar/NavBarMentorSignUp';
import NavBarMentorStatus from '../NavBar/NavBarMentorStatus';
import PubNubReact from 'pubnub-react';
import axios from 'axios';

export interface IAppState {
  answers: IAnswer[];
  loading: boolean;
  navBarAnchorEl: HTMLElement | undefined;
  pn_messages: { [index: string]: IPNMessage[] };
  questions: IQuestion[];
  snackbarQuestionId: number | undefined;
  snackbarOpen: boolean;
  snackbarText: string;
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
      answers: [] as IAnswer[],
      pn_messages: {},
      loading: true,
      snackbarQuestionId: undefined,
      snackbarOpen: false,
      snackbarText: 'placeholder text',
      questions: [] as IQuestion[],
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
        const { id, avatar_url, nickname, email, phone, is_mentor, tags } = data;
        this.handleSignIn({
          id,
          nickname,
          email,
          phone,
          avatar_url,
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
  };

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
    const { location, history } = this.props;
    if (!user.avatar_url || user.avatar_url === '') {
      user.avatar_url =
        'https://www.wittenberg.edu/sites/default/files/2017-11/nouser_0.jpg';
    }
    this.setState({ user }, () => {
      this.pubNubSub();
      this.getUserData(() => {
        if (location.pathname === '/login' || location.pathname === '/register') {
          history.push('/');
        }
      });
    });
  };

  public getUserData = (callback: () => void) => {
    const { user } = this.state;
    if (user) {
      getQuestionsByUserId(user.id, (questions) => {
        this.setQuestions(questions);
      });
      if (user.is_mentor) {
        getAnswersByUserId(user.id, (answers) => {
          this.setAnswers(answers);
        });
      }
    }
    this.setState({ loading: false });
    console.log('[getUserData] callback');
    callback();
  };

  public setQuestions = (questions: IQuestion[]) => {
    this.setState({ questions });
  };

  public setAnswers = (answers: IAnswer[]) => {
    this.setState({ answers });
  }

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
    const { status, question_id } = message;
    if (Object.keys(AnswerStatusTypes).includes(status)) {
      const text = 'If you are getting this message, please contact support. Client channels should not receive updates about answer statuses.';
      this.setState({
        snackbarQuestionId: question_id,
        snackbarOpen: true,
        snackbarText: text
      });
    } else {
      const questionStatusText: { [key in ResultStatusTypes]: string } = {
        'NOT_SUBMITTED': 'This should never show up!',
        'SUBMITTED': 'Your question has been submitted. Should never show up!',
        'ACCEPTED': 'Your question has been accepted by a mentor. Awaiting answer...',
        'ANSWERED': 'Your question has been answered by a mentor. Please accept or reject the answer.',
        'RESOLVED': 'Your question has been resolved successfully.'
      };

      this.setState({
        snackbarQuestionId: question_id,
        snackbarOpen: true,
        snackbarText: questionStatusText[status],
      });
    }
  };

  public handlePubNubMsgAsMentor = (msg: any) => {
    console.log('[handlePubNubMsgAsMentor]');
    const { message } = msg;
    const { status, question_id } = message;

    if (Object.keys(AnswerStatusTypes).includes(status)) {
      const text = status === AnswerStatusTypes.PASSED ?
        'One of your answers has been declined.' : 'One of your answers has been accepted.';
      console.log(status, AnswerStatusTypes.PASSED);
      this.setState({
        snackbarQuestionId: question_id,
        snackbarOpen: true,
        snackbarText: text
      })
    } else {
      const questionStatusText: { [key in ResultStatusTypes]: string } = {
        'NOT_SUBMITTED': 'This should never show up!',
        'SUBMITTED': 'Your question has been submitted. Should never show up!',
        'ACCEPTED': 'You have been assigned to a question. Good luck!',
        'ANSWERED': 'You have submitted your answer to a question. Probably don\'t need to show this.',
        'RESOLVED': 'One of your questions has been accepted. This is from the question side, can probably remove'
      };
      this.setState({
        snackbarQuestionId: question_id,
        snackbarOpen: true,
        snackbarText: questionStatusText[status],
      });
    }
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

  public handleSnackbarClose = () => {
    this.setState({ snackbarOpen: false });
  };

  public render() {
    const { answers, navBarAnchorEl, loading, snackbarOpen, snackbarQuestionId, snackbarText, questions, user } = this.state;
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
                {user ? (
                  (user as IUser).is_mentor ? (
                    <NavBarMentorStatus />
                  ) : (
                      <>
                        <NavBarListQuestions unread={questions.filter(q => q.is_dirty).length} />
                        <NavBarMentorSignUp />
                      </>
                    )
                ) : null}
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
                questions={questions}
                answers={answers}
                setQuestions={this.setQuestions}
                setAnswers={this.setAnswers}
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
                      🐚 {snackbarText}
                    </span>
                  }
                  action={[
                    <Link key={snackbarQuestionId} to={`/results/${snackbarQuestionId}`} style={{ textDecoration: 'none' }}>
                      <Button color='primary' variant='text' size='small'>Go To Question</Button>
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
