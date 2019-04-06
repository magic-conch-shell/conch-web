import * as React from 'react';

import {
  Grid,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { ISettings } from '../../interfaces/Settings';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import ProfileContainer from '../Profile/ProfileContainer';

export interface IProfilePageProps extends WithStyles<typeof styles> {
  editUser: (user: IUser) => void;
  handleFinishLoading: () => void;
  setTimeZone: (timeZone: string) => void;
  tags: ITag[];
  toggleTheme: () => void;
  user: IUser;
  userSettings: ISettings;
}

export interface IProfilePageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: '-90px',
    display: 'flex',
  },
});

class ProfilePage extends React.Component<
  IProfilePageProps,
  IProfilePageState
> {
  public componentDidMount() {
    this.props.handleFinishLoading();
  }
  public render() {
    const { classes, handleFinishLoading, ...rest } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <ProfileContainer {...rest} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ProfilePage);
