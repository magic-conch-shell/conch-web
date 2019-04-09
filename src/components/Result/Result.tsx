import * as React from 'react';

import {
  Chip,
  IconButton,
  Paper,
  StyleRulesCallback,
  Theme,
  Tooltip,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { IQuestion, ResultStatusTypes } from '../../interfaces/Question';

import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import { IAnswer } from '../../interfaces/Answer';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import InputContainer from '../Input/InputContainer';
import Send from '@material-ui/icons/Send';
import TextareaAutosize from 'react-textarea-autosize';
import axios from 'axios';
import { lighten } from '@material-ui/core/styles/colorManipulator';

export interface IResultProps extends WithStyles<typeof styles> {
  answers: IAnswer[];
  user: IUser;
  result: IQuestion;
  tags: ITag[];
  updateQuestionAnswer: (answer: IAnswer) => void;
}

export interface IResultState {
  answerText: string;
}

const resultStatusText: { [key in ResultStatusTypes]: string } = {
  'NOT_SUBMITTED': 'Not submitted',
  'SUBMITTED': 'Connecting with a Mentor',
  'ACCEPTED': 'A Mentor is currently answering your question',
  'ANSWERED':
    "Your question has been answered. If you are not satisfied with your answer, add a comment and select 'Resubmit'",
  'RESOLVED': 'Your question has been answered.',
};

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  answerActionsContainer: {
    display: 'flex',
    width: '100%'
  },
  answerActions: {
    marginLeft: 'auto'
  },
  chip: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: theme.palette.primary.main,
    borderWidth: '1px',
    borderStyle: 'solid',
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  root: {
    padding: theme.spacing.unit * 2,
    marginTop: 'auto',
    marginBottom: 'auto',
    width: '100%',
  },
  resultHeader: {
    textAlign: 'center',
    marginBottom: theme.spacing.unit * 2,
  },
  resultContent: {
    padding: theme.spacing.unit * 2,
  },
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
    }
  },
  rejectAction: {
    color: '#dc3545',
    '&:hover': {
      backgroundColor: lighten('#dc3545', 0.75)
    }
  },
  answerAccepted: {
    color: 'green'
  },
  answerRejected: {
    color: '#dc3545'
  }
});

class Result extends React.Component<IResultProps, IResultState> {
  public state = {
    answerText: ''
  };

  public getTagById = (id: number) => {
    const { tags } = this.props;
    const len = tags.length;
    let result = {} as { id: number; name: string };
    for (let i = 0; i < len; i += 1) {
      if (tags[i].id === id) {
        result = tags[i];
        break;
      }
    }
    return result;
  };

  public _handleAnswerChange = (ev: any) => {
    this.setState({ answerText: ev.target.value });
  };

  public _handleSubmit = () => {
    if (this.submitIsDisabled()) {
      return;
    } else {
      const { answerText } = this.state;
      const { result } = this.props;
      axios({
        method: 'post',
        url: `/api/questions/${result.id}/answers`,
        params: {
          content: answerText
        }
      })
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    }
  }

  public _handleAcceptAnswer = (aid: number) => {
    const { updateQuestionAnswer } = this.props;
    axios({
      method: 'put',
      url: `/api/answers/${aid}`,
      params: {
        selected: true
      }
    })
      .then((result) => {
        const { data } = result;
        updateQuestionAnswer(data);
      })
      .catch((err) => console.log(err));
  }

  public _handleRejectAnswer = (aid: number) => {
    const { updateQuestionAnswer } = this.props;
    axios({
      method: 'put',
      url: `/api/answers/${aid}`,
      params: {
        selected: false
      }
    })
      .then((result) => {
        const { data } = result;
        updateQuestionAnswer(data);
      })
      .catch((err) => console.log(err));
  }

  public submitIsDisabled = () => {
    const { answerText } = this.state;
    const { result } = this.props;

    if (answerText.length === 0) { return true; }
    if (result.question_status.status !== ResultStatusTypes.ACCEPTED) { return true; }

    return false;
  }

