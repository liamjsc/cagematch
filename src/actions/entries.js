import * as actionTypes from '../util/actionTypes';
import { api } from '../config'

export function insertEntries(entryIdMap) {
  return function (dispatch, getState) {
    dispatch({
      type: actionTypes.INSERT_ENTRIES,
      entries: entryIdMap,
    });
  }
}

export function postImage({ entryId, image }) {
  return function (dispatch, getState) {
    const body = {
      entryId,
      imageUrl: image,
    };
    console.log('POSTING SET IMAGE', body);
    const url = `${api}/entry/image`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(() => {
      dispatch({ type: actionTypes.SET_IMAGE, entryId, image });
      return Promise.resolve();
    });
  };
}