import * as React from 'react';

import { Grid, StyleRulesCallback, Theme, WithStyles, withStyles } from '@material-ui/core';

import { IUser } from '../../interfaces/User';
import ProfileContainer from '../Profile/ProfileContainer';

export interface IProfilePageProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
  user: IUser;
}

export interface IProfilePageState {
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

class ProfilePage extends React.Component<IProfilePageProps, IProfilePageState> {
  public componentDidMount() {
    this.props.handleFinishLoading();
  }
  public render() {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <ProfileContainer user={user} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ProfilePage);
