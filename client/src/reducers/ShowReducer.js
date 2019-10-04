import * as STATUS from "../constants/ActionStatuses";
import * as TYPES from "../constants/ActionTypes";

export const showReducer = (state = [], action) => {
  switch (action.type) {
    case TYPES.SHOW_ADDED:
      return [...state, { id: action.show.id + "", name: action.show.name }];
    case TYPES.SHOW_REMOVED:
      return state.filter(show => show.id !== action.id);
    case TYPES.SHOWS_FETCHED:
      return action.shows;
    default:
      return state;
  }
};

export const fetchShowsStatusReducer = (state=STATUS.FETCH_SHOWS.INITIAL, action) => {
  switch (action.type) {
    case TYPES.SET_FETCH_SHOWS_STATUS:
        return action.status;
    default:
        return state;
  }
};
