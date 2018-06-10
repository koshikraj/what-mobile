import React, {Component} from 'react'
import { connect } from 'react-redux'

import { Actions } from 'react-native-router-flux'

import Config from '../constants/config'

import { FlatList, Clipboard } from 'react-native'
import { 
  StyleProvider, 
  Container, 
  Content, 
  Spinner, 
  H3, 
  ActionSheet, 
  Input, 
  Thumbnail, 
  View, 
  Text,
  Left,
  Right,
  Button
} from 'native-base'

import Toast from 'react-native-simple-toast'

import { voteQuestion, voteAnswer } from '../app/vote/voteActions'
import { reblogQuestion } from '../app/reblog/reblogActions'
import { getQuestion } from '../question/questionActions'

// Create Post Data
import { createPostData } from '../helpers/editorHelpers'

// Update form text, visibility and create post function
import { 
  formTextUpdate, 
  formVisibility, 
  createPost 
} from '../editor/editorActions'


import { 
  getIsAuthenticated, 
  getAuthenticatedUser, 

  getPendingVote, 
  getUpvotes,
  getDownvotes,

  getVotePercent, 
  getRates, 
  getCurrency, 

  getSingleQuestion, 
  getQuestionIsFetching, 
  getQuestionError,
  getUserHasAnswered,
  getMarkedAnswer,
  getAnswers,
  getIsFetchingAnswers,

  getReblogList, 
  getPendingReblog, 
  
  getFormVisibility,
  getIsAnswering,
  getIsEditing,
  getIsReplying,
  getEditorText,
  getIsPosting,
  getEditingPermlink,
  getSelectedId,

  getAnswerRepliesByIdList,
  getAllComments
} from '../reducers'

import Header  from '../components/headers'
import Footer from '../components/footers/footerButton'

import QuestionComponent from '../components/question'
import AnswerComponent from '../components/answer'

import theme from '../theme/components'
import material from '../theme/variables/material'

import Card from '../components/card'
import CardSection from '../components/card/cardSection'

import { currencySelect, getMetadata, isModifyExpired } from '../helpers/questionHelpers'
import AnswerPreview from '../editor/bodyPreview'

class RepliesScreen extends Component {
  constructor(props){
    super(props)

    // Preview For Answer
    this.state = {
      preview: false
    }

    this.getReplies = this.getReplies.bind(this)
  }

  
  /**
   * Post reply to STEEM blockchain
   */
  addReply(){
    // Get username from props
    const {user, editorText, allComments, selectedId, editingPermlink, isEditing} = this.props


    // Create post data
    const postData = createPostData(
      editorText,
      allComments[selectedId], 
      user.user,
      editingPermlink,
      isEditing
    )
    // Send reply to STEEM blockchain
    this.props.createPost(postData, false, false, true)
  }

  // Get All Replies
  getReplies(allComments){
    const replies = []

    Object.values(allComments).forEach(comment => {
      if(this.props.questionChildrenList[this.props.id].indexOf(comment.id) !== -1) replies.push(comment);
    })

    return replies
  }

  // On answer options click
  handleAnswerOptionsClick(answer, isReported){
    // If not logged in go to login screen
    if(!this.props.isAuthenticated) return Actions.login()

    const { user, isAuthenticated, question } = this.props

    // Dropdown Options
    const options = ["Cancel"]

    // If not reported and not answer author
    if(!isReported && user.user !== answer.author) options.unshift("Report")

    // If is authenticated user's question
    if(this.props.author === user.user && !isModifyExpired(answer)) options.unshift("Mark Answer")

    // If is authenticated user's answer
    if(user.user === answer.author && !isModifyExpired(answer)) options.unshift("Edit")

    // Show Options
    ActionSheet.show(
      {
        options: options, 
        cancelButtonIndex: options.length - 1, 
        title: "Options"
      },
      buttonIndex => {
        if(options[buttonIndex] === "Report") {
          // Downvote User
          this.props.voteAnswer(user.user, answer.author, answer.permlink, answer.id, -10000)
        }
        else if(options[buttonIndex] === "Edit") {
          // Show Answer Form
          this.props.formVisibility({
            formVisible: true,
            editorText: answer.body,
            editingPermlink: answer.permlink,
            isEditing: true,
            isReplying: true,
            isAnswering: false,
            selectedId: this.props.id
          })
        }
        else if(options[buttonIndex] === "Mark Answer") {
          // Mark Answer
          this.handleMarkAnswer(question, answer)
        }
      }
    )
  }

