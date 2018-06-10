import steemAPI from '../steemAPI'
import { mapToId, mapAPIContentToId } from '../helpers/apiHelpers'
import { isQualityPost, isWhatAppAnswer, isWhatAppAnswerByCategory, hasMarkedAnswer } from '../helpers/questionHelpers'
import { pendingVoteComplete, addVotes, clearVotes } from '../app/vote/voteActions'
import _ from 'lodash'
import { clearNotifications } from '../app/notification/notificationActions'
import Config from '../constants/config'
import * as LocalStorage from '../helpers/localStorage'

export const GET_ANSWERS = "get_answers"
export const GET_ANSWERS_SUCCESS = "get_answers_success"
export const GET_ANSWERS_FAILED = "get_answers_failed"
export const REFRESH_ANSWER = "refresh_answer"

export const getFeedAnswers = (username, isReplies, sortBy) => (dispatch, getState) => {
  // Clear Votes
  dispatch(clearVotes())

  // Get Answers Begin
  dispatch({type: GET_ANSWERS})

  // Get Answers From API
  const url = isReplies ? 'recent-replies' : 'comments'
  steemAPI.sendAsync('get_state', [`/@${username}/${url}`])
    .then(res => {
      // Get Answers From Object
      const answersFromAPI = _.reverse(_.sortBy(_.values(res.content), "id"))

      // Vote arrays
      const upvotes = [] 
      const downvotes = []

      // Check if authenticated
      const isAuthenticated = getState().auth.isAuthenticated

      // Filtered Answers
      const filteredAnswers = []

      // Populate Vote arrays
      // Filter Low Quality Comments
      
      const user = getState().auth.user

      answersFromAPI.forEach(answer => {
        if(isAuthenticated){
          if(answer.active_votes.length > 0){
            answer.active_votes.forEach(vote => {
              if(vote.voter === user.user){
                if(vote.percent > 0) {upvotes.push(answer.id)}
                else if (vote.percent < 0){ downvotes.push(answer.id)}
              }
            })
          }
        }
        if(isQualityPost(answer) && isWhatAppAnswerByCategory(answer)) filteredAnswers.push(answer)
      })

      // Save notification
      if(isReplies && filteredAnswers.length > 0){
        // Save most recent
        LocalStorage.store(Config.storageKey.notification, `${filteredAnswers[0].id}`)
        // Clear unread notifications
       dispatch(clearNotifications())
      }

      // Add To Votes Array
      dispatch(addVotes(upvotes, downvotes))

      //Return Success
      dispatch({
        type: GET_ANSWERS_SUCCESS, 
        payload: {
          [sortBy]: filteredAnswers
        }
      })
    })
    .catch(err => {
      dispatch({type: GET_ANSWERS_FAILED})
    })
}

const getRootCommentsList = apiRes => {
  return _.filter(_.reverse(_.sortBy(_.values(apiRes.content))), ['depth', 1])
}

const getCommentsChildrenLists = apiRes => {
  const listsById = {};
  Object.keys(apiRes.content).forEach(commentKey => {
    listsById[apiRes.content[commentKey].id] = apiRes.content[commentKey].replies.map(
      childKey => apiRes.content[childKey].id,
    );
  });

  return listsById;
}

const getQuestion = apiRes => {
  return _.filter(_.reverse(_.sortBy(_.values(apiRes.content))), ['depth', 0])[0]
}

// Get Replies
export const getQuestionAnswers = (author, permlink, category) => (dispatch, getState) => {
  // Get Answers Begin
  dispatch({type: GET_ANSWERS})

  // Get Answers From API
  steemAPI.sendAsync('get_state', [`/${category}/@${author}/${permlink}`])
    .then(apiRes => {
      const apiQuestion = getQuestion(apiRes)
      const markedAnswer = hasMarkedAnswer(apiQuestion)
      const questionAnswers = getRootCommentsList(apiRes)
      const questionAnswerReplies = getCommentsChildrenLists(apiRes)
      const allComments = mapAPIContentToId(apiRes)
      
      // Vote arrays
      const upvotes = [] 
      const downvotes = []

      // Check if authenticated
      const isAuthenticated = getState().auth.isAuthenticated

      // Filtered Answers
      const filteredAnswers = []

      // Populate Vote arrays
      // Filter Low Quality Comments
      
      const user = getState().auth.user

      // See if user has answered
      let userHasAnswered = false

      // Check if user has answered and answers are quality answers
      questionAnswers.forEach(answer => {
        if(isAuthenticated){
          if(answer.author === user.name){ 
            userHasAnswered = true
          }
        }
        if(isQualityPost(answer)) filteredAnswers.push(answer)
      })

      // Check if user has voted any of the answers or replies
      if(isAuthenticated){
        Object.values(allComments).forEach(comment => {
          if(comment.active_votes.length > 0){
            comment.active_votes.forEach(vote => {
              if(vote.voter === user.name){
                if(vote.percent > 0) {upvotes.push(comment.id)}
                else if (vote.percent < 0){ downvotes.push(comment.id)}
              }
            })
          }
        })
      }

      
      const sortedAnswers = []
      // If marked answer exists then sort array

      if(markedAnswer !== null){
        // Sort By Marked Answer
        const index = filteredAnswers.findIndex(item => item.id === markedAnswer.id)
        if(index !== -1) sortedAnswers.push(filteredAnswers[index])
        // Add User Answers Next
        if(isAuthenticated){
          filteredAnswers.forEach(answer => {
            if(answer.id !== markedAnswer.id && answer.author === user.user){ 
              sortedAnswers.push(answer)
            }
          })
          // Add the rest That Doesn't Contain User
          filteredAnswers.forEach(answer => {
            if(answer.id !== markedAnswer.id && answer.author !== user.user) sortedAnswers.push(answer)
          })
        }else{
          // Add the rest
          filteredAnswers.forEach(answer => {
            if(answer.id !== markedAnswer.id) sortedAnswers.push(answer)
          })
        }
      }

      // Add To Votes Array
      dispatch(addVotes(upvotes, downvotes))

      // Add To Answers
      const answersForQuestions = markedAnswer !== null ? sortedAnswers : filteredAnswers

      // Return Success
      dispatch({
        type: GET_ANSWERS_SUCCESS, 
        payload: {
          question: answersForQuestions, 
          questionChildrenList: questionAnswerReplies,
          questionAllComments: allComments,
          markedAnswer,
          userHasAnswered
        }
      })

    })
    .catch(err => {
      dispatch({type: GET_ANSWERS_FAILED})
    })
}


// Refresh Answer
export const refreshAnswer = (author, permlink, answerExists = null) => (dispatch) => {
  if(answerExists === null){
    steemAPI.sendAsync('get_content', [author, permlink]).then(answer => {
      dispatch({type: REFRESH_ANSWER, payload: {answer}})
      dispatch(pendingVoteComplete())
    }).catch(err => {
      dispatch(pendingVoteComplete())
    })
  }else{
    dispatch({type: REFRESH_ANSWER, payload: {answer: answerExists}})
    dispatch(pendingVoteComplete())
  }
}