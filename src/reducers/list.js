import * as actionTypes from '../util/actionTypes';

const initialState = {
  loaded: false,
  loading: false,
  listIds: [],
  byId: {},
}

export default function listReducer(state = initialState, action = {}) {
  // console.log('reducer', action);
  switch (action.type) {
    case actionTypes.LOAD_ALL_LISTS_START:
      return {
        ...state,
        loading: true,
        loaded: false,
      };
    case actionTypes.LOAD_ALL_LISTS_SUCCESS:
      return {
        ...state,
        loading: false,
        loaded: true,
        listIds: action.listIds,
        byId: action.byId,
      };
      case actionTypes.LOAD_ALL_LISTS_FAIL:
        return {
          ...state,
          loading: false,
          loaded: false,
        };
      case actionTypes.ADD_LIST:
        const newState = {
          ...state,
          listIds: [...state.listIds, action.list.id],
          byId: {
            ...state.byId,
            [action.list.id]: {
              ...action.list,
              entries: action.entries,
            },
          }
        }
        return newState;
    default:
      return state;
  }
}