  // On Vote Click
  handleVoteClick(author, permlink, isUpvoted, isDownvoted, id, isLongPress = false){
    // If not logged in go to login screen
    if(!this.props.isAuthenticated) return Actions.login()

    // If Long Press
    if(isLongPress){
      // Values for Options
      const buttonValues = {"Unvote": 0, "0%": 0, "25%": 2500, "50%": 5000, "75%": 7500, "100%": 10000}
      // ActionSheet Options
      const options = ["25%", "50%", "75%", "100%", "Cancel"]
      
      // Add Unvote to options if user has already voted
      if(isUpvoted || isDownvoted){
        options.unshift("Unvote")
      }

      // ActionSheet
      ActionSheet.show(
        {
          options: options, 
          cancelButtonIndex: options.length-1, 
          title: "Cast Vote"
        },
        buttonIndex => {
          if(options[buttonIndex] !== "Cancel") {
            // Vote weight chosen from options
            const weight = buttonValues[options[buttonIndex]]

            // Vote Answer
            this.props.voteAnswer(
              this.props.user.name,
              author,
              permlink,
              id,
              weight
            ) 
          }
        }
      )
      
    }else{
      // Vote percentage weight
      let weight = this.props.votePercent

      // If upvoted then unvote on click by setting weight to 0
      if(isUpvoted){
        weight = 0
      }

      // Vote Answer
      this.props.voteAnswer(
        this.props.user.user,
        author,
        permlink,
        id,
        weight
      )
    }
  }

  componentWillUnmount(){
    // Close answer form
    this.props.formVisibility({
      formVisible: false,
      editorText: '',
      editingPermlink: '',
      isEditing: false,
      isReplying: false,
      isAnswering: false,
      selectedId: null
    })
  }

  render() {
    const { bgColorStyle, thumbnailStyle, usernameStyle, inputStyle, answerContainerStyle } = styles
    const { id, user, isReplying, isPosting, isEditing, editingPermlink, questionChildrenList, allComments, upvotes, downvotes, currency, rates, pendingVote } = this.props
    const extraData = {currency, rates, upvotes, downvotes, pendingVote}

    return (
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
          <Header headerBack onLogoClick={() => Actions.pop()} />

          <Content contentContainerStyle={bgColorStyle}>
          {
            isReplying ?
            <View>
              {
                !isEditing && 
                <AnswerComponent
                  answer={allComments[this.props.selectedId]} 
                  isNotification={false}
                  repliesById={questionChildrenList}
                  isMarkedAnswer={false}
                  currency={currencySelect(currency, rates)} 
                  isUpvoted={upvotes.includes(this.props.selectedId)}
                  isPendingVote={pendingVote === this.props.selectedId}

                  longVoteClick={() => this.handleVoteClick(
                    allComments[this.props.selectedId].author, 
                    allComments[this.props.selectedId].permlink, 
                    upvotes.includes(this.props.selectedId), 
                    downvotes.includes(this.props.selectedId), 
                    this.props.selectedId, 
                    true
                  )}
                  voteClick={() => this.handleVoteClick(
                    allComments[this.props.selectedId].author, 
                    allComments[this.props.selectedId].permlink, 
                    upvotes.includes(this.props.selectedId), 
                    downvotes.includes(this.props.selectedId), 
                    this.props.selectedId
                  )}
                  optionsClick={() => this.handleAnswerOptionsClick(
                    allComments[this.props.selectedId],
                    downvotes.includes(this.props.selectedId)
                  )}
                  usernameClick={() => Actions.profile({username: allComments[this.props.selectedId].author})}
                  replyClick={() => this.props.formVisibility({
                    formVisible: false,
                    editorText: '',
                    editingPermlink: '',
                    isEditing: false,
                    isReplying: false,
                    isAnswering: false,
                    selectedId: null
                  })}
                />
              }
              <View>
                <Card style={{marginTop: 5, marginBottom: 0}}>
                  <CardSection>
                      <Thumbnail 
                        source={{uri: `https://img.busy.org/@${user.user}`}} 
                        style={thumbnailStyle} 
                      /> 
                      <Text style={usernameStyle}>{`@${user.user}`}</Text>
                    {
                      !this.props.isPosting &&
                        <Right>
                          <Button rounded onPress={() => this.props.formVisibility({
                            formVisible: false,
                            editorText: '',
                            editingPermlink: '',
                            isEditing: false,
                            isReplying: false,
                            isAnswering: false,
                            selectedId: null
                          })}>
                            <Text uppercase={false}>Cancel</Text>
                          </Button>
                        </Right>
                    } 
                  </CardSection>
                  <CardSection>
                      {
                        !this.props.isPosting &&
                          <Button rounded onPress={() => this.setState({preview: !this.state.preview})}>
                            <Text uppercase={false}>{this.state.preview ? 'Edit' : 'Preview'}</Text>
                          </Button>
                      }
                  </CardSection>
                </Card>
                <Card style={answerContainerStyle}>
                  <CardSection>
                    {
                      this.state.preview ?
                      <AnswerPreview>{this.props.editorText}</AnswerPreview> 
                      :
                      <Input 
                        style={inputStyle}
                        numberOfLines={2}
                        placeholder="Add answer here"
                        multiline={true}
                        value={this.props.editorText}
                        onChangeText={value => this.props.formTextUpdate(value)}
                      />
                    }
                  </CardSection>
                </Card>
              </View>
            </View>
            :
            <FlatList
              extraData={extraData}
              data={this.getReplies(allComments)}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <AnswerComponent
                  answer={item} 
                  isNotification={false}
                  repliesById={questionChildrenList}
                  isMarkedAnswer={false}
                  currency={currencySelect(currency, rates)} 
                  isUpvoted={upvotes.includes(item.id)}
                  isPendingVote={pendingVote === item.id}

                  longVoteClick={() => this.handleVoteClick(
                    item.author, 
                    item.permlink, 
                    upvotes.includes(item.id), 
                    downvotes.includes(item.id), 
                    item.id, 
                    true
                  )}
                  voteClick={() => this.handleVoteClick(
                    item.author, 
                    item.permlink, 
                    this.props.upvotes.includes(item.id), 
                    this.props.downvotes.includes(item.id), 
                    item.id
                  )}
                  optionsClick={() => this.handleAnswerOptionsClick(
                    item,
                    downvotes.includes(item.id)
                  )}
                  usernameClick={() => Actions.profile({username: item.author})}
                  replyClick={() => !this.props.isAuthenticated ? Actions.login() : this.props.formVisibility({
                    formVisible: true,
                    editorText: '',
                    editingPermlink: '',
                    isEditing: false,
                    isReplying: true,
                    isAnswering: false,
                    selectedId: item.id
                  })}
                />
                )
              }
            />
          }
          
