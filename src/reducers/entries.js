import * as actionTypes from '../util/actionTypes';

const initialState = {
  byId: {},
}

export default function entriesReducer(state = initialState, action = {}) {
  // console.log('reducer', action);
  switch (action.type) {
    case actionTypes.INSERT_ENTRIES:
      const { entries = {} } = action;

      console.log('inserting', entries);
      return {
        byId: {
          ...state.byId,
          ...entries,
        },
      };
    default:
      return state;
  }
}