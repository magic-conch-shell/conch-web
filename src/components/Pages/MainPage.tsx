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
import MainSearchContainer from '../MainSearch/MainSearchContainer';

export interface IMainPageProps {
  addQuestion: (question: IQuestion) => void;
  handleFinishLoading: () => void;
  tags: ITag[];
}

export interface IMainPageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '-90px',
    display: 'flex',
  },
});

class MainPage extends React.Component<
  WithStyles<any> & IMainPageProps,
  IMainPageState
  > {
  public componentDidMount() {
    this.props.handleFinishLoading();
  }
  public render() {
    const { classes, addQuestion, tags } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <MainSearchContainer addQuestion={addQuestion} tags={tags} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MainPage);
