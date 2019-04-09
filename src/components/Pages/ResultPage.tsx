import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { IQuestion } from '../../interfaces/Question';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import ResultContainer from '../Result/ResultContainer';

export interface IResultPageProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
  setQuestions: (questions: IQuestion[]) => void;
  questions: IQuestion[];
  user: IUser;
  questionId: string;
  tags: ITag[];
}

export interface IResultPageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    marginTop: '-45px',
  },
});

class ResultPage extends React.Component<IResultPageProps, IResultPageState> {
  public render() {
    const { classes, handleFinishLoading, questionId, user, questions, tags, setQuestions } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <ResultContainer tags={tags} questions={questions} setQuestions={setQuestions} handleFinishLoading={handleFinishLoading} questionId={questionId} user={user} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ResultPage);
