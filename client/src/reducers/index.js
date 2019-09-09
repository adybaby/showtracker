import { combineReducers } from "redux";
import { showReducer, fetchShowsStatusReducer } from "./ShowReducer";
import {
  episodeReducer,
  fetchEpisodesStatusReducer,
  episodeFilterReducer
} from "./EpisodeReducer";

const rootReducer = combineReducers({
  shows: showReducer,
  fetchShowsStatus: fetchShowsStatusReducer,
  episodes: episodeReducer,
  fetchEpisodesStatus: fetchEpisodesStatusReducer,
  episodeFilter: episodeFilterReducer
});

export default rootReducer;
