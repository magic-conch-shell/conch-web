import * as React from 'react';

import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

export interface IMainSearchTitleProps {
  handleChange: (title: string) => void;
  title: string;
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
  public _handleChange = (ev: any) => {
    this.props.handleChange(ev.target.value);
  };

  public render() {
    const { classes, title } = this.props;
    return (
      <input
        className={classes.input}
        type="text"
        placeholder="Enter a title (optional)"
        value={title}
        onChange={this._handleChange}
      />
    );
  }
}

export default withStyles(styles)(MainSearchTitle);
