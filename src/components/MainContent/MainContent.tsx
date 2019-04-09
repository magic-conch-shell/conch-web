import * as React from 'react';

import {
  CircularProgress,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import {
  Redirect,
  Route,
  RouteComponentProps,
  StaticContext,
  Switch,
  withRouter,
} from 'react-router';

import AuthPage from '../Pages/AuthPage';
import { IAnswer } from '../../interfaces/Answer';
import { IQuestion } from '../../interfaces/Question';
import { ISettings } from '../../interfaces/Settings';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import MainPage from '../Pages/MainPage';
import MentorPage from '../Pages/MentorPage';
import ProfilePage from '../Pages/ProfilePage';
import ResultPage from '../Pages/ResultPage';
import { TabTypes } from '../Profile/ProfileContainer';
import axios from 'axios';
import classnames from 'classnames';

export interface IMainContentProps {
  addQuestion: (question: IQuestion) => void;
  editUser: (user: IUser) => void;
  handleSignIn: (user: IUser) => void;
  setTimeZone: (timeZone: string) => void;
  toggleTheme: () => void;
  user: IUser | null;
  userSettings: ISettings;
  questions: IQuestion[];
  answers: IAnswer[];
  setQuestions: (questions: IQuestion[]) => void;
  setAnswers: (answers: IAnswer[]) => void;
}

export interface IMainContentState {
  loading: boolean;
  tags: ITag[];
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    marginTop: '90px',
    width: '100%',
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
  switchContainer: {
    display: 'flex',
    width: '100%',
  },
  hidden: {
    display: 'none',
  },
});

class MainContent extends React.Component<
  RouteComponentProps<any> & WithStyles<any> & IMainContentProps,
  IMainContentState
  > {
  public state = {
    loading: true,
    tags: [] as ITag[],
  };

  public componentDidMount() {
    axios('/api/tags').then((result) => {
      const { data } = result;
      this.setState({ tags: data });
    });
  }

  public handleFinishedLoading = () => {
    console.log('Finished loading!');
    this.isNotLoading();
  };

  public handleStartLoading = () => {
    console.log('Loading data!');
    this.isLoading();
  };

  public isLoading = () => {
    this.setState({ loading: true });
  };

  public isNotLoading = () => {
    this.setState({ loading: false });
  };

  public render() {
    const {
      classes,
      editUser,
      setTimeZone,
      toggleTheme,
      user,
      userSettings,
      answers,
      setAnswers,
      questions,
      setQuestions,
      addQuestion
    } = this.props;
    const { loading, tags } = this.state;
    const homePage = () => {
      return (
        <MainPage
          addQuestion={addQuestion}
          handleFinishLoading={this.handleFinishedLoading}
          tags={tags}
        />
      );
    };
    const authPage = () => {
      return (
        <AuthPage
          handleFinishLoading={this.handleFinishedLoading}
          handleSignIn={this.props.handleSignIn}
        />
      );
    };
    const resultPage = (
      props: RouteComponentProps<any, StaticContext, any>
    ) => {
      const { questionId } = props.match.params;
      return user ? (
        <ResultPage key={questionId} tags={tags} setQuestions={setQuestions} questions={questions} questionId={questionId} user={user} handleFinishLoading={this.handleFinishedLoading} />
      ) : (
          <Redirect to='/login' />
        );
    };

    const mentorPage = () => {
      return <MentorPage tags={tags} />;
    };

    const profilePage = (
      props: RouteComponentProps<any, StaticContext, any>
    ) => {
      const { location } = props;
      const { state } = location;
      return user ? (
        <ProfilePage
          questions={questions}
          answers={answers}
          setQuestions={setQuestions}
          setAnswers={setAnswers}
          currentTab={state ? state.currentTab && state.currentTab : TabTypes.Home}
          editUser={editUser}
          mentorDialogOpen={state ? state.mentorDialogOpen && state.mentorDialogOpen : false}
          handleFinishLoading={this.handleFinishedLoading}
          setTimeZone={setTimeZone}
          tags={tags}
          toggleTheme={toggleTheme}
          user={user}
          userSettings={userSettings}
        />
      ) : (
          <Redirect to="/login" />
        );
    };

    return (
      <div className={classes.root}>
        <>
          {loading && (
            <div className={classes.loadingContainer}>
              <CircularProgress className={classes.loading} size={96} />
            </div>
          )}
          <div
            className={classnames(
              classes.switchContainer,
              loading && classes.hidden
            )}
          >
            <Switch>
              <Route
                exact={true}
                path="/"
                render={() => {
                  return user ? homePage() : <Redirect to="/login" />;
                }}
              />
              <Route path="/login" render={authPage} />
              <Route path="/profile" render={(props) => profilePage(props)} />
              <Route path="/queue" render={mentorPage} />
              <Route
                path="/results/:questionId"
                render={(props) => resultPage(props)}
              />
              <Route key='empty' path="/empty" render={(props) => {
                return <Redirect to={`${props.location.state.previous}`} />
              }} />
            </Switch>
          </div>
        </>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(MainContent));
