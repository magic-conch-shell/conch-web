import * as React from 'react';

import {
  Button,
  StyleRulesCallback,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { RouteComponentProps, withRouter } from 'react-router';

import Settings from '@material-ui/icons/Settings';
import axios from 'axios';

enum MentorQueueStatus {
  NOT_IN_QUEUE = 'NOT_IN_QUEUE',
  IN_QUEUE = 'IN_QUEUE',
  BUSY = 'BUSY',
}

const queueButtonText: { [key in MentorQueueStatus]: string } = {
  [MentorQueueStatus.NOT_IN_QUEUE]: 'Join Question Queue',
  [MentorQueueStatus.IN_QUEUE]: 'Leave Queue',
  [MentorQueueStatus.BUSY]: 'Question in Progress',
};

const queueButtonClass: { [key in MentorQueueStatus]: string } = {
  [MentorQueueStatus.NOT_IN_QUEUE]: 'queueDefault',
  [MentorQueueStatus.IN_QUEUE]: 'queueReady',
  [MentorQueueStatus.BUSY]: 'queueBusy',
};

export interface INavBarMentorStatusProps extends WithStyles<typeof styles> {
  placeholder?: string;
}

export interface INavBarMentorStatusState {
  interval: NodeJS.Timeout | null;
  pending: boolean;
  queueStatus: MentorQueueStatus;
  questionId: number | null;
  timeInQueue: number;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  queueDefault: {
    color: theme.palette.primary.main,
    borderColor: theme.palette.primary.main,
  },
  queueReady: {
    color: theme.palette.text.primary,
    borderColor: theme.palette.text.primary,
  },
  queueBusy: {
    color: 'red',
    borderColor: 'red',
  },
  pendingIcon: {
    animationName: '$spin',
  },
  timeInQueue: {
    display: 'flex',
    flexWrap: 'wrap',
    textAlign: 'right',
    marginRight: theme.spacing.unit * 2,
  },
  queueTimer: {
    fontSize: '1em',
    width: '100%',
  },
  queueLabel: {
    fontSize: '0.75em',
    width: '100%',
  },
});

class NavBarMentorStatus extends React.Component<
  RouteComponentProps<any> & INavBarMentorStatusProps,
  INavBarMentorStatusState
> {
  public state = {
    interval: null,
    pending: false,
    queueStatus: MentorQueueStatus.NOT_IN_QUEUE,
    questionId: null,
    timeInQueue: 0,
  };

  public componentDidMount() {
    const queryStatus = () => {
      axios({
        method: 'get',
        url: '/api/join_queue',
      })
        .then((result) => {
          const { data } = result;
          const { question_id, status } = data;
          if (status !== this.state.queueStatus) {
            if (status === MentorQueueStatus.BUSY) {
              this.setState({ questionId: question_id }, () =>
                this.setStatus(status)
              );
            } else {
              this.setStatus(status);
            }
          }
        })
        .catch((err) => console.log(err));
    };
    queryStatus();
    setInterval(() => queryStatus(), 1500);
  }

  public setStatus = (status: MentorQueueStatus) => {
    if (status === 'IN_QUEUE') {
      this.setToInQueue();
    } else if (status === 'NOT_IN_QUEUE') {
      this.setToNotInQueue();
    } else {
      this.setToBusy();
    }
  };

  public startTimer = () => {
    const interval = setInterval(
      () =>
        this.setState((prevState) => ({
          timeInQueue: prevState.timeInQueue + 1,
        })),
      1000
    );
    this.setState({ interval });
  };

  public stopAndClearTimer = () => {
    const { interval } = this.state;

    if (interval) {
      clearInterval(interval);
      this.setState({ timeInQueue: 0 });
    }
  };

  public setToInQueue = () => {
    this.setState({ queueStatus: MentorQueueStatus.IN_QUEUE }, () =>
      this.startTimer()
    );
  };

  public setToNotInQueue = () => {
    this.setState({ queueStatus: MentorQueueStatus.NOT_IN_QUEUE }, () =>
      this.stopAndClearTimer()
    );
  };

  public setToBusy = () => {
    this.setState({ queueStatus: MentorQueueStatus.BUSY }, () =>
      this.stopAndClearTimer()
    );
  };

  public toggleQueueStatus = () => {
    const { queueStatus, questionId } = this.state;
    const { history } = this.props;
    if (queueStatus === MentorQueueStatus.BUSY) {
      history.push(`/results/${questionId}`);
    } else {
      this.setState({ pending: true }, () => {
        axios({
          method: 'post',
          url: '/api/join_queue',
        })
          .then((result) => {
            const { data } = result;
            const { question_id, status } = data;
            if (status === MentorQueueStatus.BUSY) {
              this.setState({ questionId: question_id }, () =>
                this.setStatus(status)
              );
            } else {
              this.setStatus(status);
            }
          })
          .catch((err: any) => console.log(err))
          .finally(() => this.setState({ pending: false }));
      });
    }
  };

  public render() {
    const { pending, queueStatus, timeInQueue } = this.state;
    const { classes } = this.props;
    return (
      <>
        {queueStatus !== MentorQueueStatus.NOT_IN_QUEUE && (
          <div className={classes.timeInQueue}>
            <Typography className={classes.queueLabel} variant="caption">
              Time in Queue:
            </Typography>
            <Typography className={classes.queueTimer}>
              {timeInQueue}
            </Typography>
          </div>
        )}
        {pending ? (
          <Button className={classes.pendingBtn} disabled={true}>
            <Settings className={classes.pendingIcon} /> Working
          </Button>
        ) : (
          <Button
            onClick={this.toggleQueueStatus}
            className={classes[queueButtonClass[queueStatus]]}
            variant="outlined"
          >
            {queueButtonText[queueStatus]}
          </Button>
        )}
      </>
    );
  }
}

export default withRouter(withStyles(styles)(NavBarMentorStatus));
