import * as TYPES from "../actions/ActionTypes";
import * as STATUS from "../actions/ActionStatuses";

export const showReducer = (state = [], action) => {
  switch (action.type) {
    case TYPES.SHOW_ADDED:
      return [...state, { id: action.show.id + "", name: action.show.name }];
    case TYPES.SHOW_REMOVED:
      return state.filter(show => show.id !== action.id);
    case TYPES.SHOWS_LOADED:
      return action.shows;
    default:
      return state;
  }
};

export const loadShowsStatusReducer = (state=STATUS.LOAD_SHOWS.INITIAL, action) => {
  switch (action.type) {
    case TYPES.SET_LOAD_SHOWS_STATUS:
        return action.status;
    default:
        return state;
  }
};
