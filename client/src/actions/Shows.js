import * as types from "./ActionTypes";
import * as STATUS from "./ActionStatuses";
import { loadEpisodes, removeEpisodesForShow } from "./Episodes";
import * as server from "../util/ServerInterface";

//load
export const loadShows = () => {
  return dispatch => {
    dispatch(setLoadShowsStatus(STATUS.LOAD_SHOWS.IN_PROGRESS));

    server.loadShows(
      data => {
        if (data.length === 0) {
          dispatch(setLoadShowsStatus(STATUS.LOAD_SHOWS.NO_SHOWS_FOUND));
        } else {
          dispatch(showsLoaded(data));
          dispatch(setLoadShowsStatus(STATUS.LOAD_SHOWS.FOUND_SHOWS));
          dispatch(loadEpisodes(data));
        }
      },
      () => {
        dispatch(setLoadShowsStatus(STATUS.LOAD_SHOWS.ERROR));
      }
    );
  };
};

export const setLoadShowsStatus = status => ({
  type: types.SET_LOAD_SHOWS_STATUS,
  status
});

export const showsLoaded = shows => ({
  type: types.SHOWS_LOADED,
  shows
});

//add
export const addShow = show => {
  return dispatch => {
    dispatch(setAddShowStatus(STATUS.ADD_SHOW.IN_PROGRESS));

    server.addShow(
      show,
      data => {
        dispatch(showAdded(data));
        dispatch(setAddShowStatus(STATUS.ADD_SHOW.COMPLETED));
        dispatch(loadEpisodes([data]));
      },
      () => {
        dispatch(setAddShowStatus(STATUS.ADD_SHOW.ERROR));
      }
    );
  };
};

export const setAddShowStatus = status => ({
  type: types.SET_ADD_SHOW_STATUS,
  status
});

export const showAdded = show => ({
  type: types.SHOW_ADDED,
  show
});

//remove
export const removeShow = id => {
  return dispatch => {
    dispatch(setRemoveShowStatus(STATUS.REMOVE_SHOW.IN_PROGRESS));

    server.removeShow(
      id,
      data => {
        dispatch(showRemoved(data));
        dispatch(setRemoveShowStatus(STATUS.REMOVE_SHOW.COMPLETED));
        dispatch(removeEpisodesForShow(id));
      },
      () => {
        dispatch(setRemoveShowStatus(STATUS.REMOVE_SHOW.ERROR));
      }
    );
  };
};

export const setRemoveShowStatus = status => ({
  type: types.SET_REMOVE_SHOW_STATUS,
  status
});

export const showRemoved = id => ({
  type: types.SHOW_REMOVED,
  id
});
