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
  tags: Array<{ id: number; name: string }>;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
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
  chip: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: theme.palette.primary.main,
    borderWidth: '1px',
    borderStyle: 'solid',
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
});

class Home extends React.Component<
  RouteComponentProps<any> & IHomeProps,
  IHomeState
> {
  public state = {
    questions: [] as IQuestion[],
    tags: [] as Array<{ id: number; name: string }>,
  };
  public componentDidMount() {
    const { handleFinishLoading, user } = this.props;
    axios({
      method: 'get',
      url: `/api/users/${user.id}/questions`,
    })
      .then((result) => {
        const { data } = result;
        console.log(data);
        this.setState({ questions: data });
      })
      .catch((err) => console.log(err))
      .finally(() => {
        console.log('call handleFinishLoading');
        handleFinishLoading();
      });

    axios('/api/tags').then((result) => {
      const { data } = result;
      this.setState({ tags: data });
    });
  }

  public handleLink = (id: number) => {
    this.props.history.push(`/results/${id}`);
  };

  public getTagById = (id: number) => {
    const { tags } = this.state;
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
    const { questions } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} spacing={8} className={classes.contentContainer}>
          <Grid item={true} xs={true} md={true}>
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
                      hover={true}
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
                        {question.tags.map((tag, i) => (
                          <Chip
                            key={i}
                            className={classes.chip}
                            label={this.getTagById(tag).name}
                          />
                        ))}
                      </TableCell>
                      <TableCell>{question.status}</TableCell>
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
