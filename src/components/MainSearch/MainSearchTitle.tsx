import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';

export interface IMainSearchTitleProps {
  placeholder?: string;
}

export interface IMainSearchTitleState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    paddingTop: '16.5px',
    paddingBottom: '16.5px',
    color: theme.palette.text.primary,
    wordWrap: 'break-word',
    outline: 'none',
    resize: 'none',
    width: 'calc(100% - 24px)',
    fontFamily: 'monospace',
    '&::placeholder': {
      opacity: 0.65,
      color: theme.palette.text.primary,
    },
  },
});

class MainSearchTitle extends React.Component<
  WithStyles<any> & IMainSearchTitleProps,
  IMainSearchTitleState
> {
  public render() {
    const { classes } = this.props;
    return (
      <input
        className={classes.input}
        type="text"
        placeholder="Enter a title (optional)"
      />
    );
  }
}

export default withStyles(styles)(MainSearchTitle);
