import * as React from 'react';

import {
  Avatar,
  Grid,
  StyleRulesCallback,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { IUser } from '../../interfaces/User';
import ProfileContent from './ProfileContent';
import ProfileTabList from './ProfileTabList';
import { ISettings } from '../../interfaces/Settings';
import axios from 'axios';

export interface IProfileContainerProps extends WithStyles<typeof styles> {
  editUser: (user: IUser) => void;
  setTimeZone: (timeZone: string) => void;
  toggleTheme: () => void;
  user: IUser;
  userSettings: ISettings;
}

export interface IProfileContainerState {
  currentTab: number;
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

const PROFILE_TABS = ['Home', 'Settings'];

class ProfileContainer extends React.Component<
  IProfileContainerProps,
  IProfileContainerState
> {
  public inputRef: React.RefObject<any>;

  constructor(props: IProfileContainerProps) {
    super(props);
    this.state = {
      currentTab: 0,
    };
    this.inputRef = React.createRef();
  }

  public componentDidMount() {
    console.log(this.inputRef);
  }

  public changeCurrentTab = (newTabIndex: number) => {
    this.setState({ currentTab: newTabIndex });
  };

  public handleClick = () => {
    this.inputRef.current.click();
  };

  public handleAvatarChange = (ev: any) => {
    if (ev.target.files[0]) {
      // const file = ev.target.files[0];
      // const s3 = new AWS.S3({ apiVersion: '2016-11-15' });
      // s3.config.update({
      //   accessKeyId: process.env.REACT_APP_AWS_API_KEY,
      //   secretAccessKey: process.env.REACT_APP_AWS_API_SECRET,
      // });

      // s3.upload(
      //   { Bucket: 'conch-avatars', Key: shortid(), Body: file },
      //   {},
      //   (err: any, data: any) => {
      //     console.log(err);
      //     console.log(data);
      //   }
      // );
      axios({
        method: 'get',
        url: '/requestS3Token',
      })
        .then((result) => {
          console.log(result);
          // make request to upload
        })
        .catch((err) => console.log(err));
    }
  };

  public render() {
    const { currentTab } = this.state;
    const { classes, user, ...rest } = this.props;
    return (
      <Grid item={true} xs={11} className={classes.root}>
        <Grid container={true} className={classes.full} spacing={24}>
          <Grid item={true} xs={12}>
            <div className={classes.profileHeader}>
              <div
                className={classes.profileAvatarInputContainer}
                onClick={this.handleClick}
              >
                <Avatar className={classes.avatar} src={user.avatar} />
                <input
                  type="file"
                  ref={this.inputRef}
                  style={{ display: 'none' }}
                  onChange={this.handleAvatarChange}
                  accept="image/*"
                />
              </div>
              <div className={classes.profileHeaderText}>
                <Typography variant="h3">{user.nickname}</Typography>
                <Typography variant="h6">{user.email}</Typography>
              </div>
            </div>
          </Grid>
          <Grid item={true} xs={4} md={2} className={classes.full}>
            <ProfileTabList
              currentTab={currentTab}
              handleClick={this.changeCurrentTab}
              tabs={PROFILE_TABS}
            />
          </Grid>
          <Grid item={true} xs={8} md={10} className={classes.full}>
            <ProfileContent currentTab={currentTab} user={user} {...rest} />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(ProfileContainer);
