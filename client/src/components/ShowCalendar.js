import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as STATUS from "../actions/ActionStatuses";
import * as EpisodeListHelper from "../util/EpisodeListHelper";

function ShowCalendar() {
  const [episodeFilter, setEpisodeFilter] = useState(
    EpisodeListHelper.EPISODE_FILTERS.SHOW_NEXT
  );
  const [episodeJsx, setEpisodeJsx] = useState("");

  const episodes = useSelector(state => state.episodes);
  const loadEpisodesStatus = useSelector(state => state.loadEpisodesStatus);

  useEffect(() => {
    setEpisodeJsx(
      loadEpisodesStatus === STATUS.LOAD_EPISODES.FOUND_EPISODES
        ? EpisodeListHelper.getfilteredEpisodes(episodes, episodeFilter)
        : loadEpisodesStatus
    );
  }, [episodeFilter, episodes, loadEpisodesStatus]);

  const handleEpisodeFilterClick = event => {
    setEpisodeFilter(event.target.value);
  };

  return (
    <div>
      <div>
        <div>
          <label htmlFor="showAll">Show All</label>
          <input
            type="radio"
            id="showAll"
            name="episodeFilter"
            value={EpisodeListHelper.EPISODE_FILTERS.SHOW_ALL}
            onClick={handleEpisodeFilterClick}
          />
          <label htmlFor="showFirst">Show First</label>
          <input
            type="radio"
            id="showFirst"
            name="episodeFilter"
            value={EpisodeListHelper.EPISODE_FILTERS.SHOW_FIRST}
            onClick={handleEpisodeFilterClick}
          />
          <label htmlFor="showNext">Show Next</label>
          <input
            type="radio"
            id="showNext"
            name="episodeFilter"
            value={EpisodeListHelper.EPISODE_FILTERS.SHOW_NEXT}
            onClick={handleEpisodeFilterClick}
            defaultChecked
          />
          <label htmlFor="showFuture">Show Future</label>
          <input
            type="radio"
            id="showFuture"
            name="episodeFilter"
            value={EpisodeListHelper.EPISODE_FILTERS.SHOW_FUTURE}
            onClick={handleEpisodeFilterClick}
          />
        </div>
      </div>
      <div>
        <h1>Episodes</h1>
        <ul>{episodeJsx}</ul>
      </div>
    </div>
  );
}

export default ShowCalendar;
