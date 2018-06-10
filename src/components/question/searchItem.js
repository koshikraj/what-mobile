import React, { Component } from 'react'

import moment from 'moment'

import Card from '../card'
import CardSection from '../card/cardSection'
import { CardSectionTitle } from './elements'

import { 
  View,
  Dimensions
} from 'react-native'

import { 
  Icon, 
  Text, 
  Right, 
  Thumbnail, 
  ActionSheet 
} from 'native-base'


import logo from '../../theme/media/logo.png'

export default class Question extends Component {
  constructor(props){
    super(props);
  }

  render(){
    const {usernameClick, onClick, question} = this.props 
    const {author, created, title} = this.props.question
    return (
      <Card style={styles.listItemCardStyle}>
        <CardSection>
          <Text style={styles.usernameStyle} onPress={usernameClick}>{`@${author}`}</Text>
          <Text style={styles.dateStyle}>{`• ${moment(created).fromNow()}`}</Text>
        </CardSection>
        <CardSectionTitle 
          title={title}
          onClick={onClick}
        />
    </Card>
    )
  }
}

const styles = {
  listItemCardStyle: {
    marginBottom: 22
  },
  usernameStyle: {
    color: '#8a8a8a',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5
  },
  dateStyle: {
    color: '#727272',
    fontSize: 12
  }
}