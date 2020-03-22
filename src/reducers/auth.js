import * as actionTypes from '../util/actionTypes';

const initialState = {
  user: null, // { email, id, username }
  authStatusResolved: false,
  exclusions: {} // { [listId]: [array of entryIds ]}
}

export default function authReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.SET_USER:
      console.log('set user reducer', action);
      return {
        ...state,
        user: (action.user) ? { ...action.user } : null, // null is valid here
        authStatusResolved: true,
      };
    case actionTypes.SET_EXCLUSIONS:
      return {
        ...state,
        exclusions: {
          ...state.exclusions,
          ...action.exclusions,
        },
      };
    case actionTypes.PUSH_EXCLUSIONS:
      return {
        ...state,
        exclusions: {
          ...state.exclusions,
          [action.listId]: [
            ...(state.exclusions[action.listId] || []),
            ...action.entryIds,
          ],
        },
      }
    default:
      return state;
  }
}
