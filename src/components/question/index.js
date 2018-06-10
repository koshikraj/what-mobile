import React, { Component } from 'react'

import moment from 'moment'

import Config from '../../constants/config'
import Card from '../card'
import CardSection from '../card/cardSection'
import { CardSectionHeader, CardSectionTitle, CardSectionAnswer, CardButton, CardTag, AnswerCountTab, CardSectionFooter } from './elements'

import { View, Dimensions } from 'react-native'
import { Button, Icon, Text, Right, Thumbnail, ActionSheet } from 'native-base'
import Markdown from 'react-native-markdown-renderer'

import logo from '../../theme/media/logo.png'

import { 
  numFormatShort, 
  truncateText,
  hasMarkedAnswer, 
  getWhatCategory, 
  getTotalPayout, 
  hasDescription, 
  getTags 
} from '../../helpers/questionHelpers'

export default class Question extends Component {
  constructor(props){
    super(props);

  }

  // Convert Currency (USD to other currencies like GBP, EUR)
  convertCurrency(amount, rate){
    return amount * rate
  }
  
  // Show Marked Answer
  markedAnswer(answer, onClick){
    if(answer){
      return (
        <CardSectionAnswer
          author={answer.author}
          date={moment(answer.date).fromNow()}
          body={truncateText(answer.body)}
          onClick={onClick}
        />
      )
    }
  }

  // Create Tags
  createTags(tags){
    let tagCompArray = []
    tags.forEach((tag, index) => {
      tagCompArray.push(<CardTag key={index}>{tag}</CardTag>)
    })
    return tagCompArray;
  }

  // Show Tags
  showTags(tags){
    if(tags.length > 0) return <CardSection style={{flex: 1, flexDirection: 'row', flexWrap: 'wrap'}}>{ this.createTags(tags) }</CardSection>
  }
  
  // Show Description
  descriptionExists(desc){
    if(desc) return (
      <CardSection>
        <Markdown 
          style={Config.markdownSettings.style}
          rules={Config.markdownSettings.rules}
        >
          {desc}
        </Markdown>
      </CardSection>
    )
  }

  // Single Answer
  isSingleAnswer(count){
    if(count > 1) return 'answers' 
    return 'answer'
  }

  // Show Answers Count
  answerCountDisplay(count){
    if(count > 0) return <AnswerCountTab count={`${numFormatShort(count)} ${this.isSingleAnswer(count)}`} justCount />
  }  

  // Show Answers Count - List Item
  hasAnswers(count, onClick){
    if(count == 0) return <CardButton onPress={onClick}>Add Answer</CardButton>
    else return <AnswerCountTab onClick={onClick} count={`${numFormatShort(count)} ${this.isSingleAnswer(count)}`} />
  }

  // Check if user has liked the question
  hasUserLiked(isLiked){
    if(isLiked) return {color: '#3056aa'} 
    else return {color: '#727272'}
  }

  // What  To Display
  toDisplay(listItem = false, swipeItem = false){
    const {
      question, 
      currency, 
      isUpvoted, 
      isPendingVote, 
      optionsClick, 
      voteClick, 
      longVoteClick,
      usernameClick, 
      onClick
    } = this.props

    const {
      author, 
      permlink, 
      created, 
      title, 
      net_votes, 
      children, 
      id
    } = this.props.question

    // Currencies
    const totalPayout = getTotalPayout(question)
    const convertedTotalPayout = this.convertCurrency(totalPayout, currency.rate)

    if(listItem){
      return (
        <Card style={styles.listItemCardStyle}>
          <CardSectionHeader
            category={getWhatCategory(question)}
            username={author}
            date={`• ${moment(created).fromNow()}`}
            handleOptions={optionsClick}
            handleProfile={usernameClick}
          />
          <CardSectionTitle 
            title={title}
            onClick={onClick}
          />
          { this.markedAnswer(hasMarkedAnswer(question), onClick) }
          <CardSectionFooter
            likes={numFormatShort(net_votes)}
            likeColour={this.hasUserLiked(isUpvoted)}
            hasAnswers={this.hasAnswers(children, onClick)}
            earnings={`${currency.symbol}${numFormatShort(convertedTotalPayout, 2)}`}
            isRefreshing={isPendingVote}
            likeClick={voteClick}
            longLikeClick={longVoteClick}
          />
        </Card>
      )
    } else if(swipeItem){
        return (
          <Card style={styles.swipeItemCardStyle}>
            <CardSectionHeader
              swipeTab
              category={getWhatCategory(question)}
              username={author}
              date={`• ${moment(created).fromNow()}`}
              handleOptions={optionsClick}
              handleProfile={usernameClick}
            />
            <CardSectionTitle 
              title={title}
              onClick={onClick}
            />
            { this.markedAnswer(hasMarkedAnswer(question), onClick) }
            <CardSectionFooter
              likes={numFormatShort(net_votes)}
              likeColour={this.hasUserLiked(isUpvoted)}
              hasAnswers={this.answerCountDisplay(children)}
              earnings={`${currency.symbol}${numFormatShort(convertedTotalPayout, 2)}`}
              isRefreshing={isPendingVote}
              likeClick={voteClick}
              longLikeClick={longVoteClick}
            />
          </Card>
       )
    } else {
      return (
        <Card>
          <CardSectionHeader
            questionScreen
            category={getWhatCategory(question)}
            username={author}
            date={`• ${moment(created).fromNow()}`}
            handleOptions={optionsClick}
            handleProfile={usernameClick}
          />
          <CardSectionTitle 
            title={title}
            onClick={onClick}
          />
          { this.descriptionExists(hasDescription(question)) }
          { this.showTags(getTags(question)) }
          <CardSectionFooter
            likes={numFormatShort(net_votes)}
            likeColour={this.hasUserLiked(isUpvoted)}
            hasAnswers={this.answerCountDisplay(children)}
            earnings={`${currency.symbol}${numFormatShort(convertedTotalPayout, 2)}`}
            isRefreshing={isPendingVote}
            likeClick={voteClick}
            longLikeClick={longVoteClick}
          />
      </Card>
      )
    }
  }

  render(){
    return this.toDisplay(this.props.listItem, this.props.swipeItem)
  }
}

const styles={
  listItemCardStyle: {
    marginBottom: 22
  },
  swipeItemCardStyle: {
    alignSelf: 'center',
    width: Dimensions.get('window').width - 20,
    borderWidth: 1,
    borderColor: '#dbdbdb'
  }
}