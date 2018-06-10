import steemConnectAPI from '../steemConnectAPI'
import { AsyncStorage, ToastAndroid } from 'react-native'
import * as LocalStorage from '../helpers/localStorage'
import Config from '../constants/config'
import { Actions } from 'react-native-router-flux'
import Toast from 'react-native-simple-toast'
import CookieManager from 'react-native-cookies'
import moment from 'moment'
import { getRecentNotifications } from '../app/notification/notificationActions'

export const LOGIN = "login"
export const LOGIN_SUCCESSFUL = "login_successful"
export const LOGIN_FAILED = "login_failed"
export const LOGOUT = "logout"
export const LOGOUT_SUCCESS = "logout_success"
export const LOGOUT_FAILED = "logout_failed"

export const authenticateUser = (params, fromLocalStorage = false, toFeed = false) => (dispatch) => {
  // Start Login
  dispatch({type: LOGIN})

  // Assign Login Details To Steem Connect
  steemConnectAPI.setAccessToken(params.accessToken)

  // Validation
  // Save to local storage
  // Return user account and access token
  // Go to feed page
  steemConnectAPI.me()
  .then(user => {
    // Save login info if not from local storage
    if(!fromLocalStorage){
      LocalStorage.store(Config.storageKey.login, `${params.accessToken}/${params.username}/${params.expiresIn}/${Date.parse(new Date)}`)
    } 
    // Get Notifications
    dispatch(getRecentNotifications(user.user))

    // Login Successful
    dispatch({type: LOGIN_SUCCESSFUL, payload: {user, accessToken: params.accessToken}})
    if(toFeed) Actions.reset('main')
  })
  // Failed Validation
  // Remove local storage data
  // Return failed
  .catch(err => {
    if(fromLocalStorage) LocalStorage.remove(Config.storageKey.login)
    dispatch({type: LOGIN_FAILED})
    Actions.reset('main');
  }) 
}

export const checkLoginExist = (toFeed = false) => (dispatch, getState) => {
  // If Authenticated leave
  if(getState().auth.isAuthenticated){  return null }

  // Check if Login Details Exist
  AsyncStorage.getItem(Config.storageKey.login)
    .then(value => {
      if(value === null) return Actions.reset('main')
      const paramsArray = value.split("/")
      const params = {accessToken: paramsArray[0], username: paramsArray[1], expiresIn: paramsArray[2]}
      
      // Check Date Differences
      if(paramsArray[3]) {
        const now = moment(new Date()) //todays date
        const lastLoggedIn = moment(new Date(paramsArray[3])) // last logged in date
        const duration = moment.duration(now.diff(lastLoggedIn))
        const seconds = duration.asSeconds();

        // If longer than exipiry time
        if(seconds >= params.expiresIn){
          // Go to home
          Actions.reset('main')
        }else{
          dispatch(authenticateUser(params, true, toFeed))
        }
      }else{
        dispatch(authenticateUser(params, true, toFeed))
      }
    })
}

export const logoutUser = () => (dispatch, getState) => {
  dispatch({type: LOGOUT})

  const auth = getState().auth
  steemConnectAPI.setAccessToken(auth.accessToken)
  
  steemConnectAPI.revokeToken().then(() => {
    CookieManager.clearAll()

    LocalStorage.remove(Config.storageKey.login)
    Actions.main({type: 'reset'})
    dispatch({type: LOGOUT_SUCCESS})
    // Notification
    Toast.show("Logout Successful", Toast.LONG)
  }).catch(err => {
    dispatch({type: LOGOUT_FAILED})
    // Notification
    Toast.show("Logout Failed", Toast.LONG)
  })
}