import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';

import { IQuestion } from '../../../interfaces/Question';
import { ITag } from '../../../interfaces/Tag';
import { IUser } from '../../../interfaces/User';
import QuestionList from '../../List/QuestionList';
import { darken } from '@material-ui/core/styles/colorManipulator';

export interface IHomeProps extends WithStyles<typeof styles> {
  questions: IQuestion[];
  setQuestions: (questions: IQuestion[]) => void;
  handleFinishLoading: () => void;
  tags: ITag[];
  user: IUser;
}

export interface IHomeState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing.unit * 2,
    }
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
  public componentDidMount() {
    this.props.handleFinishLoading();
  }

  public render() {
    const { classes, questions, tags, user } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} className={classes.contentContainer}>
          <Grid item={true} xs={12} sm={12}>
            <QuestionList questions={questions} tags={tags} userId={user.id} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withRouter(withStyles(styles)(Home));
