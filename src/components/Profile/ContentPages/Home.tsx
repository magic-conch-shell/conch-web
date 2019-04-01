import * as React from 'react';

import { StyleRulesCallback, Theme, WithStyles, withStyles } from '@material-ui/core';

export interface IHomeProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
}

export interface IHomeState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class Home extends React.Component<IHomeProps, IHomeState> {
  public componentDidMount() {
    setTimeout(() => this.props.handleFinishLoading(), 1000);
  }
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        HOME
      </div>
    );
  }
}

export default withStyles(styles)(Home);
