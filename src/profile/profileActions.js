import { checkFollowing } from '../app/follow/followActions'
import { getFollowingCount, userFollowsOtherUser } from '../helpers/apiHelpers'

export const GET_PROFILE = "get_profile"
export const UPDATE_PROFILE = "update_profile"

export const getProfile = (username, isSelf) => (dispatch, getState) => {
  // Check Following Start
  if(!isSelf) dispatch(checkFollowing())

  // Get Follow Counts
  getFollowingCount(username).then(res => {
    dispatch({
      type: UPDATE_PROFILE,
      payload: {followers: res.follower_count, following: res.following_count}
    })
  })

  // Check if user is following
  if(!isSelf){
    const self = getState().auth.user.user
    userFollowsOtherUser(self, username).then(res => {
      if(res[0].following === username) {
        dispatch({type: UPDATE_PROFILE, payload: {isFollowing: true}})
      }
      else {
        dispatch({type: UPDATE_PROFILE, payload: {isFollowing: false}})
      }

      // Check Following Complete
      dispatch(checkFollowing(true))
    }).catch(err => dispatch(checkFollowing(true)))
  }
}

// Change Following - Called From Follow Actions
export const changeFollowing = (isFollowing) => {
  return{type: UPDATE_PROFILE, payload: {isFollowing}}
}