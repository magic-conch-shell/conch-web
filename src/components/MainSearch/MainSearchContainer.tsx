import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { ITag } from '../../interfaces/Tag';
import MainSearch from './MainSearch';

export interface IMainSearchContainerProps {
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
    const { classes, tags } = this.props;
    return (
      <Grid item={true} xs={10} sm={8} md={6} lg={4} className={classes.root}>
        <MainSearch tags={tags} />
      </Grid>
    );
  }
}

export default withStyles(styles)(MainSearchContainer);
