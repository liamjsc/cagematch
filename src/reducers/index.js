import listReducer from './list';
import { combineReducers } from 'redux';

export default combineReducers({
  list: listReducer,
});
