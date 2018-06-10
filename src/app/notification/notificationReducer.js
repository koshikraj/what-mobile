import {
 GET_NOTIFICATION,
 CLEAR_NOTIFICATION
} from './notificationActions'

const INITIAL_STATE = {
  unreadNotifications: 0
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case GET_NOTIFICATION: 
      return {...state, ...action.payload}
    case CLEAR_NOTIFICATION:
      return INITIAL_STATE
    default:
      return state
  }
}