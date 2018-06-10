import React from 'react'
import { View } from 'react-native'

export default ({children, style}) => {
  return(
    <View style={[containerStyle, style]}>
      {children}
    </View>
  )
}

const containerStyle = {
  backgroundColor: '#fff',
  paddingTop: 10,
  paddingBottom: 10,
  justifyContent:'center'
}
