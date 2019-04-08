import * as React from 'react';

import { Button, Grid, StyleRulesCallback, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';

import AnswerList from '../../List/AnswerList';
import { IAnswer } from '../../../interfaces/Answer';
import { IQuestion } from '../../../interfaces/Question';
import { ITag } from '../../../interfaces/Tag';
import { IUser } from '../../../interfaces/User';
import InputContainer from '../../Input/InputContainer';
import MainSearchSelect from '../../MainSearch/MainSearchSelect';
import MainSearchTagContainer from '../../MainSearch/MainSearchTagContainer';
import axios from 'axios';
import { getAnswersByUserId } from '../../../api';

export interface IMentorPanelProps extends WithStyles<typeof styles> {
  answers: IAnswer[];
  setAnswers: (answers: IAnswer[]) => void;
  handleFinishLoading: () => void;
  editUser: (user: IUser) => void;
  user: IUser;
  tags: ITag[];
}

export interface IMentorPanelState {
  questions: IQuestion[];
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class MentorPanel extends React.Component<IMentorPanelProps, IMentorPanelState> {
  public state = {
    questions: [] as IQuestion[]
  };

  public _handleDeleteTag = (tagId: number) => {
    const { editUser, user } = this.props;
    const { tags } = user;
    if (tags) {
      const newTags = tags.filter(t => t !== tagId);
      axios({
        method: 'delete',
        url: `/api/user_tags/${tagId}`
      })
        .then((result) => {
          const newUser = { ...user };
          newUser.tags = newTags;
          editUser(newUser);
        })
        .catch((err) => console.log(err));
    }
  }

  public _handleSelectTag = (tagId: number) => {
    const { editUser, user } = this.props;
    const { tags } = user;
    if (tags) {
      axios({
        method: 'post',
        url: '/api/user_tags',
        params: {
          tags: [tagId],
        },
      })
        .then((r) => {
          const newUser = { ...user };
          newUser.is_mentor = true;
          newUser.tags = [...user.tags, tagId];
          editUser(newUser);
        })
        .catch((e) => console.log(e));
    }
  }

  public toggleMentorStatus = () => {
    const { editUser, user } = this.props;
    axios({
      method: 'put',
      url: `/api/users/${user.id}`,
      params: {
        is_mentor: false
      }
    })
      .then((result) => {
        const newUser = { ...user };
        newUser.is_mentor = false;
        editUser(newUser);
      })
      .catch((err) => console.log(err));
  };

  public refreshAnswers = () => {
    const { setAnswers, user } = this.props;
    getAnswersByUserId(user.id, (answers) => {
      setAnswers(answers);
    });
  }

  public render() {
    const { answers, user, tags } = this.props;
    return (
      <Grid container={true} spacing={8}>
        <Grid item={true} xs={4}>
          <Button disabled={!user.is_mentor} onClick={this.toggleMentorStatus}>Stop Being a Mentor (TESTING)</Button>
          <Typography variant='subtitle1'>Add New Categories</Typography>
          <div style={{ height: '50px' }}>
            <InputContainer>
              <MainSearchSelect
                handleSelectTag={(tagId: number) => {
                  this._handleSelectTag(tagId);
                }}
                selectedTags={user.tags}
                tags={tags}
              />
            </InputContainer>
          </div>
          <MainSearchTagContainer
            handleDeleteTag={(tagId: number) => {
              this._handleDeleteTag(tagId);
            }}
            selectedTags={user.tags}
            tags={tags}
          />
        </Grid>
        <Grid item={true} xs={8}>
          <AnswerList answers={answers} />
        </Grid>
      </Grid >
    );
  }
}

export default withStyles(styles)(MentorPanel);
