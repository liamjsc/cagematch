import * as actionTypes from '../util/actionTypes';
import { api } from '../config'

export function loadUser(userId) {
  console.log('action - loadUser', userId);
  return (dispatch, getState) => {
    // const { auth: { user: { id: userId } } } = getState();
    const url = `${api}/user/${userId}`;
    return fetch(url)
      .then(data => {
        if (!data.ok) return Promise.reject('error in loadUser action', data);
        return data.json();
      })
      .then((user) => {
        dispatch({ type: actionTypes.LOAD_USER_SUCCESS, user });
        return user;
      })
      .catch(error => {
        console.log(error);
        return Promise.reject(error);
      })
  }
}
