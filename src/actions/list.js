import * as actionTypes from '../util/actionTypes';
import { api } from '../config'
import { devLists, devList } from '../util/devData';

import { insertEntries } from '../actions/entries';

const dev = false;

/**load all lists without sorted entries */
export function loadAllLists(user) {
  return (dispatch, getState) => {
    console.log('load all lists', api);
    dispatch(loadAllListsStart());
    return fetch(`${api}/lists`)
      .then(response => response.json())
      .then(data => {
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

function loadAllListsSuccess(lists) {
  const byId = {};
  const listIds = lists.map(list => {
    console.log(list.title, typeof list.title);
    if (list.title) {
      byId[list.id] = list;
      return list.id;
    }
  }).filter(Boolean);

  return {
    type: actionTypes.LOAD_ALL_LISTS_SUCCESS,
    listIds,
    byId,
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
      .then(response => response.json())
      .then(({ list, entryIdMap }) => {
        console.log('list response:', list, entryIdMap);
        dispatch(insertEntries(entryIdMap));
        dispatch(loadListSuccess(list));
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
  console.log('create list');
  console.log(list);
  return (dispatch) => {
    const url = `${api}/lists`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(list),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(data => data.json())
      .then((results) => dispatch(addList(results)))
      .catch(error => {
        console.log(error);
        return Promise.reject();
      })
  }
}

function addList({ list, entries }) {
  return {
    type: actionTypes.ADD_LIST,
    list,
    entries,
  }
}

export function fetchUserListRankings({ userId, listId }) {
  return (dispatch, getState) => {
    console.log('##inside fetchUserListRankings action');
    const url = `${api}/user/${userId}/list/${listId}`;
    console.log(url);
    return fetch(url)
      .then(response => {
        console.log('## got raw response');
        console.log(response);
        return response.json();
      })
      .then(({ rankings, records }) => {
        console.log('##got response');

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