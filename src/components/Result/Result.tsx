import {
  Paper,
  StyleRulesCallback,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';

import { IQuestion } from '../../interfaces/Question';
import InputContainer from '../Input/InputContainer';

export interface IResultProps extends WithStyles<typeof styles> {
  result: IQuestion;
}

export interface IResultState {
  placeholder?: string;
}

enum ResultStatusTypes {
  NOT_SUBMITTED,
  SUBMITTED,
  ACCEPTED,
  ANSWERED,
  RESOLVED,
}

const resultStatusText: { [key in ResultStatusTypes]: string } = {
  [ResultStatusTypes.NOT_SUBMITTED]: 'Not submitted',
  [ResultStatusTypes.SUBMITTED]: 'Connecting with a Mentor',
  [ResultStatusTypes.ACCEPTED]: 'A Mentor is currently answering your question',
  [ResultStatusTypes.ANSWERED]:
    "Your question has been answered. If you are not satisfied with your answer, add a comment and select 'Resubmit'",
  [ResultStatusTypes.RESOLVED]: 'Your question has been answered.',
};

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    padding: theme.spacing.unit * 2,
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
    },
  },
});

class Result extends React.Component<IResultProps, IResultState> {
  public render() {
    const { classes, result } = this.props;
    result.status = ResultStatusTypes.SUBMITTED;
    return (
      <Paper className={classes.root} elevation={4}>
        <div className={classes.resultHeader}>
          <Typography variant="h5" style={{ fontVariant: 'small-caps' }}>
            Your Question has been submitted...
          </Typography>
          <Typography variant="caption">
            Status: {resultStatusText[result.status]}
          </Typography>
        </div>
        <div className={classes.resultContent}>
          <Typography variant="caption">
            <strong>Your Question:</strong>
          </Typography>
          {result.title && (
            <InputContainer>
              <input
                type="text"
                readOnly={true}
                value={result.title}
                className={classes.input}
              />
            </InputContainer>
          )}
          <InputContainer>
            <textarea
              readOnly={true}
              value={result.content}
              className={classes.input}
            />
          </InputContainer>
          <Typography align="right" variant="caption">
            <strong>Submitted:</strong>{' '}
            {new Date(result.created_at).toLocaleDateString()}{' '}
            {new Date(result.created_at).toLocaleTimeString()}
          </Typography>
          {/* <List>
            {Object.keys(result).map((key) => {
              const value = result[key];
              return (
                <ListItem key={key}>
                  <ListItemText primary={`${key}: ${value}`} />
                </ListItem>
              );
            })}
          </List> */}
        </div>
        {/* <div className={classes.resultAnim}>MAKE ME</div> */}
      </Paper>
    );
  }
}

export default withStyles(styles)(Result);
