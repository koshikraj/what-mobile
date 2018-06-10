import React, { Component } from 'react'
import { Image } from 'react-native'
import {
  Header, Body
} from 'native-base'
import logo from '../../theme/media/logo.png'


export default () => {
  return (
    <Header style={{backgroundColor: '#1e1e1e'}}>
      <Body style={styles.headerBodyStyle}>
        <Image style={styles.logoStyle} source={logo} />
      </Body>
    </Header>
  )
}

const styles = {
  headerBodyStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    flex: 1
  },
  logoStyle: {
    alignSelf: 'center',
    width: 50.75,
    height: 27.2
  }
}