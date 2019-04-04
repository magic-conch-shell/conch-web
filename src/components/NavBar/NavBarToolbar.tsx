import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  Toolbar,
} from '@material-ui/core';
import * as React from 'react';
import { Link } from 'react-router-dom';

export interface INavBarToolbarProps extends WithStyles<typeof styles> {
  logoColor: string;
}

export interface INavBarToolbarState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  appBarLogo: {
    height: '64px',
  },
  toolbar: {
    display: 'flex',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  marginLeftAuto: {
    marginLeft: 'auto',
    display: 'flex',
  },
});

class NavBarToolbar extends React.Component<
  INavBarToolbarProps,
  INavBarToolbarState
> {
  public render() {
    const { classes, logoColor } = this.props;
    return (
      <Toolbar className={classes.toolbar}>
        <Link to="/">
          <img
            className={classes.appBarLogo}
            src={`https://s3.ca-central-1.amazonaws.com/conch-resources/conch_logo_${logoColor}.png`}
          />
        </Link>
        <div className={classes.marginLeftAuto}>{this.props.children}</div>
      </Toolbar>
    );
  }
}

export default withStyles(styles)(NavBarToolbar);
