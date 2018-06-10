import React from 'react'
import Markdown from 'react-native-markdown-renderer'
import Config from '../constants/config'


export default ({children}) => {
  return (
      <Markdown
        style={Config.markdownSettings.style} 
        rules={Config.markdownSettings.rules}
      >
        {children}
      </Markdown>
  );
}

