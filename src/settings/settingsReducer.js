import { GET_SETTINGS, SET_SETTINGS, RESET_SETTINGS, GET_CONVERSIONS } from './settingsActions'

const INITIAL_STATE = {
  votePercent: 10000,
  currency: 'USD',
  USDGBP: '0.75',
  USDEUR: '0.81'
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case GET_SETTINGS:
    case GET_CONVERSIONS:
      return {...state, ...action.payload}
    case SET_SETTINGS:
      return {...state, [action.payload.prop]: action.payload.value}
    case RESET_SETTINGS:
      return INITIAL_STATE
    default:
      return state
  }
}