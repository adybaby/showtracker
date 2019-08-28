import { combineReducers } from "redux";
import { showReducer, loadShowsStatusReducer } from "./ShowReducer";
import {
  episodeReducer,
  loadEpisodesStatusReducer
} from "./EpisodeReducer";

const rootReducer = combineReducers({
  shows: showReducer,
  episodes: episodeReducer,
  loadShowsStatus: loadShowsStatusReducer,
  loadEpisodesStatus: loadEpisodesStatusReducer,
});

export default rootReducer;
