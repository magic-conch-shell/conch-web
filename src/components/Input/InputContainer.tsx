import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';

export interface IInputContainerProps extends WithStyles<typeof styles> {
  placeholder?: string;
}

export interface IInputContainerState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  inputLeftPadding: {
    width: '100%',
    display: 'flex',
    paddingLeft: '20px',
  },
  inputContainer: {
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.primary.light,
    boxShadow: 'none',
    borderRadius: '24px',
    zIndex: 3,
    margin: '8px auto',
    height: '100%',
  },
});

class InputContainer extends React.Component<
  IInputContainerProps,
  IInputContainerState
> {
  public render() {
    const { children, classes } = this.props;
    return (
      <div className={classes.inputContainer}>
        <div className={classes.inputLeftPadding}>{children}</div>
      </div>
    );
  }
}

export default withStyles(styles)(InputContainer);
