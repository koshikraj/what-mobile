import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { currencySelect } from '../helpers/questionHelpers'
import { FlatList, View, Text, RefreshControl } from 'react-native'
import { ActionSheet, Spinner, H3 } from 'native-base'

import  { 
  getIsAuthenticated, 
  getAuthenticatedUser, 
  getAnswers, 
  getHasMoreAnswers, 
  getIsFetchingAnswers, 
  getPendingVote, 
  getCurrency, 
  getRates,
  getVotePercent, 
  getDownvotes,
  getUpvotes
} from '../reducers'

import { getFeedAnswers } from './answersActions'
import { voteAnswer } from '../app/vote/voteActions'

import AnswerItem from '../components/answer'

class AnswerFeed extends Component {

  handleOnClick(url){
    const urlParams = url.split("/")
    const author = urlParams[2].substr(1)
    const permlink = urlParams[3].split("#")[0]
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

            this.props.voteAnswer(
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
      
      this.props.voteAnswer(
        this.props.user.user,
        author,
        permlink,
        id,
        weight
      )
    }
  }

  handleFooterComponent(){
    if(this.props.isFetching){
      return <View><Spinner /></View> 
    } 
    else if(!this.props.hasMore){
      return (
        <View style={{ padding: 20, alignItems: 'center' }}>
          <H3>No More Results</H3>
        </View>
      )
    }
    else return null
  }

  getAnswers(){
    if(this.props.username !== null) 
      this.props.getFeedAnswers(this.props.username, this.props.replies, this.props.sortBy)
  }

  componentDidMount(){
    this.getAnswers()
  }

  render(){
    const { 
      sortBy,
      answers, 
      user, 
      currency, 
      rates, 
      pendingVote, 
      upvotes, 
      downvotes 
    } = this.props

    return (
      <FlatList
        data={answers[sortBy]}
        keyExtractor={item => item.id}
        ListFooterComponent={() => this.handleFooterComponent()}
        renderItem={({ item }) => (
          <AnswerItem
            answer={item} 
            isNotification={true}
            isMarkedAnswer={false}
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
            onClick={() => this.handleOnClick(item.url)}
            usernameClick={() => this.handleProfileClick(item.author)}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={() => this.getAnswers()}
          />
        }
      />
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  user: getAuthenticatedUser(state),
  answers: getAnswers(state),
  hasMore: getHasMoreAnswers(state),
  isFetching: getIsFetchingAnswers(state),
  upvotes: getUpvotes(state),
  downvotes: getDownvotes(state),
  pendingVote: getPendingVote(state),
  currency: getCurrency(state),
  rates: getRates(state),
  votePercent: getVotePercent(state)
})


export default connect(mapStateToProps, { 
  getFeedAnswers, 
  voteAnswer
})(AnswerFeed)