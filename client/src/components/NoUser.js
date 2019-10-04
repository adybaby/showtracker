import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles/Styles";
import Button from "@material-ui/core/Button";
import { useAuth0 } from "../react-auth0-wrapper";

const useStyles = makeStyles(theme => styles(theme));

const NoUser = () => {
  const { loginWithRedirect } = useAuth0();
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.appBarTitle}>
            SHOWTRACKER
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
      <div className={classes.fetchEpisodesStatus}>
        <Typography className={classes.statusElem} variant="h5" component="h4">
          Showtracker lets you add your favourite shows, then uses TVDB to show
          you when those shows air. Click LOGIN above to sign up or log in. When
          you're signed in, click ADD SHOWS to start adding your favourite
          shows!
        </Typography>
      </div>
    </div>
  );
};

export default NoUser;
