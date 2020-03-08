import * as actionTypes from '../util/actionTypes';

const initialState = {}
/**
 * { 
 *   [userId]: {
 *     [listId]: array of { id, score }
 *   }
 * }
 */

export default function listRankingsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.SET_USER_LIST_RANKINGS:
      return {
        ...state,
        [action.userId]: {
          ...state[action.userId],
          [action.listId]: action.items
        }
      };
    default:
      return state;
  }
}
