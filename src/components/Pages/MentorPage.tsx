import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  Grid,
} from '@material-ui/core';
import * as React from 'react';
import { ITag } from '../../interfaces/Tag';
import MentorContainer from '../Mentor/MentorContainer';

export interface IMentorPageProps extends WithStyles<typeof styles> {
  tags: ITag[];
}

export interface IMentorPageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
    display: 'flex',
    marginTop: '-45px',
  },
});

class MentorPage extends React.Component<IMentorPageProps, IMentorPageState> {
  public render() {
    const { classes, tags } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <MentorContainer tags={tags} />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MentorPage);
