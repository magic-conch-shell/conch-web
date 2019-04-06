import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import * as React from 'react';
// import posed from 'react-pose';
import { ITag } from '../../interfaces/Tag';

export interface IMentorContainerProps extends WithStyles<typeof styles> {
  tags: ITag[];
}

export interface IMentorContainerState {
  placeholder?: string;
}

// const TRANSITION_DURATION = 350;

// const OpacityContainer = posed.div({
//   hidden: { opacity: 0, transition: { duration: TRANSITION_DURATION } },
//   visible: { opacity: 1, transition: { duration: TRANSITION_DURATION } },
// });

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
});

class MentorContainer extends React.Component<
  IMentorContainerProps,
  IMentorContainerState
> {
  public render() {
    const { classes } = this.props;
    return <div className={classes.root} />;
  }
}

export default withStyles(styles)(MentorContainer);
