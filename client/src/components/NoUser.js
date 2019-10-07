import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { useAuth0 } from '../react-auth0-wrapper';
import styles from '../styles/Styles';

const useStyles = makeStyles((theme) => styles(theme));

const NoUser = () => {
  const { loginWithRedirect } = useAuth0();
  const classes = useStyles();

  return (
    <div className={classes.background}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.appBarTitle}>
            THE SHOWTRACKER
          </Typography>
          <Button
            key="loginbutton"
            color="inherit"
            onClick={() => loginWithRedirect({})}
          >
            lOGIN
          </Button>
        </Toolbar>
      </AppBar>
      <div className={classes.introBox}>
      <div className={classes.introBox}>
        <Typography className={classes.statusElem} variant="h5" component="h4">
          Showtracker lets you add your favourite shows, then uses TVDB to show
          you when those shows air. Click LOGIN above to sign up or log in. When
          you&apos;re signed in, click ADD SHOWS to start adding your favourite
          shows!
        </Typography>
        </div>
      </div>
    </div>
  );
};

export default NoUser;
