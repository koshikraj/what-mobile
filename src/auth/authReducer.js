import {
  LOGIN,
  LOGIN_SUCCESSFUL,
  LOGIN_FAILED,
  LOGOUT,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED
} from './authActions'

const INITIAL_STATE = {
  user: {},
  accessToken: '',
  isChecking: false,
  isAuthenticated: false,
  isLoggingOut: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case LOGIN:
      return {...state, isChecking: true}
    case LOGIN_SUCCESSFUL:
      return {...state, ...action.payload, isAuthenticated: true, isChecking: false}
    case LOGIN_FAILED:
      return {...state, isAuthenticated: false, isChecking: false}
    case LOGOUT:
      return {...state, isLoggingOut: true}
    case LOGOUT_SUCCESS:
      return INITIAL_STATE
    case LOGOUT_FAILED:
      return {...state, isLoggingOut: false}
    default:
      return state
  }
}