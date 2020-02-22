import * as actionTypes from '../util/actionTypes';

const initialState = {
  user: null, // { email, id, username }
  authStatusResolved: false,
}

export default function authReducer(state = initialState, action = {}) {
  console.log('reducer', action, state);
  switch (action.type) {
    case actionTypes.SET_USER:
      console.log('set user', action);
      return {
        ...state,
        user: action.user || null, // null is valid here
        authStatusResolved: true,
      };
    default:
      return state;
  }
}
