import listReducer from './list';
import listRankingsReducer from './listRankings';
import authReducer from './auth';
import entriesReducer from './entries';
import { combineReducers } from 'redux';

export default combineReducers({
  list: listReducer,
  listRankings: listRankingsReducer,
  auth: authReducer,
  entries: entriesReducer,
});
