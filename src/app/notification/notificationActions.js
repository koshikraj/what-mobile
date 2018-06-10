import steemAPI from '../../steemAPI'
import { isQualityPost, isWhatAppAnswer, isWhatAppAnswerByCategory, hasMarkedAnswer } from '../../helpers/questionHelpers'
import _ from 'lodash'
import { AsyncStorage, ToastAndroid } from 'react-native'
import Config from '../../constants/config'

export const GET_NOTIFICATION = "get_notification"
export const CLEAR_NOTIFICATION = "clear_notification"

export const clearNotifications = () => {
  return { type: CLEAR_NOTIFICATION }
}

export const getRecentNotifications = username => (dispatch, getState) => {
  let unreadNotifications = 0
  let lastNotification = null
  
  
  // Check if notification exist
  AsyncStorage.getItem(Config.storageKey.notification)
  .then(value => {
    // Last notification doesn't exist
    if(value !== null) lastNotification = value

    // Get answers notifications
    steemAPI.sendAsync('get_state', [`/@${username}/recent-replies`])
    .then(res => {
      // Get Answers From Object
      const answersFromAPI = _.reverse(_.sortBy(_.values(res.content), "id"))

      // Check if authenticated
      const isAuthenticated = getState().auth.isAuthenticated

      // Filtered Answers
      const filteredAnswers = []
      
      const user = getState().auth.user

      answersFromAPI.forEach(answer => {
        if(isQualityPost(answer) && isWhatAppAnswerByCategory(answer)) filteredAnswers.push(answer)
      })

      // Notifications 
      if(lastNotification === null){
        unreadNotifications = filteredAnswers.length
      }else{
        for(let i = 0; i < filteredAnswers.length; i++){
          if(`${filteredAnswers[i].id}` === lastNotification) break;

          unreadNotifications++
        }
      }

      // Dispatch
      dispatch({
        type: GET_NOTIFICATION, 
        payload: {
          unreadNotifications
        }
      })
    })
    .catch(err => {
      dispatch({
        type: GET_NOTIFICATION, 
        payload: {
          unreadNotifications
        }
      })
    })

  }).catch(err => {
    dispatch({
      type: GET_NOTIFICATION, 
      payload: {
        unreadNotifications
      }
    })
  })
}


