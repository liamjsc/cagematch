import * as actionTypes from '../util/actionTypes';

export function insertEntries(entries) {
  return function (dispatch, getState) {
    console.log('insertEntries');
    console.log(entries);
    dispatch({
      type: actionTypes.INSERT_ENTRIES,
      entries,
    });
  }
}
