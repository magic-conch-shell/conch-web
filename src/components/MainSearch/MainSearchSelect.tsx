import {
  Paper,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import Downshift from 'downshift';
import * as React from 'react';

export interface IMainSearchSelectProps {
  handleSelectTag: (tagId: number) => void;
  selectedTags: number[];
  tags: Array<{ id: number; label: string }>;
}

export interface IMainSearchSelectState {
  selectValue: string;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {},
  container: {
    width: 'calc(100% - 12px)',
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
  selectedTagsContainer: {
    marginTop: '8px',
  },
});

class MainSearchSelect extends React.Component<
  WithStyles<any> & IMainSearchSelectProps,
  IMainSearchSelectState
> {
  public state = {
    selectValue: '',
  };

  public handleSelectChange = (item: { id: number; label: string }) => {
    this.props.handleSelectTag(item.id);
    this.setState({
      selectValue: '',
    });
  };

  public render() {
    const { classes, selectedTags, tags } = this.props;
    return (
      <>
        <Downshift
          id="downshift-select"
          onChange={this.handleSelectChange}
          itemToString={(item) => (item ? item.label : '')}
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
                          const { label } = tag;
                          const labelLower = label.toLocaleLowerCase();
                          const result =
                            !inputValueLower ||
                            labelLower.includes(inputValueLower);
                          return result;
                        })
                        .map((t) => {
                          const { id, label } = t;
                          return (
                            <li
                              {...getItemProps({
                                item: {
                                  id,
                                  label,
                                },
                              })}
                              component="div"
                              key={id}
                              value={label}
                            >
                              {t.label}
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
