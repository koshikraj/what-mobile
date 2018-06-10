import Toast from 'react-native-simple-toast'
import steemAPI from '../steemAPI'
import { getQuestionAnswers } from '../answers/answersActions'
import { pendingVoteComplete, clearVotes, addVotes } from '../app/vote/voteActions'
import { hasMarkedAnswer } from '../helpers/questionHelpers'
import { refreshQuestion } from '../feed/feedActions';

export const GET_QUESTION = "get_question"
export const GET_QUESTION_SUCCESS = "get_question_success"
export const GET_QUESTION_FAILED = "get_question_failed"

export const POST_ANSWER = "post_answer"
export const POST_ANSWER_SUCCESS = "post_answer_success"
export const POST_ANSWER_FAILED = "post_answer_failed"

// Get Question
export const getQuestion = (author, permlink, isRefresh = false) => (dispatch, getState) => {
  if(!isRefresh) dispatch({type: GET_QUESTION})
  steemAPI.sendAsync('get_content', [author, permlink]).then(question => {  
   //dispatch(clearVotes())

    const upvotedList = []
    const downvotedList = []
  
    // Check if authenticated
    const isAuthenticated = getState().auth.isAuthenticated

    // Populate Vote Arrays
    if(isAuthenticated){
      const username = getState().auth.user.user

      question.active_votes.forEach(vote => {
        if(vote.voter === username){
          if(vote.percent > 0) {upvotedList.push(question.id)}
          else if (vote.percent < 0){ downvotedList.push(question.id)}
        }
      })
    }
    
    dispatch(addVotes(upvotedList, downvotedList))
    
    dispatch({type: GET_QUESTION_SUCCESS, payload: {
      question
    }})

    // Get answers
    if(!isRefresh) dispatch(getQuestionAnswers(author, permlink, question.category))

    // Update question if exists in any feeds
    dispatch(refreshQuestion('','', question))

  }).catch(err => {
    dispatch({ type: GET_QUESTION_FAILED })
    // Notification
    Toast.show("Failed Loading Question", Toast.LONG)
  })
}