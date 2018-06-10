import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import Config from '../constants/config'

import { 
  StyleProvider, Container, Title, Content, 
  Left, Right, Body, Icon, Text, Tabs, Tab, TabHeading,
  Spinner
} from 'native-base'


import theme from '../theme/components'
import material from '../theme/variables/material'

import Header  from '../components/headers'
import Footer from '../components/footers'

import SwipeFeed from '../feed/swipe'



export default class Swipe extends Component {
  handleLogoClick(){
    Actions.refresh()
  }

  render() {
    return (
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
          <Header
            onLogoClick={this.handleLogoClick}
          />
          <Content scrollEnabled={false} contentContainerStyle={{ flex: 1}}>
            <SwipeFeed sortBy="hot" filter={Config.question.parentPermlink} limit={50} />
          </Content>
          <Footer screen="swipe" />
        </Container>
      </StyleProvider>
    )
  }
}

const bgColorStyle = {
  backgroundColor: '#fafafa'
}
