import React from 'react'
import { View } from 'react-native'
import { Text, Right, Icon, Button } from 'native-base'

const CardSectionHeader = ({ 
  username, 
  date, 
  handleProfile, 
  handleOptions, 
  isNotification, 
  isMarkedAnswer
}) => {
  const { 
    sectionStyle, 
    usernameStyle, 
    dateStyle, 
    thumbnailStyle, 
    buttonStyle, 
    answerStyle, 
    notifyAnswerStyle
  } = styles

  return (
    <View style={sectionStyle}>
      <Text style={usernameStyle} onPress={handleProfile}>{`@${username}`}</Text>
      { isNotification && <Text style={notifyAnswerStyle}>answered</Text>}
      <Text style={dateStyle}>{date}</Text>
      {showOptions(isNotification, isMarkedAnswer, handleOptions)}
    </View>
  )
}

const showOptions = (isNotification, isMarkedAnswer, handleOptions = null) => {
  if(!isNotification){
    if(isMarkedAnswer){
      return (
        <Right>
          <Text style={styles.answerStyle}>Answer</Text>
        </Right>
      )
    }
    else{
      return (
        <Right>
          <Button 
            transparent
            onPress={handleOptions}
            style={styles.buttonStyle}
          ><Icon name="more" style={styles.moreBtnStyle} /></Button>
        </Right>
      )
    }
  }
}

const styles = {
  answerStyle: {
    fontSize: 14,
    color: '#3056aa'
  },
  sectionStyle: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 0,
    alignItems: 'center',
    flexDirection: 'row'
  },
  notifyAnswerStyle: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
    marginRight: 5
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
  },
  moreBtnStyle: {
    color: '#727272'
  },
  thumbnailStyle: {
    width: 44,
    height: 44,
    marginRight: 4
  },
  buttonStyle: {
    alignSelf: 'flex-end'
  }
}

export {CardSectionHeader}