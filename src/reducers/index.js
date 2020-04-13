import listReducer from './list';
// import listRankingsReducer from './listRankings';
import userRankingsReducer from './userRankings';
import authReducer from './auth';
import usersReducer from './users';
import entriesReducer from './entries';
import { combineReducers } from 'redux';

export default combineReducers({
  list: listReducer,
  // listRankings: listRankingsReducer,
  userRankings: userRankingsReducer,
  auth: authReducer,
  users: usersReducer,
  entries: entriesReducer,
});
