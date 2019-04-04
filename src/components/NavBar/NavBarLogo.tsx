import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';

export interface INavBarLogoProps extends WithStyles<typeof styles> {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

const NavBarLogo = (props: INavBarLogoProps) => {
  return <div />;
};

export default withStyles(styles)(NavBarLogo);
