import {
  IconButton,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import {
  AddCircleOutline as AddIcon,
  RemoveCircleOutline as RemoveIcon,
} from '@material-ui/icons';
import classnames from 'classnames';
import * as React from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import TextareaAutosize from 'react-textarea-autosize';

export interface IMainSearchProps extends RouteComponentProps, WithStyles {
  placeholder?: string;
}

export interface IMainSearchState {
  state: InputState;
  questionText: string;
  titleText: string;
  selectedTags: number[];
  tags: Array<{ id: number; label: string }>;
}

enum InputState {
  DEFAULT,
  EXPANDED,
}

const rowCounts: { [key in InputState]: { min: number; max: number } } = {
  [InputState.DEFAULT]: {
    min: 1,
    max: 1,
  },
  [InputState.EXPANDED]: {
    min: 8,
    max: 20,
  },
};

export type InputStates = 'default' | 'expanded';

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  form: {
    width: '100%',
    height: '100%',
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    paddingTop: '16.5px',
    paddingBottom: '16.5px',
    color: 'rgba(0,0,0,.87)',
    wordWrap: 'break-word',
    outline: 'none',
    resize: 'none',
    width: 'calc(100% - 24px)',
    fontFamily: 'monospace',
  },
  inputContainer: {
    backgroundColor: '#fff',
    display: 'flex',
    border: '1px solid #dfe1e5',
    boxShadow: 'none',
    borderRadius: '24px',
    zIndex: 3,
    margin: '0 auto',
  },
  inputTitle: {
    marginBottom: theme.spacing.unit * 2,
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
  link: {
    textDecoration: 'none',
  },
  searchButton: {
    padding: '15px 30px 14px',
    height: '60px',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: '1rem',
    borderRadius: '0px',
    letterSpacing: 2,
  },
});

class MainSearch extends React.Component<IMainSearchProps, IMainSearchState> {
  public questionTextInput: HTMLTextAreaElement | null;
  constructor(props: IMainSearchProps) {
    super(props);
    this.state = {
      state: InputState.DEFAULT,
      questionText: '',
      titleText: '',
      selectedTags: [] as number[],
      tags: [] as Array<{ id: number; label: string }>,
    };
    this.questionTextInput = null;
  }

  public componentDidMount() {
    if (this.questionTextInput) {
      this.questionTextInput.focus();
    }
  }
  public handleSubmit = (ev: any) => {
    ev.preventDefault();
    console.log('Submit!');
  };

  public toggleInputState = () => {
    this.setState((prevState) => ({ state: 1 - prevState.state }));
  };

  public updateQuestionTextField = (ev: any) => {
    this.setState({ questionText: ev.currentTarget.value });
  };

  public updateTitleTextField = (ev: any) => {
    this.setState({ titleText: ev.currentTarget.value });
  };
  public render() {
    const { state, questionText, titleText } = this.state;
    const { classes } = this.props;
    return (
      <form className={classes.form} onSubmit={(ev) => this.handleSubmit(ev)}>
        {state === InputState.EXPANDED && (
          <div
            className={classnames(classes.inputContainer, classes.inputTitle)}
          >
            <div className={classes.inputPadding}>
              <input
                className={classes.input}
                type="text"
                value={titleText}
                onChange={this.updateTitleTextField}
                placeholder="Enter a title (optional)"
              />
            </div>
          </div>
        )}
        <div className={classes.inputContainer}>
          <div className={classes.inputPadding}>
            <div className={classes.inputElementsContainer}>
              <TextareaAutosize
                className={classes.input}
                inputRef={(inputRef: HTMLTextAreaElement) =>
                  (this.questionTextInput = inputRef)
                }
                minRows={rowCounts[state].min}
                maxRows={rowCounts[state].max}
                name="question"
                placeholder="Ask a Question"
                value={questionText}
                onChange={this.updateQuestionTextField}
                autoFocus={true}
                required={true}
              />
              <IconButton
                className={classes.inputIcon}
                onClick={this.toggleInputState}
              >
                {state === InputState.DEFAULT && <AddIcon />}
                {state === InputState.EXPANDED && <RemoveIcon />}
              </IconButton>
            </div>
          </div>
        </div>
        <button type="submit" style={{ display: 'none' }} />
      </form>
    );
  }
}

export default withRouter(withStyles(styles)(MainSearch));
