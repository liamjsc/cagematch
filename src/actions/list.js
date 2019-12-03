import * as actionTypes from '../util/actionTypes';
import { api } from '../config'
import { devLists, devList } from '../util/devData';

const dev = true;

/**load all lists without sorted entries */
export function loadAllLists() {
  return (dispatch, getState) => {
    dispatch(loadAllListsStart());
    return fetch(`${api}/lists`)
      .then(response => response.json())
      .then(data => {
        console.log('data');
        dispatch(loadAllListsSuccess(data));
      })
      .catch((err) => {
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
  return { type: actionTypes.LOAD_ALL_LISTS_SUCCESS, lists };
}

function loadAllListsFail() {
  return { type: actionTypes.LOAD_ALL_LISTS_FAIL };
}

/**
 * load single list by id with entries sorted
 */
export function loadList(id) {
  return (dispatch) => {
    dispatch(loadListStart());
    return fetch(`${api}/lists/${id}`)
      .then(response => response.json())
      .then(data => {
        console.log('list:', data);
        dispatch(loadListSuccess(data));
      })
      .catch((err) => {
        console.log(err);
        dispatch(loadListFail());
      });
  }
}

function loadListStart() {
  return { type: actionTypes.LOAD_LIST_START };
}

function loadListSuccess(list) {
  return { type: actionTypes.LOAD_LIST_SUCCESS, list };
}

function loadListFail() {
  return { type: actionTypes.LOAD_LIST_FAIL };
}

export function createList(list = devList) {
  return (dispatch) => {
    return fetch({
      url: `${api}/lists`,
      method: 'POST',
      body: list,
    })
    .then(data => data.json())
    .catch(error => {
      dispatch(addList(list))
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