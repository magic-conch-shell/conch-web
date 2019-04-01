import * as React from 'react';

import { Grid, StyleRulesCallback, Theme, WithStyles, withStyles } from '@material-ui/core';

import { ISettings } from '../../../interfaces/Settings';
import moment from 'moment-timezone';

export interface ISettingsProps extends WithStyles<typeof styles> {
  handleFinishLoading: () => void;
}

export interface ISettingsState {
  settings: ISettings;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

const TIMEZONES = moment.tz.names();

class Settings extends React.Component<ISettingsProps, ISettingsState> {
  public componentDidMount() {
    setTimeout(() => this.props.handleFinishLoading(), 1000);
  }
  public render() {
    console.log(TIMEZONES);
    return (
      <Grid container={true}>
        <Grid item={true} xs={6}>
          Dark Mode:
        </Grid>
        <Grid item={true} xs={6}>
          Time Zone:
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Settings);
