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
import Result from './Result';
import axios from 'axios';
import classnames from 'classnames';
import posed from 'react-pose';

export interface IResultContainerProps extends WithStyles<typeof styles> {
  tags: ITag[];
  questionId: string;
}

export interface IResultContainerState {
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
    visible: false,
    question: {} as IQuestion,
  };

  public componentDidMount() {
    const { questionId } = this.props;
    const getQuestionData = (qid: string) => {
      const INTERVAL = 10;
      if (qid) {
        axios({
          method: 'get',
          url: `/api/questions/${qid}`,
          cancelToken: this.signal.token,
        })
          .then((result) => {
            const { data } = result;
            this.setState({ question: data, visible: true }, () => {
              if (!data.solved) {
                console.log(
                  `Question is not solved yet... checking again in ${INTERVAL} seconds`
                );
                setTimeout(() => getQuestionData(qid), INTERVAL * 1000);
              }
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    };
    getQuestionData(questionId);
  }

  public componentWillUnmount() {
    this.signal.cancel('Result status request cancelled');
  }

  public render() {
    const { question, visible } = this.state;
    const { classes, tags } = this.props;
    return (
      <Grid item={true} xs={10} sm={6} md={4} lg={4} className={classes.root}>
        <OpacityContainer
          className={classnames(classes.container, classes.vCenter)}
          pose={visible ? 'visible' : 'hidden'}
        >
          {visible && <Result result={question} tags={tags} />}
        </OpacityContainer>
      </Grid>
    );
  }
}

export default withStyles(styles)(ResultContainer);