  public render() {
    const { answerText } = this.state;
    const { answers, classes, user, result } = this.props;
    return (
      <Paper className={classes.root} elevation={4}>
        {(user.is_mentor && result.question_status.mentor_id === user.id) ? (
          <>
            <div className={classes.resultContent}>
              <Typography variant="caption">
                <strong>Question:</strong>
              </Typography>
              {result.title && (
                <InputContainer>
                  <textarea
                    readOnly={true}
                    value={result.title}
                    className={classes.input}
                  />
                </InputContainer>
              )}
              <InputContainer>
                <TextareaAutosize
                  readOnly={true}
                  value={result.content}
                  className={classes.input}
                />
              </InputContainer>
              {result.tags.map((tag) => {
                return (
                  <Chip
                    key={tag}
                    className={classes.chip}
                    label={this.getTagById(tag).name}
                  />
                );
              })}
              <Typography align="right" variant="caption">
                <strong>Submitted:</strong>{' '}
                {new Date(result.created_at).toLocaleDateString()}{' '}
                {new Date(result.created_at).toLocaleTimeString()}
              </Typography>
            </div>
            {answers.length > 0 &&
              <div className={classes.resultContent}>
                <Typography variant='caption'>
                  <strong>Previous Answers:</strong>
                </Typography>
                {answers.map((ans, index) => (
                  <InputContainer key={index}>
                    <TextareaAutosize
                      readOnly={true}
                      value={ans.content}
                      className={classes.input}
                    />
                  </InputContainer>
                ))}
              </div>
            }
            <div className={classes.resultContent}>
              <Typography variant='caption'>
                <strong>Your Answer:</strong>
              </Typography>
              <InputContainer>
                <TextareaAutosize
                  className={classes.input}
                  name='answer'
                  placeholder='Enter Answer'
                  autoFocus={true}
                  required={true}
                  value={answerText}
                  onChange={this._handleAnswerChange}
                />
                <Tooltip title='Submit Answer' placement='right'>
                  <IconButton
                    className={classes.inputIcon}
                    onClick={this._handleSubmit}
                    disabled={this.submitIsDisabled()}
                    tabIndex={-1}
                  >
                    <Send />
                  </IconButton>
                </Tooltip>
              </InputContainer>
            </div>
          </>
        ) : (
            <>
              <div className={classes.resultHeader}>
                <Typography variant="h5" style={{ fontVariant: 'small-caps' }}>
                  Your Question has been submitted...
              </Typography>
                <Typography variant="caption">
                  Status: {resultStatusText[result.question_status.status]}
                </Typography>
              </div>
              <div className={classes.resultContent}>
                <Typography variant="caption">
                  <strong>Your Question:</strong>
                </Typography>
                {result.title && (
                  <InputContainer>
                    <textarea
                      readOnly={true}
                      value={result.title}
                      className={classes.input}
                    />
                  </InputContainer>
                )}
                <InputContainer>
                  <TextareaAutosize
                    readOnly={true}
                    value={result.content}
                    className={classes.input}
                  />
                </InputContainer>
                {result.tags.map((tag) => {
                  return (
                    <Chip
                      key={tag}
                      className={classes.chip}
                      label={this.getTagById(tag).name}
                    />
                  );
                })}
                <Typography align="right" variant="caption">
                  <strong>Submitted:</strong>{' '}
                  {new Date(result.created_at).toLocaleDateString()}{' '}
                  {new Date(result.created_at).toLocaleTimeString()}
                </Typography>
              </div>
              {answers.length > 0 && !user.is_mentor &&
                <div className={classes.resultContent}>
                  <Typography variant='caption'>
                    <strong>Answers:</strong>
                  </Typography>
                  {answers.map((ans, index) => {
                    return (
                      <div key={index} className={classes.answer}>
                        <InputContainer>
                          <TextareaAutosize
                            readOnly={true}
                            value={ans.content}
                            className={classes.input}
                          />
                        </InputContainer>
                        <div className={classes.answerActionsContainer}>
                          {index === 0 ? (
                            ans.selected === false ? (
                              <div className={classes.answerActions}>
                                <Tooltip title='Accept Answer'>
                                  <IconButton color='primary' onClick={() => this._handleAcceptAnswer(ans.id)}>
                                    <Check />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title='Reject Answer' onClick={() => this._handleRejectAnswer(ans.id)}>
                                  <IconButton className={classes.rejectAction}>
                                    <Close />
                                  </IconButton>
                                </Tooltip>
                              </div>
                            ) : (
                                <Typography variant='caption' className={classes.answerAccepted}><strong>Status: Accepted</strong></Typography>
                              )
                          ) : (
                              <Typography variant='caption' className={classes.answerRejected}><strong>Status: Rejected</strong></Typography>
                            )}

                        </div>
                        {index !== answers.length - 1 && <hr />}
                      </div>
                    )
                  })}
                </div>
              }
            </>
          )}
      </Paper>
    )
  }
}

export default withStyles(styles)(Result);
