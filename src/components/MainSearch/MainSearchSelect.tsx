import {
  Paper,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import Downshift from 'downshift';
import * as React from 'react';
import classnames from 'classnames';

export interface IMainSearchSelectProps {
  handleSelectTag: (tagId: number) => void;
  selectedTags: number[];
  tags: Array<{ id: number; name: string }>;
}

export interface IMainSearchSelectState {
  selectValue: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  container: {
    width: 'calc(100% - 12px)',
    zIndex: 1,
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.palette.text.primary,
    wordWrap: 'break-word',
    outline: 'none',
    width: '100%',
    fontFamily: 'monospace',
    paddingTop: '16.5px',
    paddingBottom: '16.5px',
    '&::placeholder': {
      opacity: 0.65,
      color: theme.palette.text.primary,
    },
  },
  listItem: {
    backgroundColor: 'transparent',
    color: theme.palette.text.primary,
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 2,
    display: 'block',
    cursor: 'pointer',
  },
  selectedTagsContainer: {
    marginTop: '8px',
  },
  paper: {
    maxHeight: '300px',
    overflowY: 'scroll',
  },
  highlighted: {
    backgroundColor: theme.palette.background.default,
  },
});

class MainSearchSelect extends React.Component<
  WithStyles<any> & IMainSearchSelectProps,
  IMainSearchSelectState
> {
  public state = {
    selectValue: '',
  };

  public handleSelectChange = (item: { id: number; name: string }) => {
    this.props.handleSelectTag(item.id);
    this.setState({
      selectValue: '',
    });
  };

  public handleSelectValueChange = (ev: any) => {
    this.setState({ selectValue: ev.target.value });
  };

  public render() {
    const { classes, selectedTags, tags } = this.props;
    return (
      <>
        <Downshift
          id="downshift-select"
          onChange={this.handleSelectChange}
          itemToString={(item) => (item ? item.name : '')}
        >
          {({
            getInputProps,
            getItemProps,
            getMenuProps,
            highlightedIndex,
            inputValue,
            isOpen,
            selectedItem,
            clearSelection,
          }) => {
            const inputValueLower =
              inputValue && inputValue.toLocaleLowerCase();
            return (
              <div className={classes.container}>
                <input
                  className={classes.input}
                  {...getInputProps()}
                  placeholder="Add a category"
                />
                <div {...getMenuProps()}>
                  {isOpen && (
                    <Paper className={classes.paper} elevation={4}>
                      {tags
                        .filter((tag) => !selectedTags.includes(tag.id))
                        .filter((tag) => {
                          const { name } = tag;
                          const nameLower = name.toLocaleLowerCase();
                          const result =
                            !inputValueLower ||
                            nameLower.includes(inputValueLower);
                          return result;
                        })
                        .slice(0, 30)
                        .map((t, index) => {
                          const { id, name } = t;
                          return (
                            <li
                              {...getItemProps({
                                item: {
                                  id,
                                  name,
                                },
                              })}
                              className={classnames(
                                classes.listItem,
                                highlightedIndex === index &&
                                  classes.highlighted
                              )}
                              key={id}
                              value={name}
                              tabIndex={0}
                            >
                              {t.name}
                            </li>
                          );
                        })}
                    </Paper>
                  )}
                </div>
              </div>
            );
          }}
        </Downshift>
      </>
    );
  }
}

export default withStyles(styles)(MainSearchSelect);
