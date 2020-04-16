import * as actionTypes from '../util/actionTypes';

const initialState = {
  loaded: false,
  loading: false,
  listIds: [],
  byId: {},
}

export default function listReducer(state = initialState, action = {}) {
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
            },
          }
        }
        return newState;
      case actionTypes.INCREMENT_VOTER_COUNT:
        console.log('incrementing voter count');
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.listId]: {
              ...state.byId[action.listId],
              voterCount: (state.byId[action.listId].voterCount || 0) + 1,
            }
          }
        }
      case actionTypes.UPDATE_LOCAL_SCORE:
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.listId]: {
              ...state.byId[action.listId],
              matchupCount: (state.byId[action.listId].matchupCount || 0) + 1,
            }
          }
        }
      case actionTypes.PUSH_NEW_ENTRIES:
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.listId]: {
              ...state.byId[action.listId],
              entries: [
                ...state.byId[action.listId].entries,
                ...action.entryIds,
              ]
            }
          }
        }
      case actionTypes.DELETE_ENTRY:
        return {
          ...state,
          byId: {
            ...state.byId,
            [action.listId]: {
              ...state.byId[action.listId],
              entries: state.byId[action.listId].entries.filter(id => id !== action.entryId)
            }
          }
        }
    default:
      return state;
  }
}
