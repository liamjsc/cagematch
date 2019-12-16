import * as actionTypes from '../util/actionTypes';

const initialState = {
  user: null, // { email, id, username }
}

export default function authReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.SET_USER:
      console.log('set user', action);
      return {
        ...state,
        user: action.user,
      };
    default:
      return state;
  }
}
