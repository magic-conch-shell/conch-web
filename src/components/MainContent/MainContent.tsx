import {
  CircularProgress,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import classnames from 'classnames';
import * as React from 'react';
import { Route, Switch } from 'react-router';

import MainPage from '../Pages/MainPage';

export interface IMainContentProps {
  placeholder?: string;
}

export interface IMainContentState {
  loading: boolean;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    height: 'calc(100% - 90px)',
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
  WithStyles<any> & IMainContentProps,
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
    const { classes } = this.props;
    const { loading } = this.state;
    const homePage = () => {
      return <MainPage handleFinishLoading={this.handleFinishedLoading} />;
    };
    return (
      <div className={classes.root}>
        <React.Fragment>
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
              <Route exact={true} path="/" render={homePage} />
            </Switch>
          </div>
        </React.Fragment>
      </div>
    );
  }
}

export default withStyles(styles)(MainContent);
