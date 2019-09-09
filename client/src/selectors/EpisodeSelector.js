import { createSelector } from "reselect";
import * as EPISODE_FILTERS from "../constants/EpisodeFilters";

const getEpisodeFilter = state => state.episodeFilter;
const getEpisodes = state => state.episodes;

export const getVisibleEpisodes = createSelector(
  [getEpisodeFilter, getEpisodes],
  (episodeFilter, episodes) => {
    const sortedEpisodes = sortEpisodesByDate(episodes);
    switch (episodeFilter) {
      case EPISODE_FILTERS.SHOW_FIRST:
        return getFirstEpisodes(sortedEpisodes);
      case EPISODE_FILTERS.SHOW_NEXT:
        return getNextEpisodes(sortedEpisodes);
      case EPISODE_FILTERS.SHOW_FUTURE:
        return getFutureEpisodes(sortedEpisodes);
      default:
        return sortedEpisodes;
    }
  }
);

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

export default getVisibleEpisodes;
