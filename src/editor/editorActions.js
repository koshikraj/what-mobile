import steemConnectAPI from '../steemConnectAPI'
import { rewardsValues } from '../constants/rewards'
import { jsonParse } from '../helpers/formatter'
import { createPermlink, getBodyPatchIfSmaller } from '../helpers/steemitHelpers'
import { validateTags, validateCategory, validateTitle } from '../helpers/editorHelpers'
import Toast from 'react-native-simple-toast'
import { Actions } from 'react-native-router-flux'
import { getQuestionAnswers } from '../answers/answersActions'
import { getQuestion } from '../question/questionActions'
import { refreshQuestion } from '../feed/feedActions'

export const ASK_FORM_UPDATE = "ask_form_update"
export const ASK_FORM_UPDATE_ALL = "ask_form_update_all"
export const ASK_FORM_CLEAR = "ask_form_clear"
export const ANSWER_FORM_UPDATE = "answer_form_update"

export const CREATE_POST = "create_post"
export const CREATE_POST_SUCCESS = "create_post_success"
export const CREATE_POST_FAILED = "create_post_failed"


// Set Ask Form
export const askFormSet = form => {
  return {
    type: ASK_FORM_UPDATE_ALL,
    payload: {question: form}
  }
}

// Update Ask From Data
export const askFormUpdate = ({prop, value}) => {
  return {
    type: ASK_FORM_UPDATE,
    payload: {prop, value}
  }
}

// Ask Form Clear
export const askFormClear = () => {
  return { type: ASK_FORM_CLEAR }
}

// Update Form
export const formTextUpdate = value => {
  return {
    type: ANSWER_FORM_UPDATE,
    payload: {editorText: value}
  }
}

/**
 * Show or Hide Form
 * @param {Bool} data.formVisible Answer form visibility
 * @param {String} data.editorText Text in the form
 * @param {Bool} data.isEditing if editing 
 * @param {String} data.editingPermlink Permlink if editing 
 * @param {Bool} data.isAnswering If answering question
 * @param {Bool} data.isReplying If replying to answer
 * @param {*} data.selectedId Selected ID
 */
export const formVisibility = data => {
  const { formVisible, editorText, isEditing, editingPermlink, isAnswering, isReplying, selectedId } = data
  return {
    type: ANSWER_FORM_UPDATE,
    payload: {
      formVisible,
      editorText,
      isEditing,
      editingPermlink,
      isAnswering,
      isReplying,
      selectedId
    }
  }
}


// Broadcast Post or Comment to STEEM Blockchain
const broadcastComment = (
  steemConnectAPI,
  parentAuthor,
  parentPermlink,
  author,
  title,
  body,
  jsonMetadata,
  reward,
  permlink,
  authUsername,
) => {
  const operations = [];
  const commentOp = [
    'comment',
    {
      parent_author: parentAuthor,
      parent_permlink: parentPermlink,
      author,
      permlink,
      title,
      body,
      json_metadata: JSON.stringify(jsonMetadata),
    },
  ];
  operations.push(commentOp);

  const commentOptionsConfig = {
    author,
    permlink,
    allow_votes: true,
    allow_curation_rewards: true,
    max_accepted_payout: '1000000.000 SBD',
    percent_steem_dollars: 10000,
  };

  if (reward === rewardsValues.none) {
    commentOptionsConfig.max_accepted_payout = '0.000 SBD';
  } else if (reward === rewardsValues.all) {
    commentOptionsConfig.percent_steem_dollars = 0;
  }

  if (reward === rewardsValues.none || reward === rewardsValues.all) {
    operations.push(['comment_options', commentOptionsConfig]);
  }

  return steemConnectAPI.broadcast(operations);
};


// Validate Forms
export const validateForm = (form, isQuestion = true) => {
  // If Question
  if(isQuestion){
    const {
      title,
      category,
      tags,
    } = form

    // Validation
    if(!validateTitle(title)) return 'Title must be 7-255 characters'
    if(!validateCategory(category)) return 'Category must be 1 to 18 characters'
    if(!validateTags(tags)) return 'Must be no more than 3 tags'

    // Empty represents success
    return ''
  }else{
    let { body } = form
    body = body.trim()
    
    if(body.length < 10){ return 'Answer must be min 10 characters' } else { return '' }
  }
}

// Create Post then send to STEEM blockchain
export const createPost = (postData, isQuestion = true, isMarking = false, isReply = false) =>  (dispatch, getState) => {
  // Create Post Started
  dispatch({ type: CREATE_POST })

  // If not marking answer
  if(!isMarking){
    // Validate Post Data Here
    const isValidated = validateForm(postData, isQuestion)

    if(isValidated.length > 0) {
      // Notification
      Toast.show(isValidated, Toast.LONG)
      // Create Post Failed
      return dispatch({ type: CREATE_POST_FAILED }) 
    } 
  }

  const {
    parentAuthor,
    parentPermlink,
    author,
    title,
    category,
    body,
    jsonMetadata,
    reward,
    isUpdating
  } = postData

  // Get Permlink
  const getPermLink = isUpdating
    ? Promise.resolve(postData.permlink)
    : createPermlink(title, author, parentAuthor, parentPermlink);

  // Get Username
  const state = getState();
  const authUser = state.auth.user;
  const newBody = body.trim();

  // Set Access Token
  steemConnectAPI.setAccessToken(state.auth.accessToken)

  
  // Broadcast Comment
  getPermLink.then(permlink =>
    broadcastComment(
      steemConnectAPI,
      parentAuthor,
      parentPermlink,
      author,
      title,
      newBody,
      jsonMetadata,
      !isUpdating ? reward : '50',
      permlink,
      authUser.name,
    ).then(result => {
      // Go to question page
      if(isQuestion){ 
        if(isMarking){
          dispatch(formVisibility({
            formVisible: false,
            editorText: '',
            editingPermlink: '',
            isEditing: false,
            isReplying: false,
            isAnswering: false,
            selectedId: null
          })) 
          dispatch(getQuestion(author, permlink, true))
          dispatch(getQuestionAnswers(author, permlink, category))
        }else{
          if(isUpdating){ 
            Actions.pop()
            dispatch(getQuestion(author, permlink, true))
            dispatch(getQuestionAnswers(author, permlink, category))
          }else{
            Actions.reset('main')
          }
        }
      } else if(isReply){
        dispatch(formVisibility({
          formVisible: false,
          editorText: '',
          editingPermlink: '',
          isEditing: false,
          isReplying: false,
          isAnswering: false,
          selectedId: null
        })) 
        dispatch(getQuestionAnswers(state.question.question.author, state.question.question.permlink, category))
      } else { 
        dispatch(formVisibility({
          formVisible: false,
          editorText: '',
          editingPermlink: '',
          isEditing: false,
          isReplying: false,
          isAnswering: false,
          selectedId: null
        })) 
        dispatch(getQuestionAnswers(parentAuthor, parentPermlink, category))
      }

      // Notification
      Toast.show("Success", Toast.LONG)
      // Create Post Complete
      dispatch({ type: CREATE_POST_SUCCESS })

    }).catch(err => {
        // Notification
      Toast.show("Error", Toast.LONG)
      // Create Post Failed
      dispatch({ type: CREATE_POST_FAILED })
    })
  )
}