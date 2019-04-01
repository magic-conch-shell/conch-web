import * as React from 'react';

import { Avatar, Grid, StyleRulesCallback, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';

import Home from './ContentPages/Home';
import { IUser } from '../../interfaces/User';
import ProfileContent from './ProfileContent';
import ProfileTabList from './ProfileTabList';
import Settings from './ContentPages/Settings';

export interface IProfileContainerProps extends WithStyles<typeof styles> {
  user: IUser;
}

export interface IProfileContainerState {
  currentTab: number;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  avatar: {
    height: '160px',
    width: '160px',
    borderRadius: '5px'
  },
  root: {
    marginTop: 90 + theme.spacing.unit * 2
  },
  profileHeader: {
    display: 'flex'
  },
  profileHeaderText: {
    display: 'flex',
    marginLeft: theme.spacing.unit * 2,
    marginRight: 'auto',
    flexDirection: 'column',
  }
});

const PROFILE_TABS = [
  'Home',
  'Settings'
];

const PROFILE_CONTENT = [
  Home,
  Settings
];

class ProfileContainer extends React.Component<IProfileContainerProps, IProfileContainerState> {
  public state = {
    currentTab: 0
  };

  public changeCurrentTab = (newTabIndex: number) => {
    this.setState({ currentTab: newTabIndex });
  };

  public render() {
    const { currentTab } = this.state;
    const { classes, user } = this.props;
    return (
      <Grid item={true} xs={11} className={classes.root}>
        <Grid container={true} className={classes.full} spacing={24}>
          <Grid item={true} xs={12}>
            <div className={classes.profileHeader}>
              <Avatar className={classes.avatar} src={user.profileUrl} />
              <div className={classes.profileHeaderText}>
                <Typography variant='h3'>{user.nickname}</Typography>
                <Typography variant='h6'>{user.email}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item={true} xs={2} className={classes.full}>
            <ProfileTabList currentTab={currentTab} handleClick={this.changeCurrentTab} tabs={PROFILE_TABS} />
          </Grid>
          <Grid item={true} xs={10} className={classes.full}>
            <ProfileContent component={PROFILE_CONTENT[currentTab]} />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ProfileContainer);
