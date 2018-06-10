import { FOLLOW, FOLLOW_SUCCESS, FOLLOW_FAILED } from './followActions'

const INITIAL_STATE = {
  following: [],
  pending: null
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case FOLLOW:
      return {...state, ...action.payload}
    case FOLLOW_SUCCESS:
      return {...state, ...action.payload, pending: null}
    case FOLLOW_FAILED:
      return {...state, pending: null}
    default:
      return state
  }
}