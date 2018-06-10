import steemConnectAPI from '../../steemConnectAPI'
import { changeFollowing } from '../../profile/profileActions'

export const FOLLOW = "follow"
export const FOLLOW_SUCCESS = "follow_success"
export const FOLLOW_FAILED = "follow_failed"

// USES USERNAMES INSTEAD OF ACCOUNT ID
export const followUser = (self, username, isFollowing) => (dispatch, getState) => {
  const { follow, auth } = getState()

  // Return if pending follow is not equal to null
  if(follow.pending !== null) return

  // Voting Process Started
  dispatch({type: FOLLOW, payload: {pending: username}})

  // Set Access Token
  steemConnectAPI.setAccessToken(auth.accessToken)

  // Follow API
  if(isFollowing){
    steemConnectAPI.unfollow(self, username).then(res => {
      // Unfollow Success
      const following = follow.following
      
      // Remove From Following List
      const index = following.indexOf(username)
      if(index !== -1) following.splice(index, 1)

      // Update Is Following - Profile Reducer
      dispatch(changeFollowing(false))
  
      // Dispatch Success
      dispatch({type: FOLLOW_SUCCESS, payload: {following}})
  
    }).catch(err => {
      // Dispatch Failed
      dispatch({type: FOLLOW_FAILED})
    })
  }else{
    steemConnectAPI.follow(self, username).then(res => {
      // Follow Success
      const following = follow.following
      
      // Add To Following List
      following.push(username)

      // Update Is Following - Profile Reducer
      dispatch(changeFollowing(true))
  
      // Dispatch Success
      dispatch({type: FOLLOW_SUCCESS, payload: {following}})
  
    }).catch(err => {
      // Dispatch Failed
      dispatch({type: FOLLOW_FAILED})
    })
  }
}

// Used In Profile Actions
export const checkFollowing = (isComplete = false) => {
  if(!isComplete) return {type: FOLLOW, payload: {pending: "user"}}
  else return {type: FOLLOW, payload: {pending: null}}
}