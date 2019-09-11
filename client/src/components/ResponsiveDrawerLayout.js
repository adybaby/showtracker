import React from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles/Styles";

const useStyles = makeStyles(theme => styles(theme));

function ResponsiveDrawer(props) {
  const classes = useStyles();
  const { container } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  function handleDrawerToggle() {
    setMobileOpen(!mobileOpen);
  }

  const appBar = (
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
          {props.title}
        </Typography>
        {props.toolbarItems}
      </Toolbar>
    </AppBar>
  );

  const drawer = (
    <div>
      <div className={classes.drawerToolbar} />
      {props.drawerPanel}
    </div>
  );

  return (
    <div className={classes.root}>
      <CssBaseline />

      {appBar}

      <div className={classes.drawer}>
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={"left"}
            open={mobileOpen}
            onClose={handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile.
            }}
          >
            {drawer}
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
            {drawer}
          </Drawer>
        </Hidden>
      </div>
      <main className={classes.drawerContent}>
        <div className={classes.drawerToolbar} />
        {props.mainPanel}
      </main>
    </div>
  );
}

ResponsiveDrawer.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  container: PropTypes.instanceOf(
    typeof Element === "undefined" ? Object : Element
  )
};

export default ResponsiveDrawer;
