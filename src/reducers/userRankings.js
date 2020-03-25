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
            records: action.records,
          }
        }
      };
    case actionTypes.UPDATE_LOCAL_SCORE:
      const copyRankings = state[action.userId][action.listId].rankings.slice();
      const initialRecords = state[action.userId][action.listId].records;
      const newRecords = {
        ...state[action.userId][action.listId].records,
        [action.winner]: {
          ...initialRecords[action.winner],
          score: initialRecords[action.winner].score += action.winnerDiff,
          winCount: initialRecords[action.winner].winCount += 1,
        },
        [action.loser]: {
          ...initialRecords[action.loser],
          score: initialRecords[action.loser].score += action.loserDiff,
          lossCount: initialRecords[action.loser].lossCount += 1,
        },
      }
      const newRankings = copyRankings.sort((a, b) => {
        return newRecords[b].score - newRecords[a].score;
      });
      return {
        ...state,
        [action.userId]: {
          ...state[action.userId],
          [action.listId]: {
            rankings: newRankings,
            records: newRecords,
          }
        }
      }
    default:
      return state;
  }
}
