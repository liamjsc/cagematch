import * as actionTypes from '../util/actionTypes';

export function insertEntries(entryIdMap) {
  return function (dispatch, getState) {
    console.log('insertEntries');
    console.log(entryIdMap);
    dispatch({
      type: actionTypes.INSERT_ENTRIES,
      entries: entryIdMap,
    });
  }
}
