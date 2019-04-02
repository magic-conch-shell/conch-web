import {
  Chip,
  Grid,
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
import { darken } from '@material-ui/core/styles/colorManipulator';
import axios from 'axios';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import { IQuestion } from '../../../interfaces/Question';
import { IUser } from '../../../interfaces/User';

export interface IHomeProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
  user: IUser;
}

export interface IHomeState {
  questions: IQuestion[];
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
    maxHeight: '400px',
  },
  contentContainer: {
    color: theme.palette.text.primary,
  },
  divider: {
    color: darken(theme.palette.primary.main, 0.1),
  },
  table: {
    overflowY: 'scroll',
  },
  tableRow: {
    cursor: 'pointer',
  },
});

class Home extends React.Component<
  RouteComponentProps<any> & IHomeProps,
  IHomeState
> {
  public state = {
    questions: [] as IQuestion[],
  };
  public componentDidMount() {
    const { handleFinishLoading, user } = this.props;
    axios({
      method: 'get',
      url: `/api/users/${user.id}/questions`,
    })
      .then((result) => {
        const { data } = result;
        this.setState({ questions: data });
      })
      .catch((err) => console.log(err))
      .finally(() => handleFinishLoading());
  }

  public handleLink = (id: number) => {
    this.props.history.push(`/results/${id}`);
  };

  public render() {
    const { questions } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} spacing={8} className={classes.contentContainer}>
          <Grid item={true} xs={6} md={8}>
            <Paper>
              <Table className={classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell>Date Submitted</TableCell>
                    <TableCell>Time Submitted</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question, index) => (
                    <TableRow
                      key={index}
                      onClick={() => this.handleLink(question.id)}
                      className={classes.tableRow}
                    >
                      <TableCell>
                        {new Date(question.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(question.created_at).toLocaleTimeString()}
                      </TableCell>
                      <TableCell>{question.title}</TableCell>
                      <TableCell>{question.content}</TableCell>
                      <TableCell>
                        {['Test Tag', 'Other Test Tag', 'Baseketball'].map(
                          (tag, i) => (
                            <Chip key={i} label={tag} />
                          )
                        )}
                      </TableCell>
                      <TableCell>{question.solved}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Home));
