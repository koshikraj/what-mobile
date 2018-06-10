import React from 'react'
import { View, Image } from 'react-native'
import { Text } from 'native-base'
import Config from '../../../constants/config'
import removeMd from 'remove-markdown'

const CardSectionAnswer = ({ author, body, date, onClick }) => {
  const { 
    sectionStyle, answeredByContainerStyle, answeredByStyle,
    thumbnailStyle, usernameStyle, answerBodyStyle, dateStyle
  } = styles;

  return (
    <View style={sectionStyle}>
      <View style={answeredByContainerStyle}>
        <Text style={answeredByStyle}>Answered by </Text>
        <Text style={usernameStyle}>{`@${author}`}</Text>
        <Image 
          source={{uri: `https://img.busy.org/@${author}`}} 
          style={thumbnailStyle} 
        /> 
      </View>
      <View>
        <Text style={answerBodyStyle} onPress={onClick}>
        {removeMd(body)}
        </Text>
        <Text style={dateStyle}>{date}</Text>
      </View>
    </View>
  )
}

const styles = {
  sectionStyle: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'column'
  },
  answeredByContainerStyle: {
    alignItems: 'center', 
    flexDirection: 'row'
  },
  answeredByStyle: {
    fontSize: 14, 
    fontWeight: 'bold'
  },
  usernameStyle: {
    color: '#8a8a8a',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5
  },
  thumbnailStyle: {
    width: 33,
    height: 33,
    borderRadius: 16.5
  },
  answerBodyStyle: { 
    fontSize: 14 
  },
  dateStyle: {
    marginTop: 5,
    color: '#727272',
    fontSize: 12
  }
}

export {CardSectionAnswer}