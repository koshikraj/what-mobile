import { 
  VOTE, 
  VOTE_SUCCESS, 
  VOTE_ERROR, 
  VOTE_REFRESH_COMPLETE,
  VOTE_ADD,
  VOTE_CLEAR
} from './voteActions'

const INITIAL_STATE = {
  upvotedList: [],
  downvotedList: [],
  pending: null
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case VOTE: 
    case VOTE_SUCCESS:
      return {...state, ...action.payload}
    case VOTE_ERROR:
    case VOTE_REFRESH_COMPLETE:
      return {...state, pending: null}
    case VOTE_ADD:
      return {
        ...state, 
        upvotedList: [...state.upvotedList, ...action.payload.upvotes], 
        downvotedList: [...state.downvotedList, ...action.payload.downvotes]
      }
    case VOTE_CLEAR:
      return INITIAL_STATE
    default:
      return state
  }
}