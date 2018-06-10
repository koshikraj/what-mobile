import React from 'react'
import { Text, Thumbnail, View } from 'native-base'
import Markdown from 'react-native-markdown-renderer'
import Config from '../../../constants/config'

const CardSectionBody = ({children, isNotification}) => {
  return (
    <View style={styles.sectionStyle}>
      <Markdown style={Config.markdownSettings.style} rules={Config.markdownSettings.rules}>
        {children}
      </Markdown>
    </View>
  )
}


const styles = {
  sectionStyle: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 10,
    alignItems: 'flex-start',
    flexDirection: 'column'
  }
}

export {CardSectionBody}