import { checkIDinArray } from '../feed/feedReducer'
import _ from 'lodash'

import {
  GET_ANSWERS, 
  GET_ANSWERS_SUCCESS, 
  GET_ANSWERS_FAILED,
  REFRESH_ANSWER
} from './answersActions'

const INITIAL_STATE = {
  feed: [], 
  user: [],
  question: [],
  questionChildrenList: {},
  questionAllComments: {},
  isFetching: false,
  hasMore: false,
  userHasAnswered: false
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case GET_ANSWERS: 
      return {...state, isFetching: true}
    case GET_ANSWERS_SUCCESS: 
      return {...state, ...action.payload, isFetching: false}
    case GET_ANSWERS_FAILED:
      return {...state, isFetching: false}
    case REFRESH_ANSWER:
      const {answer} = action.payload

      // Checking Replies
      let questionAllComments = state.questionAllComments
      if(_.has(questionAllComments, answer.id)) questionAllComments[answer.id] = answer

      return {
        ...state, 
        feed: checkIDinArray(state.feed, answer),
        user: checkIDinArray(state.user, answer),
        question: checkIDinArray(state.question, answer),
        questionAllComments
      }
    default:
      return state
  }
}