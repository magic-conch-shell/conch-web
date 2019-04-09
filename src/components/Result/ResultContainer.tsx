import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { IQuestion, ResultStatusTypes } from '../../interfaces/Question';
import { getAnswersByQuestionId, getQuestionByQuestionId } from '../../api';

import { IAnswer } from '../../interfaces/Answer';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import Result from './Result';
import axios from 'axios';
import classnames from 'classnames';
import posed from 'react-pose';

export interface IResultContainerProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
  setQuestions: (questions: IQuestion[]) => void;
  questions: IQuestion[];
  user: IUser;
  tags: ITag[];
  questionId: string;
}

export interface IResultContainerState {
  answers: IAnswer[];
  visible: boolean;
  question: IQuestion;
}

const TRANSITION_DURATION = 350;

const OpacityContainer = posed.div({
  hidden: { opacity: 0, transition: { duration: TRANSITION_DURATION } },
  visible: { opacity: 1, transition: { duration: TRANSITION_DURATION } },
});

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    display: 'flex',
  },
  vCenter: {
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  container: {
    width: '100%'
  }
});

class ResultContainer extends React.Component<
  IResultContainerProps,
  IResultContainerState
  > {
  public signal = axios.CancelToken.source();

  public state = {
    answers: [] as IAnswer[],
    visible: false,
    question: {} as IQuestion
  };

  public componentDidMount() {
    this.getQuestionData();
  }

  public getQuestionData = () => {
    const { handleFinishLoading, questions, setQuestions, questionId } = this.props;
    if (questionId) {
      const qid = parseInt(questionId, 10);
      getQuestionByQuestionId(qid, (question) => {
        const newQuestions = [...questions];
        const qIndex = newQuestions.findIndex(q => q.id === qid);
        if (qIndex !== -1) {
          newQuestions[qIndex] = question;
          setQuestions(newQuestions);
        }
        this.setState({ question }, () => {
          const qstatus = question.question_status.status;
          if (qstatus === ResultStatusTypes.ANSWERED || qstatus === ResultStatusTypes.RESOLVED) {
            getAnswersByQuestionId(qid, (answers) => {
              this.setState({ answers, visible: true });
              handleFinishLoading();
            });
          } else {
            handleFinishLoading();
            this.setState({ visible: true });
          }
        });
      }, this.signal);
    }
  };

  public updateQuestionAnswer = (answer: IAnswer) => {
    const newAnswers = [...this.state.answers];
    const aIndex = newAnswers.findIndex(a => a.id === answer.id);
    if (aIndex !== -1) {
      newAnswers[aIndex] = answer;
    }
    this.setState({ answers: newAnswers });
  }

  public componentWillUnmount() {
    this.signal.cancel('Result status request cancelled');
  }

  public render() {
    const { answers, visible, question } = this.state;
    const { classes, questionId, user, tags } = this.props;
    return (
      <Grid item={true} xs={12} sm={6} md={4} lg={4} className={classes.root}>
        {questionId ? (
          <OpacityContainer
            className={classnames(classes.container, classes.vCenter)}
            pose={visible ? 'visible' : 'hidden'}
          >
            {visible && question && <Result answers={answers} result={question} tags={tags} user={user} updateQuestionAnswer={this.updateQuestionAnswer} />}
          </OpacityContainer>
        ) : (
            <div>no questionId provided</div>
          )}
      </Grid>
    );
  }
}

export default withStyles(styles)(ResultContainer);
