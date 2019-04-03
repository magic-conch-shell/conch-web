import * as React from 'react';

import {
  List,
  ListItem,
  ListItemText,
  Paper,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

import classnames from 'classnames';

export interface IProfileTabListProps extends WithStyles<typeof styles> {
  currentTab: number;
  handleClick: (index: number) => void;
  tabs: string[];
}

export interface IProfileTabListState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  listItem: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
    borderLeftWidth: theme.spacing.unit / 2,
    borderLeftColor: 'rgba(0,0,0,0)',
    borderLeftStyle: 'solid',
    cursor: 'pointer',
  },
  listItemHoverable: {
    '&:hover': {
      backgroundColor: darken(theme.palette.background.paper, 0.1),
    },
  },
  profileTabList: {
    paddingTop: '0px',
    paddingBottom: '0px',
  },
  root: {
    position: 'sticky',
    top: '110px',
  },
  selected: {
    backgroundColor:
      theme.palette.type === 'light'
        ? lighten(theme.palette.primary.main, 0.75)
        : darken(theme.palette.primary.main, 0.75),
    borderLeftColor: theme.palette.primary.main,
  },
});

class ProfileTabList extends React.Component<
  IProfileTabListProps,
  IProfileTabListState
> {
  public render() {
    const { classes, currentTab, handleClick, tabs } = this.props;
    return (
      <Paper className={classes.root} elevation={4}>
        <List className={classes.profileTabList}>
          {tabs.map((tab, index) => (
            <ListItem
              key={index}
              onClick={() => handleClick(index)}
              className={classnames(
                currentTab === index
                  ? classes.selected
                  : classes.listItemHoverable,
                classes.listItem
              )}
            >
              <ListItemText primary={tab} />
            </ListItem>
          ))}
        </List>
      </Paper>
    );
  }
}

export default withStyles(styles)(ProfileTabList);
