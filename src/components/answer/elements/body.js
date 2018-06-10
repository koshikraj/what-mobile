import React from 'react'
import { Text, Thumbnail, View } from 'native-base'
import Markdown from 'react-native-markdown-renderer'
import removeMd from 'remove-markdown'
import Config from '../../../constants/config'

const CardSectionBody = ({children, isNotification, onClick}) => {
  if(!isNotification){
    return (
      <View style={styles.sectionStyle}>
        <Markdown style={Config.markdownSettings.style} rules={Config.markdownSettings.rules}>
          {children}
        </Markdown>
      </View>
    )
  }else{
    return (
      <View style={styles.sectionStyle}>
        <Text style={{fontSize: 14}} onPress={onClick}>
          {removeMd(children)}
        </Text>
      </View>
    )
  }
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