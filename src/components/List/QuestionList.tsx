import * as React from 'react';

import {
  Chip,
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
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

import { IQuestion } from '../../interfaces/Question';
import { ITag } from '../../interfaces/Tag';
import classnames from 'classnames';

export interface IQuestionListProps extends WithStyles<typeof styles> {
  userId?: number;
  tags: ITag[];
  questions: IQuestion[];
}

export interface IQuestionListState {
  errorText: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  dirty: {
    backgroundColor: theme.palette.type === 'light'
      ? lighten(theme.palette.primary.main, 0.75)
      : darken(theme.palette.primary.main, 0.75),
  },
  paper: {
    overflowX: 'auto',
    [theme.breakpoints.only('xs')]: {
      height: '300px'
    }
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
  tableRow: {
    cursor: 'pointer',
    '& > th,td': {
      [theme.breakpoints.up('sm')]: {
        fontSize: '10px',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '12px',
        padding: theme.spacing.unit * 2
      },
      fontSize: '8px',
      padding: theme.spacing.unit
    }
  },
  chip: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    [theme.breakpoints.only('xs')]: {
      fontSize: '8px',
      margin: 0,
      padding: 0
    },
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
    const { classes, questions } = this.props;
    return (
      <Paper className={classes.paper} elevation={4}>
        <Table className={classes.table} padding="dense">
          <TableHead className={classes.tableHeader}>
            <TableRow className={classes.tableRow}>
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
                    className={classnames(classes.tableRow, question.is_dirty && classes.dirty)}
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
      </Paper>
    );
  }
}

export default withRouter(withStyles(styles)(QuestionList));
