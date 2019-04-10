import * as React from 'react';

import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  InputLabel,
  StyleRulesCallback,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { IUser } from '../../interfaces/User';
import axios from 'axios';

interface IFormState {
  toggleText: string;
  linkText: string;
  errorText: string;
  state: SignInState | SignUpState | ResetPasswordState | null;
}

enum SignInState {
  SIGNED_IN,
  SIGNED_OUT,
  SIGNING_IN,
}

enum ResetPasswordState {
  NO_REQUEST,
  SENDING_REQUEST,
  RESQUEST_SENT,
}

enum SignUpState {
  SIGNED_UP,
  SIGNING_UP,
  SIGNED_OUT,
}

const signInText: { [key in SignInState]: string } = {
  [SignInState.SIGNED_IN]: 'Logged In',
  [SignInState.SIGNED_OUT]: 'Log In',
  [SignInState.SIGNING_IN]: 'Logging In',
};

const signUpText: { [key in SignUpState]: string } = {
  [SignUpState.SIGNED_UP]: 'Registered',
  [SignUpState.SIGNING_UP]: 'Registering',
  [SignUpState.SIGNED_OUT]: 'Register',
};

const resetPasswordText: { [key in ResetPasswordState]: string } = {
  [ResetPasswordState.NO_REQUEST]: 'Reset Password',
  [ResetPasswordState.SENDING_REQUEST]: 'Sending',
  [ResetPasswordState.RESQUEST_SENT]: 'Password Reset Sent',
};

export type AuthDialogState = 'signIn' | 'signUp' | 'resetPassword';

export interface IAuthFormContainerProps extends WithStyles<typeof styles> {
  handleSignIn: (user: IUser) => void;
}

export interface IAuthFormContainerState {
  nickname: string;
  email: string;
  password: string;
  loading: boolean;
  currentState: AuthDialogState;
  states: { [key in AuthDialogState]: IFormState };
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    width: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.primary.main,
    borderRadius: '10px',
    paddingTop: theme.spacing.unit,
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    [theme.breakpoints.up('sm')]: {
      paddingTop: theme.spacing.unit * 3,
      paddingLeft: theme.spacing.unit * 3,
      paddingRight: theme.spacing.unit * 3,
    },
  },
  authForm: {
    width: '100%',
  },
  extraActions: {
    display: 'flex',
    textAlign: 'center',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing.unit,
    '& > span': {
      [theme.breakpoints.only('xs')]: {
        fontSize: '10px !important'
      }
    }
  },
  formControl: {
    [theme.breakpoints.up('sm')]: {
      marginBottom: theme.spacing.unit * 2,
    }
  },
  forgotPassword: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  hidden: {
    display: 'none',
  },
  signUp: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
  separator: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  input: {
    backgroundColor: 'transparent',
    border: 'none',
    color: theme.palette.text.primary,
    '&::-webkit-autofill': {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.background.default,
    },
  },
});

