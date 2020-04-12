import * as actionTypes from '../util/actionTypes';

const initialState = {
  byId: {},
}

export default function entriesReducer(state = initialState, action = {}) {
  // console.log('reducer', action);
  switch (action.type) {
    case actionTypes.INSERT_ENTRIES:
      const { entries = {} } = action;
      return {
        byId: {
          ...state.byId,
          ...entries,
        },
      };
    case actionTypes.SET_IMAGE:
      return {
        byId: {
          ...state.byId,
          [action.entryId]: {
            ...state.byId[action.entryId],
            image: action.iamge,
          },
        },
      };
    default:
      return state;
  }
}
