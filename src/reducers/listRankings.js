import * as actionTypes from '../util/actionTypes';

const initialState = {}
/**
 * { 
 *   listId: {
 *     loading,
 *     loaded,
 *     error,
 *     children, (array of ID's)
 *   }
 * }
 */

export default function listRankingsReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.LOAD_LIST_START:
      return {
        ...state,
        [action.id]: {
          loading: true,
          loaded: false,
          error: null,
        },
      };
    case actionTypes.LOAD_LIST_SUCCESS:
      const { data: list } = action;
      console.log('LOAD_LIST_SUCCESS===listRankings');
      console.log(action);
      console.log(list);
      return {
        ...state,
        [list.id]: {
          loading: false,
          loaded: true,
          error: null,
          ...list,
        },
      };
    case actionTypes.LOAD_LIST_FAIL:
      return {
        ...state,
        [action.id]: {
          loading: false,
          loaded: false,
          error: action.error
        },
      };
    default:
      return state;
  }
}
