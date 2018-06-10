import { 
  GET_QUESTION, 
  GET_QUESTION_SUCCESS, 
  GET_QUESTION_FAILED 
} from './questionActions'

export const INITIAL_STATE = {
  question: {},
  isFetching: false,
  error: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case GET_QUESTION:
      return {...INITIAL_STATE, isFetching: true, error: false}
    case GET_QUESTION_SUCCESS:
      return {...state, ...action.payload, isFetching: false}
    case GET_QUESTION_FAILED:
      return {...state, isFetching: false, error: true}
    default:
      return state
  }
}