import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  Grid,
} from '@material-ui/core';
import * as React from 'react';
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
    height: 'calc(100% + 90px)',
    width: '100%',
    marginTop: '-90px',
    display: 'flex',
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
