import * as TYPES from "../actions/ActionTypes";
import * as STATUS from "../actions/ActionStatuses";

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

export const loadEpisodesStatusReducer = (
  state = STATUS.LOAD_EPISODES.INITIAL,
  action
) => {
  switch (action.type) {
    case TYPES.SET_LOAD_EPISODES_STATUS:
      return action.status;
    default:
      return state;
  }
};