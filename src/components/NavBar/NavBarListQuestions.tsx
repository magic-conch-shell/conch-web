import * as React from 'react';

import { Badge, IconButton, StyleRulesCallback, Theme, Tooltip, WithStyles, withStyles } from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';

import { Link } from 'react-router-dom';
import List from '@material-ui/icons/List';
import { TabTypes } from '../Profile/ProfileContainer';

export interface INavBarListQuestionsProps extends WithStyles<typeof styles> {
  unread: number;
}

export interface INavBarListQuestionsState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class NavBarListQuestions extends React.Component<RouteComponentProps<any> & INavBarListQuestionsProps, INavBarListQuestionsState> {
  public render() {
    const { location, unread } = this.props;
    return (
      <Tooltip title='My Questions'>
        <Link to={{
          pathname: '/profile',
          state: { currentTab: TabTypes.Home }
        }}
          replace={location.pathname === '/profile'}>
          <IconButton>
            <Badge badgeContent={unread} color='primary'>
              <List />
            </Badge>
          </IconButton>
        </Link>
      </Tooltip>
    );
  }
}

export default withRouter(withStyles(styles)(NavBarListQuestions));
