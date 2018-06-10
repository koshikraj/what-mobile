import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import { reblogQuestion } from '../app/reblog/reblogActions'
import { voteQuestion } from '../app/vote/voteActions'

import { 
  getIsAuthenticated, 
  getAuthenticatedUser, 
  getPendingVote, 
  getVotePercent, 
  getRates, 
  getCurrency, 
  getFeedQuestions, 
  getFeedHasMore, 
  getFeedIsFetching, 
  getUpvotes, 
  getDownvotes, 
  getReblogList, 
  getPendingReblog, 
  getFeedError
} from '../reducers'

import { currencySelect } from '../helpers/questionHelpers'

import { 
  getQuestionsFromAPI, 
  getMoreQuestionsFromAPI 
} from './feedActions'

import Config from '../constants/config'

import { 
  FlatList, 
  View, 
  Text, 
  RefreshControl, 
  Clipboard 
} from 'react-native'

import { 
  Spinner, 
  ActionSheet, 
  H3,
  Button
} from 'native-base'

import Question from '../components/question'
import Toast from 'react-native-simple-toast'

class QuestionFeed extends Component {
  constructor(props){
    super(props)
  }

  handleOnClick(author, permlink){
    Actions.question({author, permlink})
  }

  handleProfileClick(username){
    Actions.profile({username})
  }
  
  handleVoteClick(author, permlink, isUpvoted, isDownvoted, id, isLongPress = false){
    if(!this.props.isAuthenticated) return Actions.login()

    // If Long Press
    if(isLongPress){
      const buttonValues = {"Unvote": 0, "0%": 0, "25%": 2500, "50%": 5000, "75%": 7500, "100%": 10000}
      const buttons = ["25%", "50%", "75%", "100%", "Cancel"]
      
      if(isUpvoted || isDownvoted){
        buttons.unshift("Unvote")
      }

      ActionSheet.show(
        {
          options: buttons, 
          cancelButtonIndex: buttons.length-1, 
          title: "Cast Vote"
        },
        buttonIndex => {
          if(buttons[buttonIndex] !== "Cancel") {
            const weight = buttonValues[buttons[buttonIndex]]

            this.props.voteQuestion(
              this.props.user.user,
              author,
              permlink,
              id,
              weight
            )
          }
        }
      )
      
    }else{
      let weight = this.props.votePercent

      if(isUpvoted) weight = 0

      this.props.voteQuestion(
        this.props.user.user,
        author,
        permlink,
        id,
        weight
      )
    }
  }

  handleOptionsClick(isReblogged, isReported, question){
    if(!this.props.isAuthenticated) return Actions.login()
  
    const authenticatedUsername = this.props.user.user

    // Automatically not show reblogs if user is same as author
    if(authenticatedUsername === question.author) isReblogged = true

    const { author, permlink, url, id } = question

    const buttons = ["Copy URL", "Cancel"]
    if(!isReblogged) buttons.unshift("Reblog")
    if(!isReported) buttons.unshift("Report")

    ActionSheet.show(
      {
        options: buttons, cancelButtonIndex: buttons.length-1, title: "Options"
      },
      buttonIndex => {
        if(buttons[buttonIndex] === "Copy URL") {
          Clipboard.setString(`${Config.app.url}${url}`)
          Toast.show("URL Copied To Clipboard", Toast.SHORT)
        }
        else if(buttons[buttonIndex] === "Reblog") {
          this.props.reblogQuestion(authenticatedUsername, author, permlink, id)
        }
        else if(buttons[buttonIndex] === "Report") {
          this.props.voteQuestion(authenticatedUsername, author, permlink, id, -10000)
        }
      }
    )
  }

  handleEndReached(){
    // Get More Questions
    const { sortBy, filter, limit, hasMore } = this.props
    if(hasMore[sortBy]) this.props.getMoreQuestionsFromAPI({sortBy, filter, limit})
  }

  handleFooterComponent(){
    if(this.props.error && this.props.error[this.props.sortBy]){
      return (
        <View style={{padding: 10}}>
          <Button full onPress={() => this.getQuestions() }>
            <Text uppercase={false} style={{color: '#fff'}}>Reload</Text>
          </Button>
        </View>
      )
    }
    else if(this.props.isFetching && this.props.isFetching[this.props.sortBy]){
      return <View><Spinner /></View> 
    } 
    else if(this.props.hasMore && !this.props.hasMore[this.props.sortBy]){
      return <View style={{ padding: 20, alignItems: 'center' }}><H3>No More Results</H3></View>
    }
    else return null
  }

  getQuestions(){
    const { sortBy, filter, limit } = this.props
    this.props.getQuestionsFromAPI({sortBy, filter, limit})
  }

  componentDidMount(){
    this.props.questions[this.props.sortBy] = []
    // Get Questions
    this.getQuestions()
  }

  render(){
    const {
      sortBy, 
      questions, 
      upvotes, 
      downvotes, 
      pendingVote, 
      reblogList, 
      pendingReblog,
      currency, 
      rates 
    } = this.props

    return (
      <FlatList
        data={questions[sortBy]}
        keyExtractor={item => item.id}
        onEndReached={() => this.handleEndReached()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() => this.handleFooterComponent()}
        renderItem={({ item }) => (
          <Question
            listItem 
            question={item} 
            currency={currencySelect(currency, rates)} 
            isUpvoted={upvotes.includes(item.id)}
            isPendingVote={pendingVote == item.id}
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
              upvotes.includes(item.id), 
              downvotes.includes(item.id), 
              item.id
            )}
            optionsClick={() => this.handleOptionsClick(
              (reblogList.includes(item.id) || pendingReblog !== null),
              downvotes.includes(item.id),
              item
            )}
            onClick={() => this.handleOnClick(item.author, item.permlink)}
            usernameClick={() => this.handleProfileClick(item.author)}
          />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => this.getQuestions()}
          />
        }
      />
    )
  }
}


const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  user: getAuthenticatedUser(state),
  questions: getFeedQuestions(state),
  hasMore: getFeedHasMore(state),
  isFetching: getFeedIsFetching(state),
  upvotes: getUpvotes(state),
  downvotes: getDownvotes(state),
  pendingVote: getPendingVote(state),
  reblogList: getReblogList(state),
  pendingReblog: getPendingReblog(state),
  currency: getCurrency(state),
  rates: getRates(state),
  votePercent: getVotePercent(state),
  error: getFeedError(state)
})


export default connect(mapStateToProps, { 
  getQuestionsFromAPI, 
  getMoreQuestionsFromAPI,
  voteQuestion, 
  reblogQuestion 
})(QuestionFeed)