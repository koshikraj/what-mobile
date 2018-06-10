import React from 'react'
import { View } from 'react-native'
import { Button, Text } from 'native-base'

const CardButton = ({children, onPress}) => {
  return (
    <Button 
      rounded
      onPress={onPress}
      style={buttonStyle}
    >
      <Text uppercase={false}>{children}</Text>
    </Button>
  )
}

const buttonStyle = {
  alignSelf: 'center',
  height: '90%',
  backgroundColor: '#3056aa'
}

export {CardButton}