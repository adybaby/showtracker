import * as TYPES from "./ActionTypes";
import * as STATUS from "./ActionStatuses";
import * as server from "../util/ServerInterface";

export const addEpisodes = episodes => ({
  type: TYPES.ADD_EPISODES,
  episodes
});

export const removeEpisodesForShow = showId => ({
  type: TYPES.REMOVE_EPISODES,
  showId
});

export const loadEpisodes = shows => {
  return dispatch => {
    dispatch(setLoadEpisodesStatus(STATUS.LOAD_EPISODES.IN_PROGRESS));

    server.loadEpisodes(
      shows,
      data => {
        if (data.length === 0) {
          dispatch(
            setLoadEpisodesStatus(STATUS.LOAD_EPISODES.NO_EPISODES_FOUND)
          );
        } else {
          dispatch(addEpisodes(data));
          dispatch(setLoadEpisodesStatus(STATUS.LOAD_EPISODES.FOUND_EPISODES));
        }
      },
      () => {
        dispatch(setLoadEpisodesStatus(STATUS.LOAD_EPISODES.ERROR));
      }
    );
  };
};

export const setLoadEpisodesStatus = status => ({
  type: TYPES.SET_LOAD_EPISODES_STATUS,
  status
});
