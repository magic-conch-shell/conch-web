import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import AuthFormContainer from './AuthFormContainer';
import { IUser } from '../../interfaces/User';

export interface IAuthContainerProps extends WithStyles<typeof styles> {
  handleSignIn: (user: IUser) => void;
}

export interface IAuthContainerState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    marginTop: 'auto',
    marginBottom: 'auto',
    display: 'flex',
    flexWrap: 'wrap',
  },
});

class AuthContainer extends React.Component<
  IAuthContainerProps,
  IAuthContainerState
  > {
  public render() {
    const { classes, handleSignIn } = this.props;
    return (
      <Grid item={true} xs={11} sm={6} md={4} lg={4} className={classes.root}>
        <AuthFormContainer handleSignIn={handleSignIn} />
      </Grid>
    );
  }
}

export default withStyles(styles)(AuthContainer);
