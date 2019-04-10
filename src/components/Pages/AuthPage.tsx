import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import AuthContainer from '../Auth/AuthContainer';
import { IUser } from '../../interfaces/User';

export interface IAuthPageProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
  handleSignIn: (user: IUser) => void;
}

export interface IAuthPageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '-90px',
    display: 'flex',
    zIndex: 9999
  },
});

class AuthPage extends React.Component<IAuthPageProps, IAuthPageState> {
  public componentDidMount() {
    this.props.handleFinishLoading();
  }
  public render() {
    const { classes, handleSignIn } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <AuthContainer handleSignIn={handleSignIn} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(AuthPage);
