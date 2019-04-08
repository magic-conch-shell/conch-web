import * as React from 'react';

import {
  Button,
  StyleRulesCallback,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import Settings from '@material-ui/icons/Settings';
import axios from 'axios';

enum MentorQueueStatus {
  NOT_IN_QUEUE,
  IN_QUEUE,
  BUSY,
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
  timeInQueue: number;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  '@keyframes spin': {
    from: { transform: 'rotate(0deg)' },
    to: { transform: 'rotate(360deg)' },
  },
  queueDefault: {
    backgroundColor: 'blue',
  },
  queueReady: {
    backgroundColor: 'green',
  },
  queueBusy: {
    backgroundColor: 'red',
  },
  pendingIcon: {
    animationName: '$spin',
  },
});

class NavBarMentorStatus extends React.Component<
  INavBarMentorStatusProps,
  INavBarMentorStatusState
> {
  public state = {
    interval: null,
    pending: false,
    queueStatus: MentorQueueStatus.NOT_IN_QUEUE,
    timeInQueue: 0,
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

  public setQueueStatus = (status: MentorQueueStatus) => {
    this.setState({ pending: true }, () => {
      axios({
        method: 'post',
        url: '/api/join_queue',
      })
        .then(() => {
          const setStatusMap: { [key in MentorQueueStatus]: () => void } = {
            [MentorQueueStatus.IN_QUEUE]: this.setToInQueue,
            [MentorQueueStatus.NOT_IN_QUEUE]: this.setToNotInQueue,
            [MentorQueueStatus.BUSY]: this.setToBusy,
          };
          setStatusMap[status]();
        })
        .catch((err: any) => console.log(err))
        .finally(() => this.setState({ pending: false }));
    });
  };

  public render() {
    const { pending, queueStatus, timeInQueue } = this.state;
    const { classes } = this.props;
    const nextStatus =
      queueStatus === MentorQueueStatus.NOT_IN_QUEUE
        ? MentorQueueStatus.IN_QUEUE
        : MentorQueueStatus.NOT_IN_QUEUE;
    return (
      <>
        <Typography variant="overline">{timeInQueue}</Typography>
        {pending ? (
          <Button className={classes.pendingBtn} disabled={true}>
            <Settings className={classes.pendingIcon} /> Working
          </Button>
        ) : (
          <Button
            onClick={() => this.setQueueStatus(nextStatus)}
            className={classes[queueButtonClass[queueStatus]]}
          >
            {queueButtonText[queueStatus]}
          </Button>
        )}
      </>
    );
  }
}

export default withStyles(styles)(NavBarMentorStatus);
