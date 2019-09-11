import CssBaseline from "@material-ui/core/CssBaseline";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchShows } from "./actions/Shows";
import ShowList from "./components/ShowList";
import SearchAndAddPopup from "./components/SearchAndAddPopup";
import ShowCard from "./components/ShowCardListItem";
import ShowCalendar from "./components/ShowCalendar";
import ResponsiveDrawerLayout from "./components/ResponsiveDrawerLayout";
import Button from "@material-ui/core/Button";
import EpisodeFilter from "./components/EpisodeFilter";
import Divider from "@material-ui/core/Divider";
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styles from "./styles/Styles";

const useStyles = makeStyles(theme => styles(theme));

function App() {
    const classes = useStyles();

  return (
    <div className={classes.fetchEpisodesStatus}>
    <CircularProgress />
    <Typography variant="h5" component="h4">
    Loading..
    </Typography>       
  </div>
  );
}

export default App;