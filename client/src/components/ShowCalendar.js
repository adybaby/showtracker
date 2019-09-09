import React from "react";
import { useSelector } from "react-redux";
import * as STATUS from "../constants/ActionStatuses";
import getVisibleEpisodes from "../selectors/EpisodeSelector";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import EpisodeCard from "./EpisodeCard";

export const ShowCalendar = () => {
  const episodes = useSelector(getVisibleEpisodes);
  const fetchEpisodesStatus = useSelector(state => state.fetchEpisodesStatus);

  return (
    <div>
      {fetchEpisodesStatus === STATUS.FETCH_EPISODES.FOUND_EPISODES ? (
        <List>
          {episodes.map(episode => (
            <ListItem key={episode.key}>
              <EpisodeCard episode={episode} />
            </ListItem>
          ))}
        </List>
      ) : (
        fetchEpisodesStatus
      )}
    </div>
  );
};

export default ShowCalendar;
