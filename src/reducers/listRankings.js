import * as actionTypes from '../util/actionTypes';

const initialState = {}

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
      console.log(action.list);
      const { list, entries } = action.data;
      return {
        ...state,
        [list.id]: {
          loading: false,
          loaded: true,
          error: null,
          rankings: entries.list,
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