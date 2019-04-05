import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { ITag } from '../../interfaces/Tag';
import MainSearchContainer from '../MainSearch/MainSearchContainer';

export interface IMainPageProps {
  handleFinishLoading: () => void;
  tags: ITag[];
}

export interface IMainPageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    height: 'calc(100% + 90px)',
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
    const { classes, tags } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <MainSearchContainer tags={tags} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MainPage);
