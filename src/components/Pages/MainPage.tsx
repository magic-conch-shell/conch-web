import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  Grid,
} from '@material-ui/core';
import * as React from 'react';
import MainSearchContainer from '../MainSearch/MainSearchContainer';

export interface IMainPageProps {
  handleFinishLoading: () => void;
}

export interface IMainPageState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    height: 'calc(100% + 90px)',
    width: '100%',
    marginTop: '-90px',
    display: 'flex',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 1,
    display: 'flex',
  },
});

class MainPage extends React.Component<
  WithStyles<any> & IMainPageProps,
  IMainPageState
> {
  public componentDidMount() {
    this.props.handleFinishLoading();
  }
  public render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container={true} justify={'center'}>
          <MainSearchContainer />
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(MainPage);
