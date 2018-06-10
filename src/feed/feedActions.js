import steemAPI from '../steemAPI'
import { getDiscussionsFromAPI, mapToId, userFollowsOtherUser } from '../helpers/apiHelpers'
import { isQualityPost, isPostTaggedNSFW, isWhatAppQuestionByParentPermlink } from '../helpers/questionHelpers'
import Toast from 'react-native-simple-toast'

import { pendingVoteComplete, addVotes, clearVotes } from '../app/vote/voteActions'

export const GET_QUESTIONS = "get_questions" 
export const GET_QUESTIONS_SUCCESS = "get_questions_success"
export const GET_QUESTIONS_NO_RESULTS = "get_questions_no_results"
export const GET_QUESTIONS_EXIT = "get_questions_exit"
export const GET_QUESTIONS_FAILED = "get_questions_failed"

export const REFRESH_QUESTION = "refresh_question"


export const getQuestionsFromAPI = (
  { sortBy, filter, limit},
  resolve = () => {},
  reject = () => {},
) => (dispatch, getState) => {
  // Clear Votes
  dispatch(clearVotes())

  // Get Questions Begin
  dispatch({type: GET_QUESTIONS, payload: {sortBy}})

  // Get Questions From API
  getDiscussionsFromAPI(sortBy, { tag: filter, limit }, steemAPI )
    .then(questions => {
      // Vote arrays
      const upvotedList = []
      const downvotedList = []

      // Check if authenticated
      const isAuthenticated = getState().auth.isAuthenticated

      // Filtered Questions
      const filteredQuestions = []

      // Populate Vote arrays
      // Filter Low Quality Comments
      
      const user = getState().auth.user

      questions.forEach(question => {
        if(isAuthenticated){
          if(question.active_votes.length > 0){
            question.active_votes.forEach(vote => {
              if(vote.voter === user.user){
                if(vote.percent > 0) {upvotedList.push(question.id)}
                else if (vote.percent < 0){ downvotedList.push(question.id)}
              }
            })
          }
        }
  
        if(isQualityPost(question) && 
          !isPostTaggedNSFW(question) && 
          isWhatAppQuestionByParentPermlink(question)) filteredQuestions.push(question)
      })

      // Add To Votes Array
      dispatch(addVotes(upvotedList, downvotedList))

      // Set has more to false
      let hasMore = false
      // Set to true if question length is equal to limit
      if(filteredQuestions.length == limit) hasMore = true

      //Return Success
      dispatch({
        type: GET_QUESTIONS_SUCCESS, 
        payload: {
          questions: filteredQuestions, 
          sortBy, 
          hasMore
        }
      })
      
      resolve();
    })
    .catch(err => {
      dispatch({type: GET_QUESTIONS_FAILED, payload: {sortBy}})
      // Notification
      Toast.show("Error Connecting", Toast.LONG)
    })
}

export const getMoreQuestionsFromAPI = ({ sortBy, filter, limit }) => (dispatch, getState) => {
  const feedContent = getState().feed[sortBy]
  const isFetching = getState().feed.isFetching[sortBy]
  
  if (!feedContent.length || isFetching) {
    // exit early
    dispatch({type: GET_QUESTIONS_EXIT, payload: {sortBy}})
    return null;
  }

  // Get Questions Begin
  dispatch({type: GET_QUESTIONS, payload: {sortBy}})

  const startAuthor = feedContent[feedContent.length - 1].author;
  const startPermlink = feedContent[feedContent.length - 1].permlink;
  
  getDiscussionsFromAPI(
    sortBy, 
    {
      tag: filter, limit: limit + 1,
      start_author: startAuthor,
      start_permlink: startPermlink,
    },
    steemAPI,
  )
    .then(res => {
      // Check If there are questions
      if(res.length > 1){

        // Remove First Result
        const questions = res.slice(1)

        // Vote Arrays
        const { upvotedList, downvotedList } = getState().vote

        // Check if authenticated
        const isAuthenticated = getState().auth.isAuthenticated

        // Filtered Questions
      const filteredQuestions = []

      // Populate Vote arrays
      // Filter Low Quality Comments
      
      const user = getState().auth.user

      questions.forEach(question => {
        if(isAuthenticated){
          if(question.active_votes.length > 0){
            question.active_votes.forEach(vote => {
              if(vote.voter === user.user){
                if(vote.percent > 0) {upvotedList.push(question.id)}
                else if (vote.percent < 0){ downvotedList.push(question.id)}
              }
            })
          }
        }
  
        if(isQualityPost(question) && 
          !isPostTaggedNSFW(question) && 
          isWhatAppQuestionByParentPermlink(question)) filteredQuestions.push(question)
      })

      // Add To Votes Array
      dispatch(addVotes(upvotedList, downvotedList))

      //Return Success
        dispatch({
          type: GET_QUESTIONS_SUCCESS, 
          payload: {
            questions: [...feedContent, ...filteredQuestions], 
            sortBy, 
            hasMore: filteredQuestions.length < limit ? false : true
          }
        })
      }else{
        // No Results
        dispatch({type: GET_QUESTIONS_NO_RESULTS, payload: {sortBy}})
      }
    })
    .catch(err => {
      // Has Error
      dispatch({type: GET_QUESTIONS_FAILED})
      // Notification
      Toast.show("Error Connecting", Toast.LONG)
    });
}

// Refresh Question
export const refreshQuestion = (author, permlink, questionExists = null) => (dispatch) => {
  if(!questionExists || questionExists === null || questionExists === undefined){
    steemAPI.sendAsync('get_content', [author, permlink]).then(question => {
      dispatch({type: REFRESH_QUESTION, payload: {question}})
      dispatch(pendingVoteComplete())
    }).catch(err => {
      dispatch(pendingVoteComplete())
    })
  }else{
    dispatch({type: REFRESH_QUESTION, payload: {question: questionExists}})
    dispatch(pendingVoteComplete())
  }
}