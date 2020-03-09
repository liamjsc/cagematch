import * as actionTypes from '../util/actionTypes';
import { api } from '../config'
import { AsyncStorage } from 'react-native';

/**
 * return user object or null
 */
export async function getUserFromDevice() {
  console.log('getUserFromDevice');
  const userString = await AsyncStorage.getItem('user');
  console.log(userString);
  return userString ? JSON.parse(userString) : null;;
}

export function setUser(user) {
  console.log('setUser action', user);
  return {
    type: actionTypes.SET_USER,
    user,
  };
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
      .then(async results => {
        console.log('api register response');
        console.log(results);
        await AsyncStorage.setItem('user', JSON.stringify(results)); // who is the user of this device
        return dispatch(setUser(results));
      })
      .catch(error => {
        console.log('error register');
        console.log(error);
        return Promise.reject(error);
      });
  }
}

export function login(credentials) {
  return function (dispatch, getState) {
    const url = `${api}/users/login`;
    console.log(url, 'post', credentials);
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(data => data.json())
      .then(async results => {
        await AsyncStorage.setItem('user', JSON.stringify(results)); // who is the user of this device
        dispatch(setUser(results))
        return results;
      })
      .catch(error => {
        console.log('error login action');
        console.log(error);
        return Promise.reject(error);
      });
  }
}

export function signOut() {
  return async function (dispatch, getState) {
    console.log('signing out');
    await AsyncStorage.removeItem('user', () => {
      return dispatch(setUser(null));
    });
  };
}

export function getExclusions() {
  return function(dispatch, getState) {
    const { auth } = getState();
    if (!auth.user) return;

    const { user: userId } = auth;
    const url = `${api}/exclusion/${userId}`;
    return fetch(url)
      .then(response => response.json())
      .then(exclusions => {
        dispatch({
          type: actionTypes.SET_EXCLUSIONS,
          exclusions,
        });
      });
  }
}

export function exclude({ listId, entryIds }) {
  return function(dispatch, getState) {
    const { auth: { user: { id: userId } } } = getState();
    const exclusion = {
      listId,
      entryIds,
      userId,
    };
    const url = `${api}/exclusion`;
    console.log('exclude action', exclusion);

    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(exclusion),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(() => {
      dispatch({
        type: actionTypes.PUSH_EXCLUSIONS,
        listId,
        entryIds,
      })
    })  
  }
}