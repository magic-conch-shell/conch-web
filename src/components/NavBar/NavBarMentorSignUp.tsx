import * as React from 'react';

import { IconButton, StyleRulesCallback, Theme, Tooltip, WithStyles, withStyles } from '@material-ui/core';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';

import School from '@material-ui/icons/School';
import { TabTypes } from '../Profile/ProfileContainer';

export interface INavBarMentorSignUpProps extends WithStyles<typeof styles> {
  placeholder?: string;
}

export interface INavBarMentorSignUpState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class NavBarMentorSignUp extends React.Component<RouteComponentProps<any> & INavBarMentorSignUpProps, INavBarMentorSignUpState> {
  public render() {
    const { location } = this.props;
    console.log(location.pathname);
    return (
      <Tooltip title='Become a Mentor'>
        <Link to={{
          pathname: '/profile',
          state: { currentTab: TabTypes.Settings, mentorDialogOpen: true }
        }}
          replace={location.pathname === '/profile'}>
          <IconButton>
            <School />
          </IconButton>
        </Link>
      </Tooltip>
    );
  }
}

export default withRouter(withStyles(styles)(NavBarMentorSignUp));
