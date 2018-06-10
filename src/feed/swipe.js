import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Swiper from 'react-native-deck-swiper'

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

import { reblogQuestion } from '../app/reblog/reblogActions'
import { voteQuestion } from '../app/vote/voteActions'
import { getQuestionsFromAPI } from './feedActions'

import Config from '../constants/config'

import { 
  View,
  FlatList, 
  Text, 
  RefreshControl,
  Dimensions, 
  Clipboard 
} from 'react-native'

import { 
  Spinner, 
  H3,
  H1, 
  Button, 
  Icon, 
  ActionSheet 
} from 'native-base'

import Question from '../components/question'
import Toast from 'react-native-simple-toast'

class Swipe extends Component {
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

      if(isUpvoted){
        weight = 0
      }

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
        options: buttons, 
        cancelButtonIndex: buttons.length-1, 
        title: "Options"
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

    const questionsToDisplay = questions[sortBy]
    if(this.props.error && this.props.error[this.props.sortBy]){
      return (
        <View style={{padding: 10}}>
          <Button full onPress={() => this.getQuestions() }>
            <Text uppercase={false} style={{color: '#fff'}}>Reload</Text>
          </Button>
        </View>
      )
    }
    else if(questionsToDisplay.length > 0){
      return (
        <View style={{flex: 1}}>
          <Swiper
            cardIndex={0}
            backgroundColor='transparent'
            cards={questionsToDisplay}
            infinite
            showSecondCard={false}
            cardVerticalMargin={120}
            onSwipedRight={(index) => this.handleOnClick(questionsToDisplay[index].author, questionsToDisplay[index].permlink)}
            renderCard={(card) => {
              return (
                <View>
                  <Question
                    swipeItem 
                    question={card} 
                    currency={currencySelect(currency, rates)} 
                    isUpvoted={upvotes.includes(card.id)}
                    isPendingVote={pendingVote == card.id}

                    longVoteClick={() => this.handleVoteClick(
                      card.author, 
                      card.permlink,
                      upvotes.includes(card.id), 
                      downvotes.includes(card.id), 
                      card.id,
                      true
                    )}
                    voteClick={() => this.handleVoteClick(
                      card.author, 
                      card.permlink, 
                      upvotes.includes(card.id), 
                      downvotes.includes(card.id), 
                      card.id
                    )}
                    optionsClick={() => this.handleOptionsClick(
                      (reblogList.includes(card.id) || pendingReblog !== null),
                      downvotes.includes(card.id),
                      card
                    )}
                    onClick={() => this.handleOnClick(card.author, card.permlink)}
                    usernameClick={() => this.handleProfileClick(card.author)}
                  />
                </View>
              )
            }}
            
            >
        </Swiper>
        <View style={styles.headingContainerStyle}>
          <H1 style={styles.headingTextStyle}>Swipe</H1>
          <View style={styles.subHeadingContainerTextStyle}>
          <Text style={styles.subHeadingTextStyle}>Left Swipe: Next Item</Text>
          <Text style={styles.subHeadingTextStyle}>Right Swipe: To Question</Text>
          </View>
        </View>
      </View>
      )
    }
    else if(this.props.isFetching[sortBy]){
      return (
        <View>
          <Spinner />
        </View>
      )
    }
    else{
      return (
        <View style={{ padding: 20, alignItems: 'center' }}><H3>No Results</H3></View>
      )
    }
  }
}

const styles = {
  headingContainerStyle: {
    marginTop: 10,
    alignItems: 'center'
  },
  subHeadingContainerTextStyle: {
    marginTop: 10,
    padding: 10, 
    backgroundColor: '#1e1e1e', 
    borderRadius: 5
  },
  headingTextStyle: {
    color: '#3056aa',
    fontWeight: 'bold' 
  },
  subHeadingTextStyle: {
    color: '#fff',
    fontWeight: 'bold' 
  },
  buttonStyle: {
    marginTop: 10,
    alignSelf: 'center',
    justifyContent:'center',
    height: 60,
    width: 150,
    backgroundColor: '#3056aa'
  },
  buttonTextStyle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20
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
  voteQuestion, 
  reblogQuestion 
})(Swipe)