import * as actionTypes from '../util/actionTypes';
import { api } from '../config'

const Elo = require('arpad');
const elo = new Elo({
  default: 32,
});

function findDiff(winnerScore, loserScore) {
  console.log(winnerScore, loserScore);
  const newWinner = elo.newRatingIfWon(winnerScore, loserScore);
  const newLoser = elo.newRatingIfLost(loserScore, winnerScore);
  
  const winnerDiff = newWinner - winnerScore;
  const loserDiff = newLoser - loserScore;
  return [winnerDiff, loserDiff];
}

export function postMatchup(matchupDetails) {
  return function (dispatch, getState) {
    console.log(url, 'post', matchupDetails);
    const { winner, loser, userId, listId } = matchupDetails;
    const { userRankings } = getState();

    // update local
    const { rankings, records } = userRankings[userId][listId];
    const winnerScore = records[winner].score;
    const loserScore = records[loser].score;
    const [winnerDiff, loserDiff] = findDiff(winnerScore, loserScore)
    const action = {
      type: actionTypes.UPDATE_LOCAL_SCORE,
      winner,
      loser,
      userId,
      winnerDiff,
      loserDiff,
      listId,
    };
    dispatch(action);

    // update server
    const url = `${api}/matchups`;
    return fetch(url, {
      method: 'POST',
      body: JSON.stringify(matchupDetails),
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .catch(error => {
      console.log('error post matchup');
      console.log(error);
      return Promise.reject(error);
    });
  }
}
