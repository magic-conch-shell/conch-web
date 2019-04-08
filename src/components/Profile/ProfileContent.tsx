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
import { IAnswer } from '../../interfaces/Answer';
import { IQuestion } from '../../interfaces/Question';
import { ISettings } from '../../interfaces/Settings';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import MentorPanel from './ContentPages/MentorPanel';
import Settings from './ContentPages/Settings';
import { TabTypes } from './ProfileContainer';
import classnames from 'classnames';

export interface IProfileContentProps extends WithStyles<typeof styles> {
  answers: IAnswer[];
  setAnswers: (answers: IAnswer[]) => void;
  questions: IQuestion[];
  setQuestions: (questions: IQuestion[]) => void;
  currentTab: TabTypes;
  mentorDialogOpen: boolean;
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
      editUser,
      handleFinishLoading,
      answers,
      setAnswers,
      questions,
      setQuestions,
      tags,
      user,
      ...rest
    } = this.props;

    switch (currentTab) {
      case TabTypes.Home:
        return (
          <Home
            handleFinishLoading={handleFinishLoading}
            tags={tags}
            user={user}
            questions={questions}
            setQuestions={setQuestions}
          />
        );
      case TabTypes.MentorPanel:
        return (
          <MentorPanel
            editUser={editUser}
            handleFinishLoading={handleFinishLoading}
            user={user}
            tags={tags}
            answers={answers}
            setAnswers={setAnswers}
          />
        );
      case TabTypes.Settings:
        return (
          <Settings
            user={user}
            editUser={editUser}
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
