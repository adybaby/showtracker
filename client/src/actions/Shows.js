import * as STATUS from "../constants/ActionStatuses";
import * as types from "../constants/ActionTypes";
import { log } from "../util/Logger";
import * as server from "../util/ServerInterface";
import { fetchEpisodes, removeEpisodesForShow } from "./Episodes";

//load
export const fetchShows = user => {
  return dispatch => {
    dispatch(setFetchShowsStatus(STATUS.FETCH_SHOWS.IN_PROGRESS));

    server.shows(
      user,
      data => {
        if (data.length === 0) {
          dispatch(setFetchShowsStatus(STATUS.FETCH_SHOWS.NO_SHOWS_FOUND));
        } else { 
          dispatch(showsFetched(data));
          dispatch(setFetchShowsStatus(STATUS.FETCH_SHOWS.FOUND_SHOWS));
          dispatch(fetchEpisodes(data));
        }
      },
      (e) => {
        log(STATUS.FETCH_SHOWS.ERROR + " : " + e);        
        dispatch(setFetchShowsStatus(STATUS.FETCH_SHOWS.ERROR));
      }
    );
  };
};

export const setFetchShowsStatus = status => ({
  type: types.SET_FETCH_SHOWS_STATUS,
  status
});

export const showsFetched = shows => ({
  type: types.SHOWS_FETCHED,
  shows
});

//add
export const addShow = (user, show) => {
  return dispatch => {
    dispatch(setAddShowStatus(STATUS.ADD_SHOW.IN_PROGRESS));

    server.addShow(
      user,
      show,
      data => {
        dispatch(showAdded(data));
        dispatch(setAddShowStatus(STATUS.ADD_SHOW.COMPLETED));
        dispatch(fetchEpisodes([data]));
      },
      (e) => {
        log(STATUS.FETCH_SHOWS.ERROR + " : " + e);            
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
export const removeShow = (user, id) => {
  return dispatch => {
    dispatch(setRemoveShowStatus(STATUS.REMOVE_SHOW.IN_PROGRESS));

    server.removeShow(
      user,
      id,
      data => {
        console.log(data);
        dispatch(showRemoved(data));
        dispatch(setRemoveShowStatus(STATUS.REMOVE_SHOW.COMPLETED));
        dispatch(removeEpisodesForShow(id));
      },
      (e) => {
        log(STATUS.FETCH_SHOWS.ERROR + " : " + e);            
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
