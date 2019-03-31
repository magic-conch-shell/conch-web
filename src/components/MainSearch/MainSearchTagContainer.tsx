import * as React from 'react';

import {
  Chip,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import Clear from '@material-ui/icons/Clear';

export interface IMainSearchTagContainerProps
  extends WithStyles<typeof styles> {
  handleDeleteTag: (tagId: number) => void;
  selectedTags: number[];
  tags: Array<{ id: number; name: string }>;
}

export interface IMainSearchTagContainerState {
  placeholder?: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  selectedTagsContainer: {
    marginTop: theme.spacing.unit,
    zIndex: -1,
  },
  selectedTag: {
    backgroundColor: theme.palette.background.default,
    borderColor: theme.palette.primary.main,
    borderWidth: '1px',
    borderStyle: 'solid',
    marginRight: theme.spacing.unit / 2,
    marginBottom: theme.spacing.unit / 2,
  },
  deleteIcon: {
    color: theme.palette.primary.main,
  },
});

class MainSearchTagContainer extends React.Component<
  IMainSearchTagContainerProps,
  IMainSearchTagContainerState
> {
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
  public handleDelete = (sid: number) => {
    this.props.handleDeleteTag(sid);
  };
  public render() {
    const { classes, selectedTags } = this.props;
    return (
      <div className={classes.selectedTagsContainer}>
        {selectedTags.map((sid) => (
          <Chip
            key={sid}
            className={classes.selectedTag}
            label={this.getTagById(sid).name}
            onDelete={() => this.handleDelete(sid)}
            deleteIcon={<Clear className={classes.deleteIcon} />}
          />
        ))}
      </div>
    );
  }
}

export default withStyles(styles)(MainSearchTagContainer);
