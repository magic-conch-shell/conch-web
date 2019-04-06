import * as React from 'react';

import {
  CircularProgress,
  Paper,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import Home from './ContentPages/Home';
import { ISettings } from '../../interfaces/Settings';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import Settings from './ContentPages/Settings';
import classnames from 'classnames';

export interface IProfileContentProps extends WithStyles<typeof styles> {
  currentTab: number;
  editUser: (user: IUser) => void;
  handleFinishLoading: () => void;
  loading: boolean;
  setTimeZone: (timeZone: string) => void;
  tags: ITag[];
  toggleTheme: () => void;
  user: IUser;
  userSettings: ISettings;
}

export interface IProfileContentState {
  placeholder?: string;
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
  public getTabContent = () => {
    const {
      classes,
      currentTab,
      handleFinishLoading,
      tags,
      user,
      ...rest
    } = this.props;

    switch (currentTab) {
      case 0:
        return (
          <Home
            handleFinishLoading={handleFinishLoading}
            tags={tags}
            user={user}
          />
        );
      case 1:
        return (
          <Settings
            user={user}
            tags={tags}
            handleFinishLoading={handleFinishLoading}
            {...rest}
          />
        );
      default:
        return <div>NOT FOUND</div>;
    }
  };

  public render() {
    const { classes, loading } = this.props;
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
