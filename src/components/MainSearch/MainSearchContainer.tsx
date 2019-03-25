import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  Grid,
} from '@material-ui/core';
import * as React from 'react';
import MainSearch from './MainSearch';

export interface IMainSearchContainerProps {
  placeholder?: string;
}

export interface IMainSearchContainerState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    margin: 'auto',
    display: 'flex',
    width: '40%',
  },
});

class MainSearchContainer extends React.Component<
  WithStyles<any> & IMainSearchContainerProps,
  IMainSearchContainerState
> {
  public render() {
    const { classes } = this.props;
    return (
      <Grid item={true} xs={10} sm={8} md={6} lg={4} className={classes.root}>
        <MainSearch />
      </Grid>
    );
  }
}

export default withStyles(styles)(MainSearchContainer);
