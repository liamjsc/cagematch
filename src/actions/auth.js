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
      .then(data => {
        if (!data.ok) {
          const error = 'Auth Error';
          return Promise.reject(error);
        }
        return data.json();
      })
      .then(async results => {
        console.log('api register response');
        console.log(results);
        const { id, username, email } = results;
        await AsyncStorage.setItem('user', JSON.stringify({ id, username, email })); // who is the user of this device
        const action = { type: actionTypes.LOAD_USER_SUCCESS, user: results };
        dispatch(action);
        return dispatch(setUser({ id, username, email }));
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
    console.log('loginaction');
    const url = `${api}/users/login`;
    console.log(url, 'post', credentials);
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(data => {
        if (!data.ok) {
          const error = 'Auth Error';
          return Promise.reject(error);
        }
        return data.json();
      })
      .then(async results => {
        console.log('loginaction login results...');
        console.log(results);
        await AsyncStorage.setItem('user', JSON.stringify(results)); // who is the user of this device
        dispatch(setUser(results))
        const action = { type: actionTypes.LOAD_USER_SUCCESS, user: results };
        dispatch(action);
        return results;
      })
      .catch(error => {
        console.log('loginaction error login action');
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

export function getExclusions(userId) {
  return function(dispatch, getState) {
    const url = `${api}/exclusion/${userId}`;
    console.log(url)
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
    });
  }
}

export function batchUpdateExclusions(actionData) {
  const { toExclude, toInclude, listId, userId } = actionData;
  console.log('batchUpdateExclusions');
  console.log(actionData);
  return function(dispatch, getState) {
    const url = `${api}/exclusion/${listId}`;
    const data = {
      toInclude,
      toExclude,
      userId,
    }
    console.log(url,);
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(() => {
      console.log('post success!');
      const { auth: { exclusions } } = getState();
      const previousExclusions = exclusions[listId] || [];
      // remove `toInclude` from this list
      console.log('previous Exclusions');
      console.log(listId);
      console.log(previousExclusions);
      console.log('removing', toInclude);
      const newExclusions = previousExclusions.filter(oldExclusion => {
        return toInclude.indexOf(oldExclusion) < 0;
      });
      console.log(newExclusions);

      dispatch({
        type: actionTypes.SET_EXCLUSIONS,
        exclusions: {
          [listId]: newExclusions.concat(toExclude),
        }
      })
    });
  }
}