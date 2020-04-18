import * as actionTypes from '../util/actionTypes';

const initialState = {
  byId: {},
}

export default function usersReducer(state = initialState, action = {}) {
  switch (action.type) {
    case actionTypes.LOAD_USER_SUCCESS:
      const { user = {} } = action;
      return {
        byId: {
          ...state.byId,
          [user.id]: { ...user },
        },
      };
    case actionTypes.UPDATE_LOCAL_SCORE:
      return {
        byId: {
          ...state.byId,
          [action.userId]: {
            ...state.byId[action.userId],
            listStats: {
              ...state.byId[action.userId].listStats,
              [action.listId]: {
                ...state.byId[action.userId].listStats[action.listId],
                matchup_count: ((state.byId[action.userId].listStats[action.listId] || {}).matchup_count || 0) + 1,
              }
            }
          }
        }
      }
    default:
      return state;
  }
}