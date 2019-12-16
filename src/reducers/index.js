import listReducer from './list';
import listRankingsReducer from './listRankings';
import authReducer from './auth';
import { combineReducers } from 'redux';

export default combineReducers({
  list: listReducer,
  listRankings: listRankingsReducer,
  auth: authReducer,
});
