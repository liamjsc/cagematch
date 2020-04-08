import * as actionTypes from '../util/actionTypes';

export function insertEntries(entryIdMap) {
  return function (dispatch, getState) {
    dispatch({
      type: actionTypes.INSERT_ENTRIES,
      entries: entryIdMap,
    });
  }
}
