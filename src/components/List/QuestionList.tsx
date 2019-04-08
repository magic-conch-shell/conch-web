import * as React from 'react';

import {
  Chip,
  CircularProgress,
  Paper,
  StyleRulesCallback,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';

import { IQuestion } from '../../interfaces/Question';
import { ITag } from '../../interfaces/Tag';
import axios from 'axios';

export interface IQuestionListProps extends WithStyles<typeof styles> {
  userId?: number;
  tags: ITag[];
}

export interface IQuestionListState {
  errorText: string;
  loading: boolean;
  questions: IQuestion[];
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  loading: {
    margin: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    width: '25%',
    height: '25%',
    margin: 'auto',
  },
  table: {
    overflowY: 'scroll',
  },
  tableRow: {
    cursor: 'pointer',
  },
  tableHeader: {
    position: 'sticky',
    boxShadow:
      '0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12)',
  },
  tableBody: {
    overflowY: 'scroll',
  },
  chip: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: theme.palette.primary.main,
    borderWidth: '1px',
    borderStyle: 'solid',
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
});

class QuestionList extends React.Component<
  RouteComponentProps<any> & IQuestionListProps,
  IQuestionListState
  > {
  public state = {
    errorText: '',
    loading: true,
    questions: [] as IQuestion[],
  };
  public componentDidMount() {
    const { userId } = this.props;
    if (userId) {
      this.getQuestionsByUserId(userId);
    } else {
      this.getAllQuestions();
    }
  }

  public getQuestionsByUserId = (userId: number) => {
    axios({
      method: 'get',
      url: `/api/users/${userId}/questions`,
    })
      .then((result) => {
        const { data } = result;
        this.setState({ questions: data });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  public getAllQuestions = () => {
    // get all questions
  };

  public handleLink = (id: number) => {
    this.props.history.push(`/results/${id}`);
  };

  public getTagById = (id: number) => {
    const { tags } = this.props;
    const len = tags.length;
    let result = {} as { id: number; name: string };
    for (let i = 0; i < len; i += 1) {
      if (tags[i].id === id) {
        result = tags[i];
        break;
      }
    }
    return result;
  };

  public render() {
    const { errorText, loading, questions } = this.state;
    const { classes } = this.props;
    return (
      <Paper className={classes.paper} elevation={4}>
        {loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress className={classes.loading} size={96} />
          </div>
        ) : errorText.length > 0 ? (
          <div className={classes.error}>{errorText}</div>
        ) : (
              <Table className={classes.table} padding="dense">
                <TableHead className={classes.tableHeader}>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody className={classes.tableBody}>
                  {questions
                    .sort((a, b) => {
                      const aDate = new Date(a.created_at);
                      const bDate = new Date(b.created_at);
                      return aDate > bDate ? -1 : 1;
                    })
                    .map((question, index) => {
                      const createdAt = new Date(question.created_at);
                      return (
                        <TableRow
                          key={index}
                          onClick={() => this.handleLink(question.id)}
                          className={classes.tableRow}
                          hover={true}
                        >
                          <TableCell>
                            {`${createdAt.toLocaleDateString()}\n${createdAt.toLocaleTimeString()}`}
                          </TableCell>
                          <TableCell>
                            {question.title.length > 0 &&
                              `${question.title.substr(0, 20)}`}
                            {question.title.length > 20 && '...'}
                          </TableCell>
                          <TableCell style={{ wordWrap: 'break-word' }}>
                            {`${question.content.substr(0, 20)}`}
                            {question.content.length > 20 && '...'}
                          </TableCell>
                          <TableCell>
                            {question.tags.map((tag, i) => (
                              <Chip
                                key={i}
                                className={classes.chip}
                                label={this.getTagById(tag).name}
                              />
                            ))}
                          </TableCell>
                          <TableCell>{question.question_status && question.question_status.status}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            )}
      </Paper>
    );
  }
}

export default withRouter(withStyles(styles)(QuestionList));
