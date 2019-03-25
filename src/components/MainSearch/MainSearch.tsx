import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';
import posed from 'react-pose';
import { RouteComponentProps, withRouter } from 'react-router-dom';

import MainSearchInput from './MainSearchInput';
import MainSearchSelect from './MainSearchSelect';
import MainSearchTitle from './MainSearchTitle';
import InputContainer from '../Input/InputContainer';
import MainSearchTagContainer from './MainSearchTagContainer';

export interface IMainSearchProps extends RouteComponentProps, WithStyles {
  placeholder?: string;
}

export interface IMainSearchState {
  state: InputState;
  selectedTags: number[];
  tags: Array<{ id: number; label: string }>;
}

enum InputState {
  DEFAULT,
  EXPANDED,
}

const OpacityContainer = posed.div({
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
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
  form: {
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
      state: InputState.DEFAULT,
      selectedTags: [] as number[],
      tags: [] as Array<{ id: number; label: string }>,
    };
    this.heightRef = React.createRef();
  }

  public componentDidMount() {
    const tags = require('../../constants/tags.json');

    this.setState({ tags });
  }

  public handleSubmit = (ev: any) => {
    ev.preventDefault();
    console.log('Submit!');
  };

  public toggleInputState = () => {
    this.setState((prevState) => ({ state: 1 - prevState.state }));
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

  public render() {
    const { selectedTags, state, tags } = this.state;
    const { classes } = this.props;
    return (
      <form className={classes.form} onSubmit={(ev) => this.handleSubmit(ev)}>
        <OpacityContainer
          pose={state === InputState.EXPANDED ? 'visible' : 'hidden'}
        >
          {state === InputState.EXPANDED && (
            <InputContainer>
              <MainSearchTitle />
            </InputContainer>
          )}
        </OpacityContainer>
        <HeightContainer
          ref={this.heightRef}
          onPoseComplete={() => {
            this.setHeightRef();
          }}
          pose={state === InputState.EXPANDED ? 'expanded' : 'default'}
        >
          <InputContainer>
            <MainSearchInput
              inputState={state}
              toggleInputState={this.toggleInputState}
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
    );
  }
}

export default withRouter(withStyles(styles)(MainSearch));
