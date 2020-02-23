import * as actionTypes from '../util/actionTypes';
import { api } from '../config'
import { AsyncStorage } from 'react-native';

/**
 * return user object or null
 */
export async function getUserFromDevice() {
  console.log('getUserFromDevice');
  const userString = await AsyncStorage.getItem('user');
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