import steemConnectAPI from '../../steemConnectAPI'
import Toast from 'react-native-simple-toast'

export const REBLOG = "reblog"
export const REBLOG_SUCCESS = "reblog_success"


export const reblogQuestion = (account, author, permlink, selectedId) => (dispatch, getState) => {
  const { reblog, auth } = getState()

  // Return if pending reblog is not equal to null
  if(reblog.pending !== null) return

  // Voting Process Started
  dispatch({type: REBLOG, payload: {pending: selectedId}})

  // Set Access Token
  steemConnectAPI.setAccessToken(auth.accessToken)

  // Reblog API
  steemConnectAPI.reblog(account, author, permlink).then(res => {
    // Reblog Post Success
    const reblogList = reblog.reblogList
    
    // Add To Reblog List
    reblogList.push(selectedId)

    // Dispatch Success
    dispatch({type: REBLOG_SUCCESS, payload: {reblogList}})

    // Notification
    Toast.show("Reblog Successful", Toast.LONG)
  }).catch(err => {
    // Reblog Post Success
    const reblogList = reblog.reblogList
    
    // Add To Reblog List
    reblogList.push(selectedId)

    // Post may have already been reblogged
    dispatch({type: REBLOG_SUCCESS, payload: {reblogList}})

    // Notification
    Toast.show("May have already been reblogged", Toast.LONG)
  })
}