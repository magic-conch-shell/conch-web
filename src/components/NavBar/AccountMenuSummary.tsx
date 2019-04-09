import * as React from 'react';

import {
  Avatar,
  StyleRulesCallback,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { IUser } from '../../interfaces/User';

export interface IAccountMenuSummaryProps extends WithStyles<typeof styles> {
  user: IUser;
}

export interface IAccountMenuSummaryState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  avatar: {
    height: '40px',
    width: '40px',
    borderRadius: '5px',
  },
  root: {
    padding: theme.spacing.unit * 2,
    paddingTop: theme.spacing.unit,
    display: 'flex',
  },
  userInfo: {
    marginLeft: theme.spacing.unit,
  },
  userNickName: {
    fontWeight: 'bold',
  },
  userStatus: {},
});

class AccountMenuSummary extends React.Component<
  IAccountMenuSummaryProps,
  IAccountMenuSummaryState
  > {
  public render() {
    const { classes, user } = this.props;
    return (
      <div className={classes.root}>
        <Avatar className={classes.avatar} src={user.avatar_url} />
        <div className={classes.userInfo}>
          <Typography className={classes.userNickName}>
            {user.nickname}
          </Typography>
          <Typography className={classes.userStatus} variant="caption">
            {user.is_mentor ? 'Mentor' : 'Client'}
          </Typography>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AccountMenuSummary);
