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
import { ISettings } from '../../interfaces/Settings';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import MainPage from '../Pages/MainPage';
import ProfilePage from '../Pages/ProfilePage';
import ResultPage from '../Pages/ResultPage';
import axios from 'axios';
import classnames from 'classnames';
import MentorPage from '../Pages/MentorPage';

export interface IMainContentProps {
  editUser: (user: IUser) => void;
  handleSignIn: (user: IUser) => void;
  setTimeZone: (timeZone: string) => void;
  toggleTheme: () => void;
  user: IUser | null;
  userSettings: ISettings;
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
  hidden: {
    display: 'none',
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
    } = this.props;
    const { loading, tags } = this.state;
    const homePage = () => {
      return (
        <MainPage
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
      return <ResultPage tags={tags} questionId={questionId} />;
    };

    const mentorPage = () => {
      return <MentorPage tags={tags} />;
    };

    const profilePage = () => {
      return user ? (
        <ProfilePage
          editUser={editUser}
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
              <Route path="/profile" render={profilePage} />
              <Route path="/queue" render={mentorPage} />
              <Route
                path="/results/:questionId"
                render={(props) => resultPage(props)}
              />
            </Switch>
          </div>
        </>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(MainContent));
