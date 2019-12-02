import * as actionTypes from '../util/actionTypes';
import { api } from '../config'

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
