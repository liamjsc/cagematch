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

export function postNewEntries({ listId, entries }) {
  return function (dispatch, getState) {
    const { auth: { user: { id: userId } } } = getState();
    
    const body = entries.map(({ title, image }) => {
      return { image, title, userId };
    });
    console.log('POSTING NEW ENTRIES', listId, body);
    const url = `${api}/entries/${listId}`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((data) => {
      if (!data.ok) return Promise.reject('api error');
      return data.json();
    }).then(newEntries => {
      const idMap = {};
      const entryIds = newEntries.map(entry => {
        idMap[entry.id] = entry;
        return entry.id;
      });
      dispatch(insertEntries(idMap));
      dispatch({ type: actionTypes.PUSH_NEW_ENTRIES, entryIds, listId })
      return Promise.resolve(entryIds);
    });
  }
}

export function deleteEntry({ entryId, listId }) {
  return function (dispatch, getState) {
    console.log('DELETING ENTRY', entryId);
    const url = `${api}/entry/${entryId}`;
    return fetch(url, {
      method: 'DELETE',
    })
    .then((response) => {
      if (!response.ok) return Promise.reject();
      dispatch({ type: actionTypes.DELETE_ENTRY, entryId, listId });
      return Promise.resolve();
    });
  };
}
