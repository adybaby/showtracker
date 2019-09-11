import React from "react";
import { useSelector } from "react-redux";
import * as STATUS from "../constants/ActionStatuses";
import getVisibleEpisodes from "../selectors/EpisodeSelector";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import EpisodeCard from "./EpisodeCard";
import { CircularProgress, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../styles/Styles";

const useStyles = makeStyles(theme => styles(theme));

export const ShowCalendar = () => {
  const classes = useStyles();
  const episodes = useSelector(getVisibleEpisodes);
  const fetchEpisodesStatus = useSelector(state => state.fetchEpisodesStatus);

  switch (fetchEpisodesStatus) {
    case STATUS.FETCH_EPISODES.FOUND_EPISODES:
      return (
        <List>
          {episodes.map(episode => (
            <ListItem key={episode.key}>
              <EpisodeCard episode={episode} />
            </ListItem>
          ))}
        </List>
      );
    case STATUS.FETCH_EPISODES.IN_PROGRESS:
      return (
        <div className={classes.fetchEpisodesStatus}>
          <CircularProgress />
          <Typography variant="h5" component="h4">
          {"    "}{fetchEpisodesStatus}
          </Typography>       
        </div>
      );
    default:
      return (
        <div className={classes.fetchEpisodesStatus}>
          <Typography variant="h5" component="h4">
            {fetchEpisodesStatus}
          </Typography>
        </div>
      );
  }
};

export default ShowCalendar;
