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

class QuestionScreen extends Component {
  constructor(props){
    super(props)

    // Preview For Answer
    this.state = {
      preview: false
    }

    // Binding Functions
    this.renderQuestion = this.renderQuestion.bind(this)
    this.renderAnswers = this.renderAnswers.bind(this)
    this.renderFooter = this.renderFooter.bind(this)
  }

  // Before render clear everything
  componentWillMount(){
    // Reset Question Screen
    this.props.question = {}
    this.props.answers.question = []

    // Close answer form
    this.props.formVisibility({
      formVisible: false,
      editorText: '',
      editingPermlink: false,
      isEditing: false,
      isReplying: false,
      isAnswering: false,
      selectedId: null
    })
  }

  // On render get question
  componentDidMount(){
    const { author, permlink } = this.props
    // Get Question
    this.props.getQuestion(author, permlink)
  }

  /**
   * Post or edit answer then send to STEEM blockchain
   */
  addAnswer(data){
    // Get question and user
    const { question, user, editorText, editingPermlink, isEditing } = this.props

    // Create post data
    const postData = createPostData(
      editorText,
      question, 
      user.user,
      editingPermlink,
      isEditing
    )

    // Send answer to STEEM blockchain
    this.props.createPost(postData, false)
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

  // Mark Answer
  handleMarkAnswer(question, answer, isMarking = true){
    // Get metadata for question
    let jsonMetadata = getMetadata(question)
    
    if(isMarking){
      // Create answer in JSON metadata
      jsonMetadata.answer = {
        author: answer.author,
        body: answer.body,
        date: answer.created,
        id: answer.id
      }
    }else{
      // Remove answer in JSON metadata
      if(jsonMetadata.hasOwnProperty("answer")){
        delete jsonMetadata.answer
      }
    }

    // Create Post Data
    const postData = {
      parentAuthor: '',
      parentPermlink: question.parent_permlink,
      author: question.author,
      permlink: question.permlink,
      title: question.title,
      category: question.category,
      body: question.body,
      jsonMetadata,
      reward: '50',
      isUpdating: true
    }

    // Add answer to question metadata then to STEEM blockchain
    this.props.createPost(postData, true, true)
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
            isReplying: false,
            isAnswering: true,
            selectedId: null
          })
        }
        else if(options[buttonIndex] === "Mark Answer") {
          // Mark Answer
          this.handleMarkAnswer(question, answer)
        }
      }
    )
  }

  // On options click
  handleOptionsClick(isReblogged, isReported, question, markedAnswerExist = false){
    // If not logged in go to login screen
    if(!this.props.isAuthenticated) return Actions.login()
    
    // Get username
    const authenticatedUsername = this.props.user.user

    // Get question details
    const { author, permlink, url, id } = question

    // ActionSheet Options
    const options = ["Copy URL", "Cancel"]

    if(!isReblogged && authenticatedUsername !== author) options.unshift("Reblog")
    if(!isReported && authenticatedUsername !== author) options.unshift("Report")
    if(authenticatedUsername === author && !isModifyExpired(question)) options.unshift("Edit Question")
    if(markedAnswerExist && authenticatedUsername === author && !isModifyExpired(question)) options.unshift("Remove Answer")

    // ActionSheet
    ActionSheet.show(
      {
        options: options, 
        cancelButtonIndex: options.length-1, 
        title: "Options"
      },
      buttonIndex => {
        if(options[buttonIndex] === "Copy URL") {
          // Copy URL to Clipboard
          Clipboard.setString(`${Config.app.url}${url}`)
          Toast.show("URL Copied To Clipboard", Toast.SHORT)
        }
        else if(options[buttonIndex] === "Reblog") {
          // Reblog question
          this.props.reblogQuestion(authenticatedUsername, author, permlink, id)
        }
        else if(options[buttonIndex] === "Report") {
          // Downvote question
          this.props.voteQuestion(authenticatedUsername, author, permlink, id, -10000)
        }
        else if(options[buttonIndex] === "Edit Question") {
          // Edit question
          Actions.ask({isEditing: true, question})
        }
        else if(options[buttonIndex] === "Remove Answer") {
          // Remove Marked Answer
          this.handleMarkAnswer(question, {}, false)
        }
      }
    )
  }

  // On Vote Click
  handleVoteClick(author, permlink, isUpvoted, isDownvoted, id, isAnswer = false, isLongPress = false){
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
            
            if(isAnswer){
              // Vote Answer
              this.props.voteAnswer(
                this.props.user.name,
                author,
                permlink,
                id,
                weight
              )
            }else{
              // Vote Question
              this.props.voteQuestion(
                this.props.user.name,
                author,
                permlink,
                id,
                weight,
                true
              )
            }
            
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

      if(isAnswer){
        // Vote Answer
        this.props.voteAnswer(
          this.props.user.user,
          author,
          permlink,
          id,
          weight
        )
      }else{
        // Vote Question
        this.props.voteQuestion(
          this.props.user.user,
          author,
          permlink,
          id,
          weight,
          true
        )
      }
    }
  }

  
  // Displaying question on the screen
  renderQuestion(){
    const { 
      question, 
      isFetchingQuestion, 
      currency, 
      rates,
      markedAnswer,
      upvotes, 
      downvotes,
      pendingVote,
      reblogList,
      pendingReblog
    } = this.props

    // Fetching Question
    if(isFetchingQuestion){
      return (
        <Card>
          <CardSection style={{alignItems: 'center'}}>
              <Spinner />
          </CardSection>
        </Card>
      )
    }
    // Question Exists (Using id property to verify)
    else if(question.hasOwnProperty("id")){
      return (
        <QuestionComponent
          question={question} 
          currency={currencySelect(currency, rates)} 
          isUpvoted={upvotes.includes(question.id)}
          isPendingVote={pendingVote === question.id}
          longVoteClick={() => this.handleVoteClick(
            question.author, 
            question.permlink,
            upvotes.includes(question.id), 
            downvotes.includes(question.id), 
            question.id,
            false,
            true
          )}
          voteClick={() => this.handleVoteClick(
            question.author, 
            question.permlink,
            upvotes.includes(question.id), 
            downvotes.includes(question.id), 
            question.id
          )}
          usernameClick={() => Actions.profile({username: question.author})}
          optionsClick={() => this.handleOptionsClick(
            (reblogList.includes(question.id) || pendingReblog !== null),
            downvotes.includes(question.id),
            question,
            markedAnswer !== null
          )}
        />
      )
    }
  }

  // Display answers on the screen
  renderAnswers(){
    const {
      user,
      answers,
      isFetchingAnswers,
      isAnswering,
      isReplying,
      formVisible,
      allComments,
      selectedId,
      markedAnswer,
      currency,
      rates,
      upvotes,
      downvotes,
      pendingVote,
      questionChildrenList
    } = this.props

    // Create answer props object so the Flatlist can update accordingly
    const answerProps = {markedAnswer, currency, rates, upvotes, downvotes, pendingVote}

    // Get styles
    const { usernameStyle, thumbnailStyle, bgColorStyle, inputStyle, answerContainerStyle } = styles


    if(formVisible){
      return;
    }
    // Getting Answers
    else if(isFetchingAnswers){
      return (
        <Card>
          <CardSection style={{alignItems: 'center'}}>
              <Spinner />
          </CardSection>
        </Card>
      )
    }
    
    // Answers Exists (Using length to verify)
    else if(answers.question.length > 0){

      // Get Username of Answer
      // Answer is object that contains: author, body, date, id
      let markedAnswerId = null
      if(markedAnswer !== null && markedAnswer.id) markedAnswerId = markedAnswer.id
      
      return (
        <FlatList
          extraData={answerProps}
          data={answers.question}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <AnswerComponent
              answer={item} 
              isNotification={false}
              repliesById={this.props.questionChildrenList}
              isMarkedAnswer={markedAnswerId === item.id}
              currency={currencySelect(currency, rates)} 
              isUpvoted={upvotes.includes(item.id)}
              isPendingVote={pendingVote === item.id}

              longVoteClick={() => this.handleVoteClick(
                item.author, 
                item.permlink, 
                this.props.upvotes.includes(item.id), 
                this.props.downvotes.includes(item.id), 
                item.id, 
                true,
                true
              )}
              voteClick={() => this.handleVoteClick(
                item.author, 
                item.permlink, 
                this.props.upvotes.includes(item.id), 
                this.props.downvotes.includes(item.id), 
                item.id, 
                true
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
      )
    }
  }

  // Displaying the footer
  renderFooter(){
    const {
      isAuthenticated, 
      isPosting, 
      isAnswering, 
      isReplying,
      isEditing, 
      userHasAnswered
    } = this.props

    // if Logged in (answer buttons will show)
    if(isAuthenticated){

      // if user has answered and not editing answer and answer is not being posted
      if(userHasAnswered && !isEditing && !isPosting && !isReplying) return;
      
      // Answering
      if(isAnswering){
        // Submit Answer
        if(!isEditing && !isPosting){
          return (
            <Footer onClick={() => this.addAnswer()}>
              {"Submit Answer"}
            </Footer>
          )
        }
        // Save Editing Answer
        else if(isEditing && !isPosting){
          return (
            <Footer onClick={() => this.addAnswer()}>
              {"Save Answer"}
            </Footer>
          )
        }
      }
      // Replying
      else if(isReplying){
        // Submit Reply
        if(!isEditing && !isPosting){
          return (
            <Footer onClick={() => this.addReply()}>
              {"Submit Reply"}
            </Footer>
          )
        }
      }
      // Add Answer
      else if(!isPosting){
        return (
          <Footer onClick={() => this.props.formVisibility({
            formVisible: true,
            editorText: '',
            editingPermlink: '',
            isEditing: false,
            isReplying: false,
            isAnswering: true,
            selectedId: null
          })}>
            {"Add Answer"}
          </Footer>
        )
      }
      // Being posted to STEEM Blockchain
      else if(isPosting){
        return <View><Spinner /></View>
      }      
    }   
  }

  render(){
    const { 
      bgColorStyle, 
      answerContainerStyle, 
      thumbnailStyle, 
      usernameStyle, 
      inputStyle 
    } = styles

    const { 
      user, 
      allComments, 
      selectedId, 
      questionChildrenList, 
      upvotes, 
      downvotes,
      currency,
      rates,
      pendingVote,
      formVisible,
      isReplying
    } = this.props
    return (
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
        {
          this.props.fromLaunch ?
          <Header onLogoClick={() => Actions.pop()} />
          :
          <Header headerBack onLogoClick={() => Actions.pop()} />
        }
          
          <Content contentContainerStyle={bgColorStyle}>
            {
              this.props.error && 
              <View style={{padding: 10}}>
                <Button full onPress={() => this.props.getQuestion(
                  this.props.author,
                  this.props.permlink
                )}>
                  <Text uppercase={false} style={{color: '#fff'}}>Reload</Text>
                </Button>
              </View>
            }
            {
              !isReplying && this.renderQuestion() 
            }
            {
              formVisible &&
                <View>
                  {
                    isReplying && 
                    <AnswerComponent
                      answer={allComments[selectedId]} 
                      isNotification={false}
                      repliesById={questionChildrenList}
                      isMarkedAnswer={false}
                      currency={currencySelect(currency, rates)} 
                      isUpvoted={upvotes.includes(selectedId)}
                      isPendingVote={pendingVote === selectedId}
        
                      longVoteClick={() => this.handleVoteClick(
                        allComments[selectedId].author, 
                        allComments[selectedId].permlink, 
                        upvotes.includes(selectedId), 
                        downvotes.includes(selectedId), 
                        selectedId, 
                        true
                      )}
                      voteClick={() => this.handleVoteClick(
                        allComments[selectedId].author, 
                        allComments[selectedId].permlink, 
                        upvotes.includes(selectedId), 
                        downvotes.includes(selectedId), 
                        selectedId
                      )}
                      optionsClick={() => this.handleAnswerOptionsClick(
                        allComments[selectedId],
                        downvotes.includes(selectedId)
                      )}
                      usernameClick={() => Actions.profile({username: allComments[selectedId].author})}
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
            }
            {
              !this.props.isAnswering && !this.props.error && !this.props.isReplying &&
              <Card style={{marginTop: 5, marginBottom: 5}}>
                <CardSection><H3>{`${this.props.answers.question.length} Answers`}</H3></CardSection>
              </Card>
            }
            
            {this.renderAnswers()}
          </Content>
          {this.renderFooter()} 
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
  getQuestion, 
  voteQuestion, 
  voteAnswer,
  reblogQuestion,
  formTextUpdate,
  formVisibility,
  createPost
})(QuestionScreen)
