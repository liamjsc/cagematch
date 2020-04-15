import * as actionTypes from '../util/actionTypes';
import { api } from '../config'
import { devLists, devList } from '../util/devData';

import { insertEntries } from '../actions/entries';

const dev = false;

/**load all lists without sorted entries */
export function loadAllLists() {
  return (dispatch, getState) => {
    console.log('load all lists', api);
    dispatch(loadAllListsStart());
    return fetch(`${api}/lists`)
      .then(response => response.json())
      .then(data => {
        // data is { listIds, listIdMap, entryIdMap }
        console.log('load all lists, now insert entries');
        dispatch(insertEntries(data.entryIdMap));
        dispatch(loadAllListsSuccess(data));
      })
      .catch((err) => {
        console.log(err);
        if (dev) return dispatch(loadAllListsSuccess(devLists))
        console.log(err);
        dispatch(loadAllListsFail());
      });
  }
}

function loadAllListsStart() {
  return { type: actionTypes.LOAD_ALL_LISTS_START };
}

function loadAllListsSuccess({ listIds, listIdMap }) {
  return {
    type: actionTypes.LOAD_ALL_LISTS_SUCCESS,
    listIds,
    byId: listIdMap,
  };
}

function loadAllListsFail() {
  return { type: actionTypes.LOAD_ALL_LISTS_FAIL };
}

/**
 * load single list by id with entries sorted
 */
export function loadList(id) {
  console.log('load list', id);
  return (dispatch, getState) => {
    dispatch(loadListStart(id));
    return fetch(`${api}/lists/${id}`)
      .then(response => {
        if (!response.ok) {
          console.log('error fetching list')
          return Promise.reject(response);
        }
        return response.json();
      })
      .then(({ listIdMap, entryIdMap }) => {
        // new format
        dispatch(insertEntries(entryIdMap));
        dispatch(loadListSuccess(listIdMap[id]));
      })
      .catch((err) => {
        console.log('LOADLISTFAIL');
        console.log(err);
        dispatch(loadListFail(id));
      });
  }
}

function loadListStart(id) {
  return { type: actionTypes.LOAD_LIST_START, id };
}

function loadListSuccess(data) {
  return { type: actionTypes.LOAD_LIST_SUCCESS, data };
}

function loadListFail(id) {
  return { type: actionTypes.LOAD_LIST_FAIL, id };
}

export function createList(list) {
  return (dispatch, getState) => {
    const { auth: { user: { id: userId } } } = getState();
    const body = {
      ...list,
      userId,
    };
    console.log('POSTING CREATE LIST', body);
    const url = `${api}/lists`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(data => data.json())
      .then((results) => {
        return dispatch(addList(results))
          .then(() => {
            return results;
          });
      })
      .catch(error => {
        console.log(error);
        return Promise.reject();
      })
  }
}

function addList({ list, entries }) {
  return function (dispatch) {
    const entryIdMap = {};
    const entryIds = entries.map(entry => {
      entryIdMap[entry.id] = entry;
      return entry.id;
    });
  
    dispatch(insertEntries(entryIdMap));
    dispatch({
      type: actionTypes.ADD_LIST,
      list: { ...list, entries: entryIds },
    });
    return Promise.resolve();
  }
}

export function fetchUserListRankings({ userId, listId }) {
  return (dispatch, getState) => {
    const url = `${api}/user/${userId}/list/${listId}`;
    return fetch(url)
      .then(response => {
        if (!response.ok) return Promise.reject(response);
        return response.json();
      })
      .then(({ rankings, records }) => {
        dispatch({
          type: actionTypes.SET_USER_LIST_RANKINGS,
          userId,
          listId,
          rankings,
          records,
        });      
      })
      .catch((err) => {
        console.log(err);
        return Promise.reject(err);
      });
  };
}