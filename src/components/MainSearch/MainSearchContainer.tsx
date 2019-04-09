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
import MainSearch from './MainSearch';

export interface IMainSearchContainerProps {
  addQuestion: (question: IQuestion) => void;
  tags: ITag[];
}

export interface IMainSearchContainerState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    margin: 'auto',
    display: 'flex',
    width: '40%',
    position: 'relative',
  },
});

class MainSearchContainer extends React.Component<
  WithStyles<any> & IMainSearchContainerProps,
  IMainSearchContainerState
  > {
  public render() {
    const { classes, tags, addQuestion } = this.props;
    return (
      <Grid item={true} xs={10} sm={8} md={6} lg={4} className={classes.root}>
        <MainSearch tags={tags} addQuestion={addQuestion} />
      </Grid>
    );
  }
}

export default withStyles(styles)(MainSearchContainer);
