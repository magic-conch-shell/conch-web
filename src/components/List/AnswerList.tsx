import * as React from 'react';

import {
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

import { IAnswer } from '../../interfaces/Answer';

export interface IAnswerListProps extends WithStyles<typeof styles> {
  userId?: number;
  answers: IAnswer[];
}

export interface IAnswerListState {
  errorText: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  dirty: {
    backgroundColor: theme.palette.type === 'light'
      ? lighten(theme.palette.primary.main, 0.75)
      : darken(theme.palette.primary.main, 0.75),
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

class AnswerList extends React.Component<
  RouteComponentProps<any> & IAnswerListProps,
  IAnswerListState
  > {
  public state = {
    errorText: '',
  };

  public handleLink = (id: number) => {
    this.props.history.push(`/results/${id}`);
  };

  public render() {
    const { classes, answers } = this.props;
    return (
      <Paper className={classes.paper} elevation={4}>
        <Table className={classes.table} padding="dense">
          <TableHead className={classes.tableHeader}>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Answer</TableCell>
              <TableCell>Selected</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {answers
              .sort((a, b) => {
                const aDate = new Date(a.created_at);
                const bDate = new Date(b.created_at);
                return aDate > bDate ? -1 : 1;
              })
              .map((answer, index) => {
                const createdAt = new Date(answer.created_at);
                return (
                  <TableRow
                    key={index}
                    onClick={() => this.handleLink(answer.question_id)}
                    className={classes.tableRow}
                    hover={true}
                  >
                    <TableCell>
                      {`${createdAt.toLocaleDateString()}\n${createdAt.toLocaleTimeString()}`}
                    </TableCell>
                    <TableCell style={{ wordWrap: 'break-word' }}>
                      {`${answer.content.substr(0, 20)}`}
                      {answer.content.length > 20 && '...'}
                    </TableCell>
                    <TableCell>{answer.selected.toString()}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

export default withRouter(withStyles(styles)(AnswerList));
