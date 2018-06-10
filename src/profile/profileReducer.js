import { 
  GET_PROFILE,
  UPDATE_PROFILE
} from './profileActions'

const INITIAL_STATE = {
  followers: 0,
  following: 0,
  isFollowing: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case UPDATE_PROFILE:
      return {...state, ...action.payload}
    default:
      return state
  }
}
