import {
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  InputLabel,
  Paper,
  StyleRulesCallback,
  Theme,
  WithStyles,
  withStyles,
  FormHelperText,
} from '@material-ui/core';
import classnames from 'classnames';
import Downshift from 'downshift';
import moment from 'moment-timezone';
import * as React from 'react';

import { ISettings } from '../../../interfaces/Settings';
import { IUser } from '../../../interfaces/User';
import { ThemeTypes } from '../../../themes/mainTheme';

export interface ISettingsProps extends WithStyles<typeof styles> {
  editUser: (user: IUser) => void;
  handleFinishLoading: () => void;
  setTimeZone: (timeZone: string) => void;
  toggleTheme: () => void;
  user: IUser;
  userSettings: ISettings;
}

export interface ISettingsState {
  [index: string]: string;
  nicknameText: string;
  passwordText: string;
  passwordConfirmText: string;
  passwordErrorText: string;
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
    position: 'absolute',
    zIndex: 99,
  },
  highlighted: {
    backgroundColor: theme.palette.background.default,
  },
});

const TIMEZONES = moment.tz.names();

class Settings extends React.Component<ISettingsProps, ISettingsState> {
  public state = {
    nicknameText: this.props.user.nickname,
    passwordText: '',
    passwordConfirmText: '',
    passwordErrorText: '',
  };

  public componentDidMount() {
    const { handleFinishLoading } = this.props;
    setTimeout(() => handleFinishLoading(), 1000);
  }

  public handleSelectChange = (tz: string) => {
    this.props.setTimeZone(tz);
  };

  public handleTextChange = (ev: any) => {
    console.log(ev.target);
    this.setState({ [ev.target.id as string]: ev.target.value });
  };

  public _changeNickname = (ev: any) => {
    if (ev) {
      ev.preventDefault();
    }
    const { nicknameText } = this.state;
    const { editUser, user } = this.props;
    const newUser = { ...user };
    newUser.nickname = nicknameText;
    editUser(newUser);
  };

  public _changePassword = (ev: any) => {
    if (ev) {
      ev.preventDefault();
    }
    const { passwordText, passwordConfirmText } = this.state;
    // const { editUser, user } = this.props;
    if (passwordText !== passwordConfirmText) {
      this.setState({ passwordErrorText: 'Your passwords do not match!' });
    } else {
      // post request to change pw
    }
  };

  public render() {
    const {
      nicknameText,
      passwordText,
      passwordConfirmText,
      passwordErrorText,
    } = this.state;
    const { classes, toggleTheme, userSettings } = this.props;
    return (
      <Grid container={true} spacing={24} className={classes.root}>
        <Grid item={true} xs={6}>
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                onChange={toggleTheme}
                checked={userSettings.themeType === ThemeTypes.DARK}
              />
            }
            label="Dark Mode"
          />
        </Grid>
        <Grid item={true} xs={6}>
          <label id="select-timezone-label">Timezone</label>
          <Downshift
            id="downshift-select-timezone"
            onChange={this.handleSelectChange}
            initialInputValue={userSettings.timeZone}
            labelId="select-timezone-label"
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
                    placeholder="Select timezone"
                  />
                  <div {...getMenuProps()}>
                    {isOpen && (
                      <Paper className={classes.paper} elevation={4}>
                        {TIMEZONES.filter((timezone) => {
                          const timezoneLower = timezone.toLocaleLowerCase();
                          const result =
                            !inputValueLower ||
                            timezoneLower.includes(inputValueLower);
                          return result;
                        })
                          .slice(0, 30)
                          .map((tz, index) => {
                            return (
                              <li
                                {...getItemProps({ item: tz })}
                                className={classnames(
                                  classes.listItem,
                                  highlightedIndex === index &&
                                    classes.highlighted
                                )}
                                key={`${tz}-${index}`}
                                value={tz}
                                tabIndex={0}
                              >
                                {tz}
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
        </Grid>
        <Grid item={true} xs={6}>
          <form onSubmit={this._changeNickname}>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="nicknameText">Change Nickname</InputLabel>
              <Input
                id="nicknameText"
                value={nicknameText}
                type="text"
                onChange={this.handleTextChange}
              />
            </FormControl>
            <button type="submit" style={{ display: 'none' }} />
          </form>
        </Grid>
        <Grid item={true} xs={6}>
          <form
            style={{ display: 'flex', flexWrap: 'wrap' }}
            onSubmit={this._changePassword}
          >
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="passwordText">Change Password</InputLabel>
              <Input
                id="passwordText"
                value={passwordText}
                type="password"
                onChange={this.handleTextChange}
                error={passwordErrorText.length > 0}
              />
              <FormHelperText id="passwordError">
                {passwordErrorText}
              </FormHelperText>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="passwordConfirmText">
                Confirm Password
              </InputLabel>
              <Input
                id="passwordConfirmText"
                value={passwordConfirmText}
                type="password"
                onChange={this.handleTextChange}
                error={passwordErrorText.length > 0}
              />
              <FormHelperText id="passwordConfirmError">
                {passwordErrorText}
              </FormHelperText>
            </FormControl>
            <button type="submit" style={{ display: 'none' }} />
          </form>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Settings);