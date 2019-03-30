import {
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import * as React from 'react';
import { IResult } from './ResultContainer';

export interface IResultProps extends WithStyles<typeof styles> {
  result: IResult;
}

export interface IResultState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    height: '100%',
    width: '100%',
  },
});

class Result extends React.Component<IResultProps, IResultState> {
  public render() {
    const { classes, result } = this.props;
    return (
      <Paper className={classes.root}>
        <List>
          {Object.keys(result).map((key) => {
            const value = result[key];
            return (
              <ListItem key={key}>
                <ListItemText primary={`${key}: ${value}`} />
              </ListItem>
            );
          })}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles)(Result);
