import { createSelector } from 'reselect';
import * as EPISODE_FILTERS from '../constants/EpisodeFilters';

const getEpisodeFilter = (state) => state.episodeFilter;
const getEpisodes = (state) => state.episodes;
const getShowFilter = (state) => state.showFilter;

const filterEpisodes = (episodes, first) => {
  const today = new Date();

  const filteredEpisodes = [];
  const episodeMap = new Map();

  episodes.forEach((episode) => {
    if (!episodeMap.has(episode.showName)) {
      if (first || new Date(episode.firstAired) >= today) {
        episodeMap.set(episode.showName, '');
        filteredEpisodes.push(episode);
      }
    }
  });

  return filteredEpisodes;
};

const getNextEpisodes = (episodes) => filterEpisodes(episodes, false);

const getFirstEpisodes = (episodes) => filterEpisodes(episodes, true);

const getFutureEpisodes = (episodes) => {
  const today = new Date();
  return episodes.filter((episode) => new Date(episode.firstAired) >= today);
};

const sortEpisodesByDate = (episodes) => episodes.sort((a, b) => {
  let dateA = new Date(a.firstAired);
  let dateB = new Date(b.firstAired);

  if (isNaN(dateA)) dateA = 0;
  if (isNaN(dateB)) dateB = 0;

  return a.firstAired === b.firstAired
    ? a.airedEpisodeNumber - b.airedEpisodeNumber
    : dateA - dateB;
});

const filterByEpisode = createSelector(
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

const getVisibleEpisodes = createSelector(
  [filterByEpisode, getShowFilter],
  (episodes, showFilter) => {
    if (showFilter.length === 0) return episodes;

    return episodes.filter((episode) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const showId of showFilter) {
        if (showId === episode.showId) return true;
      }
      return false;
    });
  }
);

export default getVisibleEpisodes;
