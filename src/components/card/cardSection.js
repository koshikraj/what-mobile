import React from 'react'
import { View } from 'react-native'

export default (props) => {
  return (
    <View style={[sectionStyle, props.style]}>
      {props.children}
    </View>
  )
}

const sectionStyle = {
  paddingRight: 20,
  paddingLeft: 20,
  paddingTop: 10,
  paddingBottom: 10,
  alignItems: 'center',
  flexDirection: 'row'
}
