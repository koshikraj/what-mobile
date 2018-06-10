import React from 'react'
import { Actions } from 'react-native-router-flux'
import { View, Button, Text } from 'native-base'

const goToSearch = (text) => {
  Actions.search({text})
}

const CardTag = ({children, style}) => {
  return (
    <Button 
      transparent
      onPress={() => goToSearch(children)}
    >
      <View style={[styles.tagStyle, style]}>
        <Text uppercase={false} style={styles.tagTextStyle}>{children}</Text>
      </View>
    </Button>
  )
}

const styles = {
  tagStyle: {
    borderRadius:  12,
    borderWidth: 1,
    borderColor: '#3056aa',
    padding: 2,
    paddingLeft: 8,
    paddingRight: 8,  
    marginRight: 12
  },
  tagTextStyle: {
    fontSize: 12,
    color: '#3056aa'
  }
}

export {CardTag}