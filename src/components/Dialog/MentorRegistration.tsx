import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  DialogContent,
  Dialog,
} from '@material-ui/core';
import * as React from 'react';
import InputContainer from '../Input/InputContainer';
import MainSearchSelect from '../MainSearch/MainSearchSelect';
import { ITag } from '../../interfaces/Tag';
import axios from 'axios';
import MainSearchTagContainer from '../MainSearch/MainSearchTagContainer';

export interface IMentorRegistrationProps extends WithStyles<typeof styles> {
  closeDialog: () => void;
  open: boolean;
  tags: ITag[];
}

export interface IMentorRegistrationState {
  selectedTags: number[];
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class MentorRegistration extends React.Component<
  IMentorRegistrationProps,
  IMentorRegistrationState
> {
  public state = {
    selectedTags: [] as number[],
  };

  public handleSubmit = (ev?: any) => {
    const { closeDialog } = this.props;
    if (ev) {
      ev.preventDefault();
    }
    const { selectedTags } = this.state;
    if (selectedTags.length > 0) {
      axios({
        method: 'post',
        url: '/api/user_tags',
        params: {
          tags: selectedTags,
        },
      })
        .then((result) => {
          closeDialog();
        })
        .catch((err) => console.log(err));
    } else {
      alert('Fill in the form! Replace me with actual error text in the form!');
    }
  };

  public handleSelectTag = (tagId: number) => {
    this.setState({
      selectedTags: [...this.state.selectedTags, tagId],
    });
  };
  public handleDeleteTag = (sid: number) => {
    const selectedTags = [...this.state.selectedTags];
    selectedTags.splice(selectedTags.indexOf(sid), 1);
    this.setState({ selectedTags });
  };

  public render() {
    const { selectedTags } = this.state;
    const { classes, open, closeDialog, tags } = this.props;
    return (
      <Dialog
        open={open}
        onClose={closeDialog}
        fullWidth={true}
        maxWidth={'xs'}
      >
        <DialogContent>
          <form
            className={classes.mentorRegistrationForm}
            onSubmit={this.handleSubmit}
          >
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
              handleDeleteTag={this.handleDeleteTag}
              selectedTags={selectedTags}
              tags={tags}
            />
          </form>
        </DialogContent>
      </Dialog>
    );
  }
}

export default withStyles(styles)(MentorRegistration);
