import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { IQuestion, ResultStatusTypes } from '../../interfaces/Question';

import { IAnswer } from '../../interfaces/Answer';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import Result from './Result';
import axios from 'axios';
import classnames from 'classnames';
import posed from 'react-pose';

export interface IResultContainerProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
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
    question: {} as IQuestion,
  };

  public componentDidMount() {
    this.getQuestionData();
  }

  public getQuestionData = () => {
    const { handleFinishLoading, questionId } = this.props;
    if (questionId) {
      axios({
        method: 'get',
        url: `/api/questions/${questionId}`,
        cancelToken: this.signal.token,
      })
        .then((result) => {
          const { data } = result;
          this.setState({ question: data }, () => {
            const qstatus = this.state.question.question_status.status;
            if (qstatus === ResultStatusTypes.ANSWERED || qstatus === ResultStatusTypes.RESOLVED) {
              axios({
                method: 'get',
                url: `/api/questions/${questionId}/answers`
              })
                .then((res) => {
                  const { data: answerData } = res;
                  this.setState({ answers: answerData });
                })
                .catch((e) => console.log(e));
            }
            handleFinishLoading();
          });
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => this.setState({ visible: true }));
    }
  }

  public componentWillUnmount() {
    this.signal.cancel('Result status request cancelled');
  }

  public render() {
    const { answers, question, visible } = this.state;
    const { classes, user, tags } = this.props;
    return (
      <Grid item={true} xs={12} sm={6} md={4} lg={4} className={classes.root}>
        <OpacityContainer
          className={classnames(classes.container, classes.vCenter)}
          pose={visible ? 'visible' : 'hidden'}
        >
          {visible && <Result answers={answers} result={question} tags={tags} user={user} />}
        </OpacityContainer>
      </Grid>
    );
  }
}

export default withStyles(styles)(ResultContainer);
