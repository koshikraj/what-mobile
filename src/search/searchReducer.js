import { SEARCH, SEARCH_SUCCESS, SEARCH_FAILED, SEARCH_EMPTY, SEARCH_CLEAR } from './searchActions'

const INITIAL_STATE = {
  searchResults: [],
  isFetching: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case SEARCH:
      return {...INITIAL_STATE, isFetching: true}
    case SEARCH_SUCCESS:
     return {...state, ...action.payload, isFetching: false}
    case SEARCH_FAILED:
     return {...state, isFetching: false}
    case SEARCH_CLEAR:
    case SEARCH_EMPTY:
     return INITIAL_STATE
    default: 
      return state
  }
}