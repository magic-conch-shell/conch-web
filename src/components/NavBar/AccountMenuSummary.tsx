import * as React from 'react';

import { Avatar, StyleRulesCallback, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';

import { IUser } from '../../interfaces/User';

export interface IAccountMenuSummaryProps extends WithStyles<typeof styles> {
  user: IUser;
}

export interface IAccountMenuSummaryState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  avatar: {
    height: '40px',
    width: '40px',
    borderRadius: '5px'
  }
});

class AccountMenuSummary extends React.Component<IAccountMenuSummaryProps, IAccountMenuSummaryState> {
  public render() {
    const { classes, user } = this.props;
    return (
      <>
        <Avatar className={classes.avatar} src={user.avatar} />
        <div style={{ paddingLeft: '5px' }}>
          <Typography>{user.nickname}</Typography>
          <Typography variant='caption'>user status</Typography>
        </div>
      </>
    );
  }
}

export default withStyles(styles)(AccountMenuSummary);
