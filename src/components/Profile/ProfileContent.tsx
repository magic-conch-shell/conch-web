import * as React from 'react';

import {
  CircularProgress,
  Paper,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import classnames from 'classnames';
import { IUser } from '../../interfaces/User';
import Home from './ContentPages/Home';
import Settings from './ContentPages/Settings';
import { ISettings } from '../../interfaces/Settings';

export interface IProfileContentProps extends WithStyles<typeof styles> {
  currentTab: number;
  editUser: (user: IUser) => void;
  setTimeZone: (timeZone: string) => void;
  toggleTheme: () => void;
  user: IUser;
  userSettings: ISettings;
}

export interface IProfileContentState {
  loading: boolean;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  full: {
    height: '100%',
    width: '100%',
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
  hidden: {
    display: 'none',
  },
  contentContainer: {
    color: theme.palette.text.primary,
    padding: theme.spacing.unit * 2,
  },
});
class ProfileContent extends React.Component<
  IProfileContentProps,
  IProfileContentState
> {
  public state = {
    loading: true,
  };

  public handleFinishLoading = () => {
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

  public getTabContent = () => {
    const { classes, currentTab, user, ...rest } = this.props;

    switch (currentTab) {
      case 0:
        return (
          <Home handleFinishLoading={this.handleFinishLoading} user={user} />
        );
      case 1:
        return (
          <Settings
            user={user}
            handleFinishLoading={this.handleFinishLoading}
            {...rest}
          />
        );
      default:
        return <div>NOT FOUND</div>;
    }
  };

  public render() {
    const { loading } = this.state;
    const { classes } = this.props;
    return (
      <Paper className={classes.full} elevation={4}>
        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress className={classes.loading} size={96} />
          </div>
        )}
        <div
          className={classnames(
            classes.contentContainer,
            loading && classes.hidden
          )}
        >
          {this.getTabContent()}
        </div>
      </Paper>
    );
  }
}

export default withStyles(styles)(ProfileContent);
