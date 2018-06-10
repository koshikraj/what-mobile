import React from 'react'
import { View } from 'react-native'
import { Text } from 'native-base'
import { CardButton } from './button'

const AnswerCountTab = ({count, justCount, onClick}) => {
  const { containerStyle, viewCountStyle } = styles;
  return (
    <View style={containerStyle}>
      {!justCount && 
      <CardButton onPress={onClick}>Answers</CardButton>
      }
      <Text style={viewCountStyle}>
          {count}
      </Text>
    </View>
  )
}

const styles = {
  containerStyle: {
    flexDirection: 'row', alignItems:'center'
  },
  viewCountStyle: {
    marginLeft: 15,
    color: '#727272',
    fontSize: 14,
    fontWeight: 'bold'
  }
}

export {AnswerCountTab}