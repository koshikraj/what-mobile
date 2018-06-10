import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import { 
  StyleProvider, Container, Title, Content, 
  Left, Right, Body, Icon, Text, Tabs, Tab, TabHeading,
  Spinner
} from 'native-base'


import theme from '../theme/components'
import material from '../theme/variables/material'

import Header  from '../components/headers'
import Footer from '../components/footers'

import AnswerFeed from '../answers/feed'


class Answers extends Component {
  handleLogoClick(){
    Actions.answers()
  }

  render() {
    return (
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
          <Header
            onLogoClick={this.handleLogoClick}
          />
            <AnswerFeed 
              username={this.props.authenticatedUsername} 
              replies={true} 
              sortBy="feed" 
            />
          <Footer screen="answers" />
        </Container>
      </StyleProvider>
    )
  }
}

const mapStateToProps = state => ({
  authenticatedUsername: state.auth.user.user
})

export default connect(mapStateToProps, null)(Answers)

const bgColorStyle = {
  backgroundColor: '#fafafa'
}

const swipeTabStyle = {
  alignItems: 'center',
  flex: 1
}
