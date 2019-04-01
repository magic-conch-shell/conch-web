import * as React from 'react';

import { CircularProgress, Paper, StyleRulesCallback, Theme, WithStyles, withStyles } from '@material-ui/core';

export interface IProfileContentProps extends WithStyles<typeof styles> {
  component: React.ComponentType<any>;
}

export interface IProfileContentState {
  loading: boolean;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  full: {
    height: '100%',
    width: '100%'
  },
  loading: {
    margin: 'auto',
  },
  loadingContainer: {
    display: 'flex',
    width: '25%',
    height: '25%',
    margin: 'auto',
  },
});
class ProfileContent extends React.Component<IProfileContentProps, IProfileContentState> {
  public state = {
    loading: true
  };

  public handleFinishedLoading = () => {
    console.log('Finished loading!');
    this.isNotLoading();
  };

  public handleStartLoading = () => {
    console.log('Loading data!');
    this.isLoading();
  };

  public isLoading = () => {
    this.setState({ loading: true });
  };

  public isNotLoading = () => {
    this.setState({ loading: false });
  };

  public render() {
    const { loading } = this.state;
    const { classes, component: ProfileComponent } = this.props;
    return (
      <Paper className={classes.full} elevation={4}>
        {loading && (
          <div className={classes.loadingContainer}>
            <CircularProgress className={classes.loading} size={96} />
          </div>
        )}
        <ProfileComponent handleFinishLoading={this.handleFinishedLoading} />
      </Paper>
    );
  }
}

export default withStyles(styles)(ProfileContent);
