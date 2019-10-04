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

export const EpisodeList = () => {
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
          <CircularProgress className={classes.statusElem} />
          <Typography
            className={classes.statusElem}
            variant="h5"
            component="h4"
          >
            {fetchEpisodesStatus}
          </Typography>
        </div>
      );
    case STATUS.FETCH_EPISODES.ERROR:
      return (
        <div className={classes.fetchEpisodesStatus}>
          <Typography
            className={classes.statusElem}
            variant="h5"
            component="h4"
          >
            There was a problem retrieving the episodes.
          </Typography>
        </div>
      );
    default:
      return null;
  }
};
export default EpisodeList;