class AuthFormContainer extends React.Component<
  IAuthFormContainerProps,
  IAuthFormContainerState
  > {
  public state = {
    nickname: '',
    email: '',
    password: '',
    loading: false,
    currentState: 'signIn' as AuthDialogState,
    states: {
      signIn: {
        toggleText: "Don't have an account?",
        linkText: 'Register',
        errorText: '',
        state: SignInState.SIGNED_OUT,
      },
      signUp: {
        toggleText: 'Already have an account?',
        linkText: 'Log In',
        errorText: '',
        state: SignUpState.SIGNED_OUT,
      },
      resetPassword: {
        toggleText: 'Remember your password?',
        linkText: 'Log In',
        errorText: '',
        state: ResetPasswordState.NO_REQUEST,
      },
    },
  };

  public handleNicknameChange = (event: any) => {
    this.setState({ nickname: event.target.value });
  };

  public handleEmailChange = (event: any) => {
    this.setState({ email: event.target.value });
  };

  public handlePasswordChange = (event: any) => {
    this.setState({ password: event.target.value });
  };

  public signIn = () => {
    console.log('[signIn]');
    const { handleSignIn } = this.props;
    const { email, password, states } = this.state;
    const { signIn } = states;

    axios({
      method: 'post',
      url: '/login',
      params: {
        email,
        password,
      },
    })
      .then((result) => {
        console.log('[signIn].then');
        const { data } = result;
        const {
          id,
          avatar_url,
          nickname,
          email: userEmail,
          phone,
          is_mentor,
          tags
        } = data;
        handleSignIn({
          id,
          nickname,
          email: userEmail,
          phone,
          avatar_url,
          is_mentor,
          tags
        });
      })
      .catch((err) => {
        if (err.response) {
          const { error } = err.response.data;
          signIn.state = SignInState.SIGNED_OUT;
          signIn.errorText = error;
          this.setState({ states });
        }
      });
  };

  public signUp = () => {
    const { handleSignIn } = this.props;
    const { nickname, email, password, states } = this.state;
    const { signUp } = states;

    axios({
      method: 'post',
      url: '/register',
      params: {
        nickname,
        email,
        password,
      },
    })
      .then((result) => {
        const { data } = result;
        const {
          id,
          avatar_url,
          nickname: userNickname,
          email: userEmail,
          phone,
          is_mentor,
          tags
        } = data;
        handleSignIn({
          id,
          nickname: userNickname,
          email: userEmail,
          phone,
          avatar_url,
          is_mentor,
          tags
        });
        signUp.state = SignUpState.SIGNED_UP;
        this.setState({ states });
      })
      .catch((err) => {
        if (err.response) {
          const { error } = err.response.data;
          signUp.state = SignUpState.SIGNED_OUT;
          signUp.errorText = error;
          this.setState({ states });
        }
      });
  };

  public submitForm = (ev?: any) => {
    if (ev) {
      ev.preventDefault();
    }
    const { currentState, states } = this.state;
    const { signIn, signUp } = states;
    if (currentState === 'signIn') {
      signIn.state = SignInState.SIGNING_IN;
      this.setState({ states }, () => {
        this.signIn();
      });
    }
    if (currentState === 'signUp') {
      signUp.state = SignUpState.SIGNING_UP;
      this.setState({ states }, () => {
        this.signUp();
      });
    }
    // if (authDialogState === 'resetPassword') {
    //   this.sendPasswordReset();
    // }
  };

  public handleChangeAuthDialogState = (newState: AuthDialogState) => {
    this.setState({ currentState: newState });
  };

  public showPasswordReset = () => {
    this.handleChangeAuthDialogState('resetPassword');
  };

  public toggleSignUp = () => {
    const { currentState } = this.state;
    currentState === 'signIn'
      ? this.handleChangeAuthDialogState('signUp')
      : this.handleChangeAuthDialogState('signIn');
  };

  public getActiveText = (
    s: SignInState | SignUpState | ResetPasswordState | null,
    a: AuthDialogState
  ) => {
    let activeText = '';
    if (s !== null) {
      switch (a) {
        case 'signIn':
          activeText = signInText[s];
          break;
        case 'signUp':
          activeText = signUpText[s];
          break;
        case 'resetPassword':
          activeText = resetPasswordText[s];
          break;
        default:
          break;
      }
    } else {
      console.log('aaaa');
    }
    return activeText;
  };

  public render() {
    const { currentState, email, nickname, password, states } = this.state;
    const { classes } = this.props;
    const activeState = states[currentState].state;
    const errorText = states[currentState].errorText;
    const toggleText = states[currentState].toggleText;
    const linkText = states[currentState].linkText;
    const activeText = this.getActiveText(activeState, currentState);
    return (
      <div className={classes.root}>
        <form
          className={classes.authForm}
          onSubmit={(ev) => this.submitForm(ev)}
          id="auth-form"
        >
          {currentState === 'signUp' && (
            <FormControl
              fullWidth={true}
              error={errorText.length > 0}
              required={true}
              className={classes.formControl}
            >
              <InputLabel htmlFor="inputNickname">Nickname</InputLabel>
              <Input
                id="inputNickname"
                value={nickname}
                autoFocus={true}
                type={'text'}
                autoComplete={'username'}
                onChange={this.handleNicknameChange}
              />
              <FormHelperText id="inputEmailError">{errorText}</FormHelperText>
            </FormControl>
          )}
          <FormControl
            required={true}
            fullWidth={true}
            className={classes.formControl}
            error={errorText.length > 0}
          >
            <InputLabel htmlFor="inputEmail">Email Address</InputLabel>
            <Input
              id="inputEmail"
              value={email}
              autoFocus={true}
              type={'email'}
              autoComplete={'email'}
              onChange={this.handleEmailChange}
              className={classes.input}
            />
            <FormHelperText id="inputEmailError">{errorText}</FormHelperText>
          </FormControl>
          {currentState !== 'resetPassword' && (
            <FormControl
              required={true}
              fullWidth={true}
              className={classes.formControl}
              error={errorText.length > 0}
            >
              <InputLabel htmlFor="inputPassword">Password</InputLabel>
              <Input
                id="inputPassword"
                value={password}
                type={'password'}
                autoComplete={'current-password'}
                onChange={this.handlePasswordChange}
              />
              <FormHelperText id="inputPasswordError">
                {errorText}
              </FormHelperText>
            </FormControl>
          )}
          <button style={{ display: 'none' }} type="submit" />
        </form>
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          onClick={this.submitForm}
        >
          {activeText}
        </Button>
        <div className={classes.extraActions}>
          {currentState !== 'resetPassword' && (
            <>
              <div
                role="button"
                className={classes.forgotPassword}
                onClick={this.showPasswordReset}
              >
                <Typography color="primary" variant={'caption'}>
                  Forgot Password?
                </Typography>
              </div>
              <Typography className={classes.separator} variant={'caption'}>
                &#8226;
              </Typography>
            </>
          )}
          <Typography variant={'caption'}>{toggleText}</Typography>
          <div
            role="button"
            className={classes.signUp}
            onClick={this.toggleSignUp}
          >
            <Typography color="primary" variant={'caption'}>
              &nbsp;{linkText}
            </Typography>
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AuthFormContainer);
