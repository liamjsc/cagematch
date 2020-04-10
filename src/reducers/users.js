import * as actionTypes from '../util/actionTypes';

const initialState = {
  byId: {},
}

export default function usersReducer(state = initialState, action = {}) {
  console.log('usersReducer', action);
  switch (action.type) {
    case actionTypes.LOAD_USER_SUCCESS:
      console.log('load user success', action.user)
      const { user = {} } = action;

      console.log('inserting', user);
      return {
        byId: {
          ...state.byId,
          [user.id]: user,
        },
      };
    default:
      return state;
  }
}