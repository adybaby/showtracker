import * as STATUS from '../constants/ActionStatuses';
import * as TYPES from '../constants/ActionTypes';
import log from '../util/Logger';
import * as server from '../util/ServerInterface';

export const addEpisodes = (episodes) => ({
  type: TYPES.ADD_EPISODES,
  episodes,
});

export const removeEpisodesForShow = (showId) => ({
  type: TYPES.REMOVE_EPISODES,
  showId,
});

export const setEpisodeFilter = (filter) => ({
  type: TYPES.SET_EPISODE_FILTER,
  filter,
});

export const addShowFilter = (showId) => {
  return ({
    type: TYPES.ADD_SHOW_FILTER,
    showId,
  });
};

export const removeShowFilter = (showId) => ({
  type: TYPES.REMOVE_SHOW_FILTER,
  showId,
});

export const setFetchEpisodesStatus = (status) => ({
  type: TYPES.SET_FETCH_EPISODES_STATUS,
  status,
});

export const fetchEpisodes = (shows) => (dispatch) => {
  dispatch(setFetchEpisodesStatus(STATUS.FETCH_EPISODES.IN_PROGRESS));

  server.episodes(
    shows,
    (data) => {
      if (data.length === 0) {
        dispatch(
          setFetchEpisodesStatus(STATUS.FETCH_EPISODES.NO_EPISODES_FOUND),
        );
      } else {
        dispatch(addEpisodes(data));
        dispatch(setFetchEpisodesStatus(STATUS.FETCH_EPISODES.FOUND_EPISODES));
      }
    },
    (e) => {
      log(`${STATUS.FETCH_EPISODES.ERROR} : ${e}`);
      dispatch(setFetchEpisodesStatus(STATUS.FETCH_EPISODES.ERROR));
    },
  );
};
