import steemAPI from '../../steemAPI'
import steemConnectAPI from '../../steemConnectAPI'
import Toast from 'react-native-simple-toast'

import { getQuestion } from '../../question/questionActions'
import { refreshQuestion } from '../../feed/feedActions'
import { refreshAnswer } from '../../answers/answersActions'

export const VOTE = "vote"
export const VOTE_SUCCESS = "vote_success"
export const VOTE_ERROR = "vote_error"
export const VOTE_REFRESH_COMPLETE = "vote_refresh_complete"
export const VOTE_ADD = "vote_add"
export const VOTE_CLEAR = "vote_clear"


export const voteQuestion = (voter, author, permlink, selectedId, weight = 10000, questionScreen = false) => (dispatch, getState) => {
  const { vote, auth } = getState()

  // Return if pending vote is not equal to null
  if(vote.pending !== null) return

  // Voting Process Started
  dispatch({type: VOTE, payload: {pending: selectedId}})

  // Set Access Token
  steemConnectAPI.setAccessToken(auth.accessToken);

  // Vote API
  steemConnectAPI.vote(voter, author, permlink, weight).then(res => {
    // Vote Post Success
    const upvotedList = vote.upvotedList
    const downvotedList = vote.downvotedList
    
    // Indexes or -1
    const upvoteIndex = upvotedList.indexOf(selectedId)
    const downvoteIndex = downvotedList.indexOf(selectedId)

    // Check if upvoted / downvoted > add/remove from list arrays
    if(weight === 0) {
      if(upvotedList.includes(selectedId)) if(upvoteIndex !== -1) upvotedList.splice(upvoteIndex, 1)
      if(downvotedList.includes(selectedId)) if(downvoteIndex !== -1) downvotedList.splice(downvoteIndex, 1)
    }
    else if(weight > 0) {
      if(!upvotedList.includes(selectedId)) upvotedList.push(selectedId)
      if(downvotedList.includes(selectedId)) if(downvoteIndex !== -1) downvotedList.splice(downvoteIndex, 1)
    }
    else {
      if(!downvotedList.includes(selectedId)) downvotedList.push(selectedId)
      if(upvotedList.includes(selectedId)) if(upvoteIndex !== -1) upvotedList.splice(upvoteIndex, 1)
    }

    // Dispatch Success
    dispatch({type: VOTE_SUCCESS, payload: {upvotedList, downvotedList}})

    // Notification
    Toast.show("Vote Successful", Toast.LONG)

    if(questionScreen){
      // Refresh Question From Question Screen
      dispatch(getQuestion(author, permlink, true))
    }else{
      // Refresh Question From Feed
      dispatch(refreshQuestion(author, permlink))
    }
    

  }).catch(err => {
    // Vote Post Error
    dispatch({type: VOTE_ERROR})
    // Notification
    Toast.show("Vote Failed", Toast.LONG)
  })
}

export const voteAnswer = (voter, author, permlink, selectedId, weight = 10000) => (dispatch, getState) => {
  const { vote, auth } = getState()

  // Return if pending vote is not equal to null
  if(vote.pending !== null) return

  // Voting Process Started
  dispatch({type: VOTE, payload: {pending: selectedId}})

  // Set Access Token
  steemConnectAPI.setAccessToken(auth.accessToken);

  // Vote API
  steemConnectAPI.vote(voter, author, permlink, weight).then(res => {
    // Vote Post Success
    const upvotedList = vote.upvotedList
    const downvotedList = vote.downvotedList
    
    // Indexes or -1
    const upvoteIndex = upvotedList.indexOf(selectedId)
    const downvoteIndex = downvotedList.indexOf(selectedId)

    // Check if upvoted / downvoted > add/remove from list arrays
    if(weight === 0) {
      if(upvotedList.includes(selectedId)) if(upvoteIndex !== -1) upvotedList.splice(upvoteIndex, 1)
      if(downvotedList.includes(selectedId)) if(downvoteIndex !== -1) downvotedList.splice(downvoteIndex, 1)
    }
    else if(weight > 0) {
      if(!upvotedList.includes(selectedId)) upvotedList.push(selectedId)
      if(downvotedList.includes(selectedId)) if(downvoteIndex !== -1) downvotedList.splice(downvoteIndex, 1)
    }
    else {
      if(!downvotedList.includes(selectedId)) downvotedList.push(selectedId)
      if(upvotedList.includes(selectedId)) if(upvoteIndex !== -1) upvotedList.splice(upvoteIndex, 1)
    }

    // Dispatch Success
    dispatch({type: VOTE_SUCCESS, payload: {upvotedList, downvotedList}})

    // Notification
    Toast.show("Vote Successful", Toast.SHORT)

    // Refresh Answer
    dispatch(refreshAnswer(author, permlink))

  }).catch(err => {
    // Vote Answer Error
    dispatch({type: VOTE_ERROR})
    // Notification
    Toast.show("Vote Failed", Toast.SHORT)
  })
}

// Add Votes To Array
export const addVotes = (upvotes, downvotes) => {
    return {type: VOTE_ADD, payload: {upvotes, downvotes}}
}

// Clear Vote Array
export const clearVotes = () => {
  return {type: VOTE_CLEAR}
}

// Called from feed and post actions only
export const pendingVoteComplete = () => {
  return {type: VOTE_REFRESH_COMPLETE}
}


