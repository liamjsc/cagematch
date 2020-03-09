import * as actionTypes from '../util/actionTypes';

const initialState = {}
/**
 * { 
 *   [userId]: {
 *     [listId]: {
 *       rankings: [] // array of id's in order
 *       score: {} // map of ID to score
 *     }
 * array of { id, score }
 *   }
 * }
 */

export default function userRankingsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.SET_USER_LIST_RANKINGS:
      return {
        ...state,
        [action.userId]: {
          ...state[action.userId],
          [action.listId]: {
            rankings: action.rankings,
            scores: action.scores,
          }
        }
      };
    case actionTypes.UPDATE_LOCAL_SCORE:
      const copyRankings = state[action.userId][action.listId].rankings.slice();
      const initialScores = state[action.userId][action.listId].scores;
      const newScores = {
        ...state[action.userId][action.listId].scores,
        [action.winner]: initialScores[action.winner] += action.winnerDiff,
        [action.loser]: initialScores[action.loser] += action.loserDiff,
      }
      const newRankings = copyRankings.sort((a, b) => {
        return newScores[b] - newScores[a];
      });
      return {
        ...state,
        [action.userId]: {
          ...state[action.userId],
          [action.listId]: {
            rankings: newRankings,
            scores: newScores,
          }
        }
      }
    default:
      return state;
  }
}
