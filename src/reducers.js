import { combineReducers } from 'redux'

import AuthReducer from './auth/authReducer'

import FeedReducer from './feed/feedReducer'

import ReblogReducer from './app/reblog/reblogReducer'
import FollowReducer from './app/follow/followReducer'
import VoteReducer from './app/vote/voteReducer'
import NotificationReducer from './app/notification/notificationReducer'

import QuestionReducer from './question/questionReducer'
import AnswersReducer from './answers/answersReducer'
import EditorReducer from './editor/editorReducer'

import SettingsReducer from './settings/settingsReducer'
import ProfileReducer from './profile/profileReducer'


import SearchReducer from './search/searchReducer'

export default combineReducers({
  auth: AuthReducer,
  feed: FeedReducer,
  reblog: ReblogReducer,
  follow: FollowReducer,
  vote: VoteReducer,
  notification: NotificationReducer,
  answers: AnswersReducer,
  question: QuestionReducer,
  search: SearchReducer,
  editor: EditorReducer,
  profile: ProfileReducer,
  settings: SettingsReducer
})

// Editor
export const getFormVisibility = ({editor}) => editor.formVisible
export const getEditorText = ({editor}) => editor.editorText
export const getIsPosting = ({editor}) => editor.isPosting 
export const getIsAnswering = ({editor}) => editor.isAnswering 
export const getIsReplying = ({editor}) => editor.isReplying 
export const getIsEditing = ({editor}) => editor.isEditing
export const getEditingPermlink = ({editor}) => editor.editingPermlink
export const getSelectedId = ({editor}) => editor.selectedId

// Auth
export const getIsCheckingAuth = ({auth}) => auth.isChecking
export const getAccessToken = ({auth}) => auth.getAccessToken
export const getIsAuthenticated = ({auth}) => auth.isAuthenticated
export const getAuthenticatedUser = ({auth}) => auth.user
export const getAuthenticatedUserName = ({auth}) => auth.user.user
export const getIsLoggingOut = ({auth}) => auth.isLoggingOut 

// Question
export const getSingleQuestion = ({question}) => question.question
export const getQuestionIsFetching = ({question}) => question.isFetching
export const getQuestionError = ({question}) => question.error

// Feed
export const getFeedQuestions = ({feed}) => feed
export const getFeedHasMore = ({feed}) => feed.hasMore
export const getFeedIsFetching = ({feed}) => feed.isFetching
export const getFeedError = ({feed}) => feed.hasError

// Answers
export const getAnswers = ({answers}) => answers
export const getMarkedAnswer = ({answers}) => answers.markedAnswer
export const getIsFetchingAnswers = ({answers}) => answers.isFetching
export const getHasMoreAnswers = ({answers}) => answers.hasMore
export const getUserHasAnswered = ({answers}) => answers.userHasAnswered
export const getAnswerRepliesByIdList = ({answers}) => answers.questionChildrenList
export const getAllComments = ({answers}) => answers.questionAllComments

// Vote
export const getPendingVote = ({vote}) => vote.pending 
export const getUpvotes = ({vote}) => vote.upvotedList
export const getDownvotes = ({vote}) => vote.downvotedList

// Reblog
export const getReblogList = ({reblog}) => reblog.reblogList
export const getPendingReblog = ({reblog}) => reblog.pending

// Settings
export const getVotePercent = ({settings}) => settings.votePercent 
export const getCurrency = ({settings}) => settings.currency 
export const getRates = state => ({USD: 1, GBP: state.settings.USDGBP, EUR: state.settings.USDEUR})