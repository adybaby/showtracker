import React, { useEffect } from "react";
import ShowPanel from "./components/ShowPanel";
import EpisodeList from "./components/EpisodeList";
import CssBaseline from "@material-ui/core/CssBaseline";
import NoUser from "./components/NoUser";
import Button from "@material-ui/core/Button";
import EpisodeFilter from "./components/EpisodeFilter";
import { useAuth0 } from "./react-auth0-wrapper";
import AppBar from "@material-ui/core/AppBar";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { useDispatch, useSelector } from "react-redux";
import { fetchShows } from "./actions/Shows";
import styles from "./styles/Styles";

const useStyles = makeStyles(theme => styles(theme));

function App() {
  const classes = useStyles();
  const [showDrawer, setShowDrawer] = React.useState(false);
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const { loading, user } = useAuth0();
  const dispatch = useDispatch();
  const shows = useSelector(state => state.shows);

  useEffect(() => {
    if (user) {
      dispatch(fetchShows(user));
    }
  }, [dispatch, user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <NoUser />;
  }

  function handleDrawerToggle() {
    setShowDrawer(!showDrawer);
  }

  return (

    <div style={{ width: "100%" }}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.appBarMenuButton}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.appBarTitle}>
              SHOWTRACKER
            </Typography>
            <EpisodeFilter key="episodeFilter" />
            <div>
              {!isAuthenticated && (
                <Button
                  key="loginbutton"
                  color="inherit"
                  onClick={() => loginWithRedirect({})}
                >
                  LOGIN
                </Button>
              )}
              {isAuthenticated && (
                <Button
                  key="loginbutton"
                  color="inherit"
                  onClick={() => logout()}
                >
                  LOGOUT
                </Button>
              )}
            </div>
          </Toolbar>
        </AppBar>

        <div className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              anchor={"left"}
              open={showDrawer}
              onClose={handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper
              }}
              ModalProps={{
                keepMounted: true // Better open performance on mobile.
              }}
            >
              <div>
                <div className={classes.drawerToolbar} />
                <ShowPanel shows={shows} />
              </div>
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper
              }}
              variant="permanent"
              open
            >
              <div>
                <div className={classes.drawerToolbar} />
                <ShowPanel shows={shows} />
              </div>
            </Drawer>
          </Hidden>
        </div>
        <main style={{ width: "100%" }}>
          <div className={classes.drawerToolbar} />
          <EpisodeList />
        </main>
      </div>
    </div>
  );
}

export default App;
