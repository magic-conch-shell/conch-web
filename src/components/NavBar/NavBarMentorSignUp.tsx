import * as React from 'react';

import { IconButton, StyleRulesCallback, Theme, Tooltip, WithStyles, withStyles } from '@material-ui/core';

import { Link } from 'react-router-dom';
import School from '@material-ui/icons/School';

export interface INavBarMentorSignUpProps extends WithStyles<typeof styles> {
  placeholder?: string;
}

export interface INavBarMentorSignUpState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class NavBarMentorSignUp extends React.Component<INavBarMentorSignUpProps, INavBarMentorSignUpState> {
  public render() {
    return (
      <Tooltip title='Become a Mentor'>
        <Link to={{
          pathname: '/profile',
          state: { currentTab: 2, mentorDialogOpen: true }
        }}>
          <IconButton>
            <School />
          </IconButton>
        </Link>
      </Tooltip>
    );
  }
}

export default withStyles(styles)(NavBarMentorSignUp);
