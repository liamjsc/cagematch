import * as actionTypes from '../util/actionTypes';

const initialState = {
  byId: {},
}

export default function entriesReducer(state = initialState, action = {}) {
  // console.log('reducer', action);
  switch (action.type) {
    case actionTypes.INSERT_ENTRIES:
      const { entries = [] } = action;
      const entriesById = {
        ...state.byId,
      };
      entries.map(entry => entriesById[entry.id] = entry);
      return {
        ...state,
        byId: entriesById,
      };
    default:
      return state;
  }
}