          </Content>
          {
            isReplying && !isEditing && !isPosting &&
              <Footer onClick={() => this.addReply()}>
                {"Submit Reply"}
              </Footer>
          }
          {
            isReplying && isEditing && !isPosting &&
              <Footer onClick={() => this.addReply()}>
                {"Save Reply"}
              </Footer>
          }
        </Container>
      </StyleProvider>
    )
  }
}

const styles = {
  usernameStyle: {
    color: '#8a8a8a',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5
  },
  thumbnailStyle: {
    width: 44,
    height: 44,
    marginRight: 4
  },
  bgColorStyle: {
    backgroundColor: '#fafafa'
  },
  inputStyle: {
    fontSize: 14
  },
  answerContainerStyle: {
    marginTop: 0, 
    marginBottom: 0, 
    borderTopWidth: 2, 
    borderBottomWidth: 2,
    borderColor: '#ccc', 
    backgroundColor: '#FAFAFA'
  }
}

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  user: getAuthenticatedUser(state),
  question: getSingleQuestion(state),
  isFetchingQuestion: getQuestionIsFetching(state),
  markedAnswer: getMarkedAnswer(state),
  answers: getAnswers(state),
  questionChildrenList: getAnswerRepliesByIdList(state),
  allComments: getAllComments(state),
  isFetchingAnswers: getIsFetchingAnswers(state),
  upvotes: getUpvotes(state),
  downvotes: getDownvotes(state),
  pendingVote: getPendingVote(state),
  reblogList: getReblogList(state),
  pendingReblog: getPendingReblog(state),
  currency: getCurrency(state),
  rates: getRates(state),
  votePercent: getVotePercent(state),
  formVisible: getFormVisibility(state),
  editorText: getEditorText(state),
  isPosting: getIsPosting(state),
  isAnswering: getIsAnswering(state),
  isReplying: getIsReplying(state),
  isEditing: getIsEditing(state),
  editingPermlink: getEditingPermlink(state),
  selectedId: getSelectedId(state),
  error: getQuestionError(state),
  userHasAnswered: getUserHasAnswered(state)
})

export default connect(mapStateToProps, {
  voteAnswer,
  formTextUpdate,
  formVisibility,
  createPost
})(RepliesScreen)