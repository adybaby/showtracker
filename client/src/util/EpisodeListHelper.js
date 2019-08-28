import React from "react";
import * as Dates from "../util/Dates";

export const EPISODE_FILTERS = {
  SHOW_ALL: "SHOW_ALL",
  SHOW_FIRST: "SHOW_FIRST",
  SHOW_NEXT: "SHOW_NEXT",
  SHOW_FUTURE: "SHOW_FUTURE"
};

export const getfilteredEpisodes = (episodes, episodeFilter) => {
  const sortedEpisodes = sortEpisodesByDate(episodes);
  let filteredEpisodes;

  switch (episodeFilter) {
    case EPISODE_FILTERS.SHOW_FIRST:
      filteredEpisodes = getFirstEpisodes(sortedEpisodes);
      break;
    case EPISODE_FILTERS.SHOW_NEXT:
      filteredEpisodes = getNextEpisodes(sortedEpisodes);
      break;
    case EPISODE_FILTERS.SHOW_FUTURE:
      filteredEpisodes = getFutureEpisodes(sortedEpisodes);
      break;
    default:
      filteredEpisodes = sortedEpisodes;
  }

  return filteredEpisodes.map(episode => buildEpisodeJSX(episode));
};

const getNextEpisodes = episodes => {
  return filterEpisodes(episodes, false);
};

const getFirstEpisodes = episodes => {
  return filterEpisodes(episodes, true);
};

const getFutureEpisodes = episodes => {
  let today = new Date();
  return episodes.filter(episode => new Date(episode.firstAired) >= today);
};

const filterEpisodes = (episodes, first) => {
  let today = new Date();

  const filteredEpisodes = [];
  const episodeMap = new Map();

  episodes.forEach(episode => {
    if (!episodeMap.has(episode.showName)) {
      if (first || new Date(episode.firstAired) >= today) {
        episodeMap.set(episode.showName, "");
        filteredEpisodes.push(episode);
      }
    }
  });

  return filteredEpisodes;
};

const sortEpisodesByDate = episodes => {
  return episodes.sort((a, b) => {
    const dateA = new Date(a.firstAired);
    const dateB = new Date(b.firstAired);

    return a.firstAired === b.firstAired
      ? a.airedEpisodeNumber - b.airedEpisodeNumber
      : dateA - dateB;
  });
};

const buildEpisodeJSX = episode => {
  return (
    <p key={episode.key}>
      {Dates.formatDate(new Date(episode.firstAired))}
      {" : "}
      {episode.showName} (
      {episode.episodeName == null ? "Untitled" : episode.episodeName},{" "}
      {episode.shortName})
    </p>
  );
};
