import * as React from 'react';

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
import { RouteComponentProps, withRouter } from 'react-router';

import { IQuestion } from '../../../interfaces/Question';
import { ITag } from '../../../interfaces/Tag';
import { IUser } from '../../../interfaces/User';
import axios from 'axios';
import { darken } from '@material-ui/core/styles/colorManipulator';

export interface IHomeProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
  tags: ITag[];
  user: IUser;
}

export interface IHomeState {
  questions: IQuestion[];
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
    questions: [] as IQuestion[]
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
      .finally(() => {
        console.log('call handleFinishLoading');
        handleFinishLoading();
      });
  }

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
    const { questions } = this.state;
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} spacing={8} className={classes.contentContainer}>
          <Grid item={true} xs={true} md={true}>
            <Paper elevation={4}>
              <Table className={classes.table} padding="dense">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Title</TableCell>
                    <TableCell>Question</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {questions.map((question, index) => {
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
                        <TableCell>
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
                        <TableCell>{question.status}</TableCell>
                      </TableRow>
                    );
                  })}
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
