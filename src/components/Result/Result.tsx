import * as React from 'react';

import {
  Chip,
  Paper,
  StyleRulesCallback,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { IQuestion } from '../../interfaces/Question';
import { ITag } from '../../interfaces/Tag';
import InputContainer from '../Input/InputContainer';

export interface IResultProps extends WithStyles<typeof styles> {
  result: IQuestion;
  tags: ITag[];
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
});

class Result extends React.Component<IResultProps, IResultState> {
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

  public render() {
    const { classes, result } = this.props;
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
        {/* <div className={classes.resultAnim}>MAKE ME</div> */}
      </Paper>
    );
  }
}

export default withStyles(styles)(Result);
