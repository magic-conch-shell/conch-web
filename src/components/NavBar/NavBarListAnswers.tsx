import * as React from 'react';

import { Badge, IconButton, StyleRulesCallback, Theme, Tooltip, WithStyles, withStyles } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';

import { Link } from 'react-router-dom';
import Spellcheck from '@material-ui/icons/Spellcheck';
import { TabTypes } from '../Profile/ProfileContainer';

export interface INavBarListAnswersProps extends WithStyles<typeof styles> {
  unread: number;
}

export interface INavBarListAnswersState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class NavBarListAnswers extends React.Component<RouteComponentProps<any> & INavBarListAnswersProps, INavBarListAnswersState> {
  public render() {
    const { location, unread } = this.props;
    return (
      <Tooltip title='My Answers'>
        <Link to={{
          pathname: '/profile',
          state: { currentTab: TabTypes.MentorPanel }
        }}
          replace={location.pathname === '/profile'}>
          <IconButton>
            <Badge badgeContent={unread} color='primary'>
              <Spellcheck />
            </Badge>
          </IconButton>
        </Link>
      </Tooltip>
    );
  }
}

export default withRouter(withStyles(styles)(NavBarListAnswers));
