import { combineReducers } from 'redux';
import {
  episodeFilterReducer, episodeReducer, fetchEpisodesStatusReducer, showFilterReducer
} from './EpisodeReducer';
import { fetchShowsStatusReducer, showReducer } from './ShowReducer';

const rootReducer = combineReducers({
  shows: showReducer,
  fetchShowsStatus: fetchShowsStatusReducer,
  episodes: episodeReducer,
  fetchEpisodesStatus: fetchEpisodesStatusReducer,
  episodeFilter: episodeFilterReducer,
  showFilter: showFilterReducer
});

export default rootReducer;
