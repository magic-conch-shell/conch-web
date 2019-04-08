import * as React from 'react';

import { Avatar, Grid, StyleRulesCallback, Theme, Typography, WithStyles, withStyles } from '@material-ui/core';

import { DirectUpload } from 'activestorage';
import { IAnswer } from '../../interfaces/Answer';
import { IQuestion } from '../../interfaces/Question';
import { ISettings } from '../../interfaces/Settings';
import { ITag } from '../../interfaces/Tag';
import { IUser } from '../../interfaces/User';
import ProfileContent from './ProfileContent';
import ProfileTabList from './ProfileTabList';
import axios from 'axios';

export interface IProfileContainerProps extends WithStyles<typeof styles> {
  answers: IAnswer[];
  setAnswers: (answers: IAnswer[]) => void;
  questions: IQuestion[];
  setQuestions: (questions: IQuestion[]) => void;
  editUser: (user: IUser) => void;
  currentTab: TabTypes;
  mentorDialogOpen: boolean;
  setTimeZone: (timeZone: string) => void;
  tags: ITag[];
  toggleTheme: () => void;
  user: IUser;
  userSettings: ISettings;
}

export interface IProfileContainerState {
  currentTab: TabTypes;
  loading: boolean;
}

const styles: StyleRulesCallback<any> = (theme: Theme) => ({
  profileAvatarInputContainer: {
    height: '80px',
    width: '80px',
    borderRadius: '5px',
    [theme.breakpoints.up('sm')]: {
      height: '95px',
      width: '95px',
    },
    [theme.breakpoints.up('md')]: {
      height: '110px',
      width: '110px',
    },
    [theme.breakpoints.up('lg')]: {
      height: '125px',
      width: '125px',
    },
    [theme.breakpoints.up('xl')]: {
      height: '140px',
      width: '140px',
    },
    transition: theme.transitions.create(['opacity'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.shortest,
    }),
    cursor: 'pointer',
    '&:hover': {
      opacity: 0.45,
    },
  },
  avatar: {
    height: '100%',
    width: '100%',
    borderRadius: '5px',
  },
  changeAvatarText: {
    fontWeight: 'bolder',
    fontVariant: 'small-caps',
    color: 'white',
  },
  root: {
    marginTop: 90 + theme.spacing.unit * 2,
  },
  profileHeader: {
    display: 'flex',
  },
  profileHeaderText: {
    display: 'flex',
    marginLeft: theme.spacing.unit * 2,
    marginRight: 'auto',
    flexDirection: 'column',
  },
});

export enum TabTypes {
  Home = 'Home',
  MentorPanel = 'Mentor Panel',
  Settings = 'Settings'
}

class ProfileContainer extends React.Component<
  IProfileContainerProps,
  IProfileContainerState
  > {
  public inputRef: React.RefObject<any>;

  constructor(props: IProfileContainerProps) {
    super(props);
    this.state = {
      currentTab: this.props.currentTab,
      loading: true,
    };
    this.inputRef = React.createRef();
  }

  public uploadFile = (file: any) => {
    const { editUser, user } = this.props;
    const url = this.inputRef.current.dataset.directUploadUrl;
    const upload = new DirectUpload(file, url);

    upload.create((error: any, blob: any) => {
      if (error) {
        console.dir(error);
      } else {
        console.log(blob);
        axios({
          method: 'put',
          url: `/api/users/${this.props.user.id}`,
          // params: {
          //   avatar: `https://s3.ca-central-1.amazonaws.com/conch-avatars/${blob.key}`,
          // },
          params: {
            avatar: blob.signed_id,
          }
        })
          .then((result) => {
            const newUser = { ...user };
            newUser.avatar_url = `https://s3.ca-central-1.amazonaws.com/conch-avatars/${blob.key}`;
            editUser(newUser);
          })
          .catch((err) => console.log(err));
      }
    });
  };

  public changeCurrentTab = (newTab: TabTypes) => {
    this.setState({ currentTab: newTab });
  };

  public handleClick = () => {
    this.inputRef.current.click();
  };

  public handleFinishLoading = () => {
    console.log('Finished loading!');
    this.isNotLoading();
  };

  public handleStartLoading = () => {
    console.log('Loading data!');
    this.isLoading();
  };

  public isLoading = () => {
    this.setState({ loading: true });
  };

  public isNotLoading = () => {
    this.setState({ loading: false }, () =>
      console.log('loading set to false')
    );
  };

  public handleAvatarChange = (ev: any) => {
    if (ev.target.files[0]) {
      const file = ev.target.files[0];
      this.uploadFile(file);
    }
  };

  public getTabs = () => {
    const { user } = this.props;
    const userTabs = Object.values(TabTypes);
    return user.is_mentor ? userTabs : userTabs.filter(t => t !== TabTypes.MentorPanel);
  }

  public render() {
    const { currentTab, loading } = this.state;
    const { classes, currentTab: propsCurrentTab, user, ...rest } = this.props;
    const tabs = this.getTabs();
    return (
      <Grid item={true} xs={11} className={classes.root}>
        <Grid container={true} spacing={24}>
          <Grid item={true} xs={12}>
            <div className={classes.profileHeader}>
              <div
                className={classes.profileAvatarInputContainer}
                onClick={this.handleClick}
              >
                <Avatar className={classes.avatar} src={user.avatar_url} />
                <input
                  type="file"
                  ref={this.inputRef}
                  style={{ display: 'none' }}
                  onChange={this.handleAvatarChange}
                  accept="image/*"
                  data-direct-upload-url="/rails/active_storage/direct_uploads"
                />
              </div>
              <div className={classes.profileHeaderText}>
                <Typography variant="h3">{user.nickname}</Typography>
                <Typography variant="h6">{user.email}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item={true} xs={4} md={2}>
            <ProfileTabList
              currentTab={currentTab}
              handleClick={this.changeCurrentTab}
              tabs={tabs}
            />
          </Grid>
          <Grid item={true} xs={8} md={10}>
            <ProfileContent
              currentTab={currentTab}
              handleFinishLoading={this.handleFinishLoading}
              loading={loading}
              user={user}
              {...rest}
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ProfileContainer);
