import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import ProfileContainer, { TabTypes } from '../Profile/ProfileContainer';

import { IAnswer } from '../../interfaces/Answer';
import { IQuestion } from '../../interfaces/Question';
import { ISettings } from '../../interfaces/Settings';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';

export interface IProfilePageProps extends WithStyles<typeof styles> {
  answers: IAnswer[];
  setAnswers: (answers: IAnswer[]) => void;
  questions: IQuestion[];
  setQuestions: (questions: IQuestion[]) => void;
  editUser: (user: IUser) => void;
  currentTab: TabTypes;
  mentorDialogOpen: boolean;
  handleFinishLoading: () => void;
  setTimeZone: (timeZone: string) => void;
  tags: ITag[];
  toggleTheme: () => void;
  user: IUser;
  userSettings: ISettings;
}

export interface IProfilePageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '-90px',
    display: 'flex',
  },
});

class ProfilePage extends React.Component<
  IProfilePageProps,
  IProfilePageState
  > {
  public componentDidMount() {
    this.props.handleFinishLoading();
  }
  public render() {
    const { classes, handleFinishLoading, ...rest } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <ProfileContainer {...rest} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ProfilePage);
