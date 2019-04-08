import * as React from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  StyleRulesCallback,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import InputContainer from '../Input/InputContainer';
import MainSearchSelect from '../MainSearch/MainSearchSelect';
import MainSearchTagContainer from '../MainSearch/MainSearchTagContainer';
import axios from 'axios';

export interface IMentorRegistrationProps extends WithStyles<typeof styles> {
  closeDialog: () => void;
  editUser: (user: IUser) => void;
  open: boolean;
  tags: ITag[];
  user: IUser;
}

export interface IMentorRegistrationState {
  selectedTags: number[];
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  paper: {
    transition: 'all 1s ease-out'
  },
  submitButton: {
    borderRadius: 0,
  },
});

class MentorRegistration extends React.Component<
  IMentorRegistrationProps,
  IMentorRegistrationState
  > {
  public state = {
    selectedTags: [] as number[],
  };

  public handleSubmit = (ev?: any) => {
    const { closeDialog, editUser, user } = this.props;
    if (ev) {
      ev.preventDefault();
    }
    const { selectedTags } = this.state;
    if (selectedTags.length > 0) {
      axios({
        method: 'put',
        url: `/api/users/${user.id}`,
        params: {
          is_mentor: true
        }
      })
        .then((result) => {
          axios({
            method: 'post',
            url: '/api/user_tags',
            params: {
              tags: selectedTags,
            },
          })
            .then((r) => {
              const newUser = { ...user };
              newUser.is_mentor = true;
              newUser.tags = selectedTags;
              editUser(newUser);
              closeDialog();
            })
            .catch((e) => console.log(e));
        })
        .catch(err => console.log(err));
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
        className={classes.dialog}
        maxWidth={'sm'}
        classes={{
          paper: classes.paper
        }}
      >
        <DialogTitle>Register as a Mentor</DialogTitle>
        <DialogContent>
          <DialogContentText>
            By becoming a Mentor and setting your areas of expertise, you will be able to be join a queue where you will be selected to
            answer questions, earning money per question answered.
          </DialogContentText>
          <br />
          <DialogContentText>
            Please note that the quality of your answers are important.
            Not everyone is suited to be a Mentor.
            Please only select areas are you an expert in.
          </DialogContentText>
          <br />
          <Typography variant='subtitle1'>Select Area of Expertise:</Typography>
          <div style={{ height: '50px' }}>
            <InputContainer>
              <MainSearchSelect
                handleSelectTag={this.handleSelectTag}
                selectedTags={selectedTags}
                tags={tags}
              />
            </InputContainer>
          </div>
          <br />
          {selectedTags.length > 0 &&
            <>
              <Typography variant='subtitle1'>Your Areas of Expertise:</Typography>
              <MainSearchTagContainer
                handleDeleteTag={this.handleDeleteTag}
                selectedTags={selectedTags}
                tags={tags}
              />
            </>
          }
        </DialogContent>
        <Button
          onClick={this.handleSubmit}
          disabled={selectedTags.length === 0}
          fullWidth={true}
          size='large'
          variant='contained'
          color='primary'
        >Become a Mentor</Button>
      </Dialog>
    );
  }
}

export default withStyles(styles)(MentorRegistration);
