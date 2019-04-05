import * as React from 'react';

import { RouteComponentProps, withRouter } from 'react-router-dom';
import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { ITag } from '../../interfaces/Tag';
import InputContainer from '../Input/InputContainer';
import MainSearchInput from './MainSearchInput';
import MainSearchSelect from './MainSearchSelect';
import MainSearchTagContainer from './MainSearchTagContainer';
import MainSearchTitle from './MainSearchTitle';
import axios from 'axios';
import posed from 'react-pose';

export interface IMainSearchProps extends RouteComponentProps, WithStyles {
  tags: ITag[];
}

export interface IMainSearchState {
  content: string;
  title: string;
  inputState: InputState;
  submissionState: SubmissionState;
  selectedTags: number[];
}

enum InputState {
  DEFAULT,
  EXPANDED,
}

enum SubmissionState {
  DEFAULT,
  SUBMITTED,
}

const TRANSITION_DURATION = 750;

const OpacityContainer = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
});

const LongOpacityContainer = posed.div({
  hidden: { opacity: 0, transition: { duration: TRANSITION_DURATION } },
  visible: { opacity: 1, transition: { duration: TRANSITION_DURATION } },
});

const HeightContainer = posed.div({
  default: {
    height: '50px',
    transition: {
      duration: 300,
      ease: 'easeOut',
    },
  },
  expanded: {
    height: '155px',
    transition: {
      type: 'spring',
      stiffness: 150,
    },
  },
});

export type InputStates = 'default' | 'expanded';

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    width: '100%',
    height: '100%',
  },
  tagSelect: {
    width: '100%',
    backgroundColor: 'white',
  },
  selectPadding: {
    paddingRight: '12px',
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
  selectedTagsContainer: {
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
  },
});

class MainSearch extends React.Component<IMainSearchProps, IMainSearchState> {
  public heightRef: React.RefObject<any>;

  constructor(props: IMainSearchProps) {
    super(props);
    this.state = {
      content: '',
      title: '',
      inputState: InputState.DEFAULT,
      submissionState: SubmissionState.DEFAULT,
      selectedTags: [] as number[],
    };
    this.heightRef = React.createRef();
  }

  public handleSubmit = (ev?: any) => {
    if (ev) {
      ev.preventDefault();
    }
    const { content, title, selectedTags } = this.state;
    if (content.length > 0 && selectedTags.length > 0) {
      axios({
        method: 'post',
        url: '/api/questions',
        params: {
          title,
          content,
          tags: selectedTags,
        },
      })
        .then((result) => {
          const { data } = result;
          const { id } = data;
          this.setSubmissionStateToSubmitted(id);
        })
        .catch((err) => console.log(err));
    } else {
      alert('Fill in the form! Replace me with actual error text in the form!');
    }
  };

  public toggleInputState = () => {
    this.setState((prevState) => ({ inputState: 1 - prevState.inputState }));
  };

  public setInputStateToDefault = () => {
    this.setState({ inputState: InputState.DEFAULT });
  };

  public setInputStateToExpanded = () => {
    this.setState({ inputState: InputState.EXPANDED });
  };

  public setSubmissionStateToSubmitted = (questionId: number) => {
    const { history } = this.props;
    this.setState({ submissionState: SubmissionState.SUBMITTED }, () =>
      setTimeout(() => {
        history.push(`/results/${questionId}`);
      }, TRANSITION_DURATION)
    );
  };

  public setHeightRef = () => {
    this.heightRef.current.style.height = 'auto';
  };

  public handleSelectTag = (tagId: number) => {
    this.setState({
      selectedTags: [...this.state.selectedTags, tagId],
    });
  };
  public handleDelete = (sid: number) => {
    const selectedTags = [...this.state.selectedTags];
    selectedTags.splice(selectedTags.indexOf(sid), 1);
    this.setState({ selectedTags });
  };

  public handleChangeContent = (content: string) => {
    this.setState({ content });
  };

  public handleChangeTitle = (title: string) => {
    this.setState({ title });
  };

  public render() {
    const {
      selectedTags,
      inputState,
      title,
      content,
      submissionState,
    } = this.state;
    const { classes, tags } = this.props;
    return (
      <LongOpacityContainer
        className={classes.root}
        pose={
          submissionState === SubmissionState.DEFAULT ? 'visible' : 'hidden'
        }
      >
        <form onSubmit={this.handleSubmit}>
          <OpacityContainer
            pose={inputState === InputState.EXPANDED ? 'visible' : 'hidden'}
          >
            {inputState === InputState.EXPANDED && (
              <InputContainer>
                <MainSearchTitle
                  title={title}
                  handleChange={this.handleChangeTitle}
                />
              </InputContainer>
            )}
          </OpacityContainer>
          <HeightContainer
            ref={this.heightRef}
            onPoseComplete={() => {
              this.setHeightRef();
            }}
            pose={inputState === InputState.EXPANDED ? 'expanded' : 'default'}
          >
            <InputContainer>
              <MainSearchInput
                inputState={inputState}
                content={content}
                handleChange={this.handleChangeContent}
                handleSubmit={this.handleSubmit}
                toggleInputState={this.toggleInputState}
                setInputStateToDefault={this.setInputStateToDefault}
                setInputStateToExpanded={this.setInputStateToExpanded}
              />
            </InputContainer>
          </HeightContainer>
          <div style={{ height: '50px' }}>
            <InputContainer>
              <MainSearchSelect
                handleSelectTag={this.handleSelectTag}
                selectedTags={selectedTags}
                tags={tags}
              />
            </InputContainer>
          </div>
          <MainSearchTagContainer
            handleDeleteTag={this.handleDelete}
            selectedTags={selectedTags}
            tags={tags}
          />
          <button type="submit" style={{ display: 'none' }} />
        </form>
      </LongOpacityContainer>
    );
  }
}

export default withRouter(withStyles(styles)(MainSearch));
