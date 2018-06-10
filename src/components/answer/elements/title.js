import React from 'react'
import { View } from 'react-native'
import { Text } from 'native-base'

const CardSectionTitle = ({title, onClick}) => {
  const { sectionStyle, questionStyle} = styles;

  return (
    <View style={sectionStyle}>
      <Text
        style={questionStyle}
        onPress={onClick}
      >
        {title}  
      </Text>
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
    flexDirection: 'row'
  },
  questionStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000'
  }
}

export {CardSectionTitle}