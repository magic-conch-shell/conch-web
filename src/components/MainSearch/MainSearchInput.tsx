import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  IconButton,
} from '@material-ui/core';
import {
  AddCircleOutlined as AddIcon,
  RemoveCircleOutlined as RemoveIcon,
} from '@material-ui/icons';
import * as React from 'react';
import TextareaAutosize from 'react-textarea-autosize';

export interface IMainSearchInputProps {
  inputState: InputState;
  toggleInputState: () => void;
}

export interface IMainSearchInputState {
  disableInputIcon: boolean;
}

enum InputState {
  DEFAULT,
  EXPANDED,
}

const rowCounts: { [key in InputState]: { min: number; max: number } } = {
  [InputState.DEFAULT]: {
    min: 1,
    max: 2,
  },
  [InputState.EXPANDED]: {
    min: 8,
    max: 40,
  },
};

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
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
  inputIcon: {
    '&:hover': {
      backgroundColor: 'rgba(0,0,0,0)',
    },
  },
  inputElementsContainer: {
    display: 'flex',
    width: '100%',
  },
  inputPadding: {
    flex: 1,
    display: 'flex',
    paddingLeft: '20px',
  },
});

class MainSearchInput extends React.Component<
  WithStyles<any> & IMainSearchInputProps,
  IMainSearchInputState
> {
  public state = {
    disableInputIcon: false,
  };

  public handleHeightChange = (height: any) => {
    if (height > 15 && this.props.inputState === InputState.DEFAULT) {
      this.props.toggleInputState();
    }
  };

  public render() {
    const { disableInputIcon } = this.state;
    const { classes, inputState, toggleInputState } = this.props;
    return (
      <>
        <TextareaAutosize
          className={classes.input}
          onHeightChange={(height) => this.handleHeightChange(height)}
          minRows={rowCounts[inputState].min}
          maxRows={rowCounts[inputState].max}
          name="question"
          placeholder="Ask a Question"
          autoFocus={true}
          required={true}
        />
        <IconButton
          className={classes.inputIcon}
          onClick={toggleInputState}
          disabled={disableInputIcon}
        >
          {inputState === InputState.DEFAULT && <AddIcon />}
          {inputState === InputState.EXPANDED && <RemoveIcon />}
        </IconButton>
      </>
    );
  }
}

export default withStyles(styles)(MainSearchInput);
