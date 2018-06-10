import * as LocalStorage from '../helpers/localStorage'
import Config from '../constants/config'
import { AsyncStorage } from 'react-native'
import Toast from 'react-native-simple-toast'

export const SET_SETTINGS = "set_settings"
export const GET_SETTINGS = "get_settings"
export const GET_CONVERSIONS = "get_conversions"
export const RESET_SETTINGS = "reset_settings"

const capitalizeFirstLetter = string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const setSettings = ({prop, value}) => (dispatch, getState) => {
  const newSettings = {...getState().settings, [prop]: value}
  LocalStorage.store(Config.storageKey.settings, JSON.stringify(newSettings))
  dispatch({
    type: SET_SETTINGS,
    payload: {prop, value}
  })

  // Notification
  Toast.show(`${capitalizeFirstLetter(prop)} Saved`, Toast.SHORT)
}

export const getSettings = () => dispatch => {
  // Check if settings exist in local storage
  AsyncStorage.getItem(Config.storageKey.settings)
    .then(value => {
      const settings = JSON.parse(value)
      dispatch({ type: GET_SETTINGS, payload: settings})
      dispatch(getConversions(settings))
    })
}

  /**
   * Requires account on https://fixer.io and access key from account
   */
export const getConversions = (settings) => (dispatch) => {
  fetch('https://data.fixer.io/latest?access_key=ACCESS_KEY&base=USD&symbols=GBP,EUR')
    .then(response => response.json())
    .then(res => {
      // Return if any errors
      if(res.error) return;

      // Save data to state and local storage
      const newSettings = { ...settings, USDGBP: res.rates.GBP, USDEUR: res.rates.EUR }  
      LocalStorage.store(Config.storageKey.settings, JSON.stringify(newSettings))
      dispatch({ type: GET_CONVERSIONS, payload: {USDGBP: res.rates.GBP, USDEUR: res.rates.EUR }})
    }).catch(err => {
      // Return if any errors
      return;
    })
}

export const resetSettings = () => {
  return{
    type: RESET_SETTINGS
  }
}