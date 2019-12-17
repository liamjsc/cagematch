import * as actionTypes from '../util/actionTypes';
import { api } from '../config'

/**
 * 
 * @param {username, password, email} credentials 
 */
export function postMatchup(matchupDetails) {
  return function (dispatch, getState) {
    const url = `${api}/matchups`;
    console.log(url, 'post', matchupDetails);
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(matchupDetails),
      headers: {
        'Content-Type': 'application/json'
      },
    })
      // .then(data => data.json())
      .catch(error => {
        console.log('error post matchup');
        console.log(error);
        return Promise.reject(error);
      });
  }
}
