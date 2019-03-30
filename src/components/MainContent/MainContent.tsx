import {
  CircularProgress,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import classnames from 'classnames';
import * as React from 'react';
import {
  Route,
  Switch,
  Redirect,
  RouteComponentProps,
  StaticContext,
  withRouter,
} from 'react-router';

import MainPage from '../Pages/MainPage';
import { IUser } from '../../interfaces/User';
import AuthPage from '../Pages/AuthPage';
import ResultPage from '../Pages/ResultPage';

export interface IMainContentProps {
  handleSignIn: (user: IUser) => void;
  user: IUser | null;
}

export interface IMainContentState {
  loading: boolean;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    height: 'calc(100% - 90px)',
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
    height: '100%',
    width: '100%',
  },
});

class MainContent extends React.Component<
  RouteComponentProps<any> & WithStyles<any> & IMainContentProps,
  IMainContentState
> {
  public state = {
    loading: true,
  };

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
    const { classes, location, user } = this.props;
    console.log(location);
    const { loading } = this.state;
    const homePage = () => {
      return <MainPage handleFinishLoading={this.handleFinishedLoading} />;
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
      console.log(questionId);
      return <ResultPage questionId={questionId} />;
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
            <Switch location={location}>
              <Route
                exact={true}
                path="/"
                render={() => {
                  return user ? homePage() : <Redirect to="/login" />;
                }}
              />
              <Route path="/login" render={authPage} />
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
