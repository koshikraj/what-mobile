import { mapToId } from '../helpers/apiHelpers'

import { 
  GET_QUESTIONS, 
  GET_QUESTIONS_SUCCESS, 
  GET_QUESTIONS_NO_RESULTS, 
  GET_QUESTIONS_EXIT, 
  GET_QUESTIONS_FAILED,
  REFRESH_QUESTION 
} from './feedActions'

const INITIAL_STATE = {
  created: [],
  feed: [],
  trending: [],
  hot: [],
  blog: [],
  isFetching: {
    created: false, 
    feed: false, 
    trending: false, 
    hot: false,
    blog: false,
  },
  hasMore: {
    created: false, 
    feed: false, 
    trending: false, 
    hot: false,
    blog: false,
  },
  hasError: {
    created: false, 
    feed: false, 
    trending: false, 
    hot: false,
    blog: false
  }
}


export default (state = INITIAL_STATE, action) => {
  switch(action.type){
    case GET_QUESTIONS:
      return {
        ...state, 
        isFetching: {...state.isFetching, [action.payload.sortBy]: true},
        hasError: {...state.hasError, [action.payload.sortBy]: false}
      }
    case GET_QUESTIONS_SUCCESS:
      return {
        ...state, 
        upvotes: action.payload.upvotes,
        downvotes: action.payload.downvotes,
        [action.payload.sortBy]: action.payload.questions,
        isFetching: {...state.isFetching, [action.payload.sortBy]: false},
        hasMore: {...state.hasMore, [action.payload.sortBy]: action.payload.hasMore}
      }
    case GET_QUESTIONS_NO_RESULTS:
      return {
        ...state, 
        isFetching: {...state.isFetching, [action.payload.sortBy]: false},
        hasMore: {...state.hasMore, [action.payload.sortBy]: false}
      }

    case GET_QUESTIONS_FAILED:
      return {
        ...state, 
        isFetching: {...state.isFetching, [action.payload.sortBy]: false},
        hasError: {...state.hasError, [action.payload.sortBy]: true}
      }
    case REFRESH_QUESTION:
      // Check if selected ID are in arrays
      const {question} = action.payload

      return {
        ...state, 
        created: checkIDinArray(state.created, question), 
        feed: checkIDinArray(state.feed, question), 
        trending: checkIDinArray(state.trending, question), 
        hot: checkIDinArray(state.hot, question),
        blog: checkIDinArray(state.blog, question)
      }
    case GET_QUESTIONS_EXIT:
    default:
      return state
  }
}

export const checkIDinArray = (array, item) => {
  const index = array.findIndex(post => post.id === item.id)
  if(index !== -1) array[index] = item

  return array
}