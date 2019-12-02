import * as actionTypes from '../util/actionTypes';

const initialState = {
  loaded: false,
  loading: false,
}

export default function listReducer(state = initialState, action = {}) {
  console.log('reducer', action);
  switch (action.type) {
    case actionTypes.LIST_LOADED:
      return {
        ...state,
        loaded: true,
      };
    default:
      return state;
  }
}