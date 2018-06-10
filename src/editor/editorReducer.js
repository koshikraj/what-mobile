import { 
  ASK_FORM_UPDATE,
  ASK_FORM_UPDATE_ALL,
  ASK_FORM_CLEAR,
  ANSWER_FORM_UPDATE,
  CREATE_POST,
  CREATE_POST_SUCCESS,
  CREATE_POST_FAILED
 } from  './editorActions'

const INITIAL_STATE = {
  question: {
    title: '',
    category: '',
    body: '',
    tags: '',
    powerUp: false
  },
  formVisible: false,
  editorText: '',
  editingPermlink: '',
  isPosting: false,
  isAnswering: false,
  isReplying: false,
  isEditing: false,
  selectedId: null
}

export default (state = INITIAL_STATE, action) => {
  switch(action.type) {
    case ASK_FORM_UPDATE:
      return {...state, question : {...state.question, [action.payload.prop]: action.payload.value}}
    case ASK_FORM_UPDATE_ALL:
      return {...state, ...action.payload}
    case ASK_FORM_CLEAR:
      return {...state, question: INITIAL_STATE.question}
    case ANSWER_FORM_UPDATE:
      return {...state, ...action.payload}
    case CREATE_POST:
      return {...state, isPosting: true}
    case CREATE_POST_SUCCESS:
    case CREATE_POST_FAILED:
    return {...state, isPosting: false}
    default:
      return state;
  }
}