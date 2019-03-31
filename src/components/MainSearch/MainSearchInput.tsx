import * as React from 'react';

import {
  IconButton,
  StyleRulesCallback,
  Theme,
  Tooltip,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import AddCircleOutlined from '@material-ui/icons/AddCircleOutlined';
import Send from '@material-ui/icons/Send';
import TextareaAutosize from 'react-textarea-autosize';

export interface IMainSearchInputProps extends WithStyles<typeof styles> {
  content: string;
  inputState: InputState;
  handleChange: (content: string) => void;
  handleSubmit: () => void;
  setInputStateToDefault: () => void;
  setInputStateToExpanded: () => void;
  toggleInputState: () => void;
}

export interface IMainSearchInputState {
  disableInputIcon: boolean;
}

enum InputState {
  DEFAULT,
  EXPANDED,
}

const rowCounts: { [key in InputState]: { min: number } } = {
  [InputState.DEFAULT]: {
    min: 1,
  },
  [InputState.EXPANDED]: {
    min: 8,
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

const IconButtonStates: { [key in InputState]: { tooltip: string } } = {
  [InputState.DEFAULT]: {
    tooltip: 'Expand',
  },
  [InputState.EXPANDED]: {
    tooltip: 'Submit Question',
  },
};

class MainSearchInput extends React.Component<
  IMainSearchInputProps,
  IMainSearchInputState
> {
  public inputRef: HTMLTextAreaElement | null;
  public state = {
    disableInputIcon: false,
  };
  constructor(props: IMainSearchInputProps) {
    super(props);
    this.state = {
      disableInputIcon: false,
    };
    this.inputRef = null;
  }

  public handleHeightChange = (height: any) => {
    const { inputState, setInputStateToExpanded } = this.props;
    if (this.inputRef) {
      if (inputState === InputState.DEFAULT && height > 15) {
        setInputStateToExpanded();
      }
    }
  };

  public _handleChange = (ev: any) => {
    this.props.handleChange(ev.target.value);
  };

  public render() {
    const { disableInputIcon } = this.state;
    const {
      classes,
      content,
      handleSubmit,
      inputState,
      toggleInputState,
    } = this.props;
    return (
      <>
        <TextareaAutosize
          inputRef={(ref) => (this.inputRef = ref)}
          className={classes.input}
          onHeightChange={(height) => this.handleHeightChange(height)}
          minRows={rowCounts[inputState].min}
          name="question"
          placeholder="Ask a Question"
          autoFocus={true}
          required={true}
          value={content}
          onChange={this._handleChange}
        />
        <Tooltip title={IconButtonStates[inputState].tooltip} placement="right">
          <IconButton
            className={classes.inputIcon}
            onClick={
              inputState === InputState.DEFAULT
                ? toggleInputState
                : handleSubmit
            }
            disabled={disableInputIcon}
            tabIndex={-1}
          >
            {inputState === InputState.DEFAULT && <AddCircleOutlined />}
            {inputState === InputState.EXPANDED && <Send />}
          </IconButton>
        </Tooltip>
      </>
    );
  }
}

export default withStyles(styles)(MainSearchInput);
