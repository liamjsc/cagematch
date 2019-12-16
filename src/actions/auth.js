import * as actionTypes from '../util/actionTypes';
import { api } from '../config'

function setUser(user) {
  return { type: actionTypes.SET_USER, user };
}

/**
 * 
 * @param {username, password, email} credentials 
 */
export function createAccount(credentials) {
  return function (dispatch, getState) {
    const url = `${api}/users/register`;
    console.log(url, 'post', credentials);
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(data => data.json())
      .then(results => {
        console.log('api register response');
        console.log(results);
        return dispatch(setUser(results));
      })
      .catch(error => {
        console.log('error register');
        console.log(error);
      });
  }
}

export function login(credentials) {
  
}