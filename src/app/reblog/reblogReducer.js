import { REBLOG, REBLOG_SUCCESS } from './reblogActions'

const INITIAL_STATE = {
  reblogList: [],
  pending: null
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case REBLOG:
      return {...state, ...action.payload}
    case REBLOG_SUCCESS:
      return {...state, ...action.payload, pending: null}
    default:
    return state
  }
}