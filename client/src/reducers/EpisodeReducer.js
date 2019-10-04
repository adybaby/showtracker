import * as TYPES from "../constants/ActionTypes";
import * as STATUS from "../constants/ActionStatuses";
import * as EPISODE_FILTERS from "../constants/EpisodeFilters";

export const episodeReducer = (state = [], action) => {
  switch (action.type) {
    case TYPES.ADD_EPISODES:
      return state.concat(action.episodes);
    case TYPES.REMOVE_EPISODES:
      return state.filter(episode => episode.showId !== action.showId);
    default:
      return state;
  }
};

export const fetchEpisodesStatusReducer = (
  state = STATUS.FETCH_EPISODES.INITIAL,
  action
) => {
  switch (action.type) {
    case TYPES.SET_FETCH_EPISODES_STATUS:
      return action.status;
    default:
      return state;
  }
};

export const episodeFilterReducer = (state = EPISODE_FILTERS.SHOW_NEXT, action) => {
  switch (action.type) {
    case TYPES.SET_EPISODE_FILTER:
      return action.filter;
    default:
      return state;
  }
};

export const showFilterReducer = (state = [], action) => {
  switch (action.type) {
    case TYPES.ADD_SHOW_FILTER:
        return [...state, action.showId];
    case TYPES.REMOVE_SHOW_FILTER:
      return state.filter(id=>id !== action.showId);
    default:
      return state;
  }
};

