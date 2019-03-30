import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  Grid,
} from '@material-ui/core';
import * as React from 'react';
import ResultContainer from '../Result/ResultContainer';

export interface IResultPageProps extends WithStyles<typeof styles> {
  questionId: string;
}

export interface IResultPageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    height: 'calc(100% + 90px)',
    width: '100%',
    marginTop: '-90px',
    display: 'flex',
  },
});

class ResultPage extends React.Component<IResultPageProps, IResultPageState> {
  public render() {
    const { classes, questionId } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <ResultContainer questionId={questionId} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(ResultPage);
