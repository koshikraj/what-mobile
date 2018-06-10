import React, { Component } from 'react'

import moment from 'moment'

import Card from '../card'
import CardSection from '../card/cardSection'
import { 
  CardSectionHeader, 
  CardSectionTitle, 
  CardSectionBody, 
  CardSectionFooter,
  CardSectionReplies
} from './elements'

import { 
  View, 
  Icon, 
  Text, 
  Right, 
  Thumbnail, 
  ActionSheet 
} from 'native-base'

import logo from '../../theme/media/logo.png'

import { 
  numFormatShort, 
  truncateText,
  getTotalPayout
} from '../../helpers/questionHelpers'

// Convert Currency (USD to other currencies like GBP, EUR)
const convertCurrency = (amount, rate) => {
  return amount * rate
}  

// Check if user has liked the answer
const hasUserLiked = (isLiked) => {
  if(isLiked) return {color: '#3056aa'} 
  else return {color: '#727272'}
}

export default (props) => {
  const {
    answer, 
    currency, 
    isUpvoted, 
    isPendingVote, 
    repliesById,
    replyClick,
    optionsClick, 
    voteClick, 
    longVoteClick,
    usernameClick,
    isMarkedAnswer, 
    isNotification, 
    onClick
  } = props


  const {
    author, 
    permlink, 
    created, 
    root_title, 
    body, 
    net_votes, 
    children, 
    id
  } = answer

  // Currencies
  const totalPayout = getTotalPayout(answer)
  const convertedTotalPayout = convertCurrency(totalPayout, currency.rate)

  return (
    <Card style={ isMarkedAnswer ? styles.markedAnswerStyle : styles.normalCardStyle }>
      <CardSectionHeader
        username={author}
        date={`• ${moment(created).fromNow()}`}
        handleProfile={usernameClick}
        isNotification={isNotification}
        isMarkedAnswer={isMarkedAnswer}
        handleOptions={optionsClick}
      />
      {isNotification && <CardSectionTitle title={`RE: ${root_title}`} onClick={onClick} />}
      <CardSectionBody 
        isNotification={isNotification} 
        onClick={onClick}
      >
        {isNotification ? truncateText(body) : body}
      </CardSectionBody>
      <CardSectionFooter
        likes={numFormatShort(net_votes)}
        likeColour={hasUserLiked(isUpvoted)}
        earnings={`${currency.symbol}${numFormatShort(convertedTotalPayout, 2)}`}
        isRefreshing={isPendingVote}
        likeClick={voteClick}
        longLikeClick={longVoteClick}
      />
      {!isNotification && <CardSectionReplies onPress={replyClick} id={id} repliesById={repliesById} />}
    </Card>
  )
}

const styles = {
  markedAnswerStyle: {
    backgroundColor: '#fff5bd',
    marginBottom: 4
  },
  normalCardStyle: {
    backgroundColor: '#fff',
    marginBottom: 4
  }
}