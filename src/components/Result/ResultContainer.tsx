import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  Grid,
} from '@material-ui/core';
import * as React from 'react';
import axios from 'axios';
import Result from './Result';

export interface IResult {
  content: string;
  created_at: string;
  id: number;
  solved: boolean;
  title: string;
  updated_at: string;
  user_id: number;
}

export interface IResultContainerProps extends WithStyles<typeof styles> {
  questionId: string;
}

export interface IResultContainerState {
  result: IResult;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class ResultContainer extends React.Component<
  IResultContainerProps,
  IResultContainerState
> {
  public state = {
    result: {} as IResult,
  };

  public componentDidMount() {
    const { questionId } = this.props;
    const getQuestionData = (qid: string) => {
      const INTERVAL = 10;
      if (qid) {
        axios({
          method: 'get',
          url: `/api/questions/${qid}`,
        })
          .then((result) => {
            const { data } = result;
            this.setState({ result: data }, () => {
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

  public render() {
    const { result } = this.state;
    const { classes } = this.props;
    return (
      <Grid item={true} xs={10} sm={6} md={4} lg={4} className={classes.root}>
        <Result result={result} />
      </Grid>
    );
  }
}

export default withStyles(styles)(ResultContainer);
