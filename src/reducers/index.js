import listReducer from './list';
import listRankingsReducer from './listRankings';
import { combineReducers } from 'redux';

export default combineReducers({
  list: listReducer,
  listRankings: listRankingsReducer,
});
