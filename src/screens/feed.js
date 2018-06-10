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

import QuestionFeed from '../feed/feed'
import { getIsAuthenticated, getAuthenticatedUserName } from '../reducers';


class Feed extends Component {
  handleLogoClick(){
    Actions.feed()
  }

  render() {
    return (
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
          <Header
            onLogoClick={this.handleLogoClick}
          />
          <Tabs initialPage={0}>
            <Tab heading="New" style={bgColorStyle}>
              <QuestionFeed sortBy="created" filter={Config.question.parentPermlink} limit={20} />
            </Tab>
            {this.props.isAuthenticated &&
               <Tab heading="Following" style={bgColorStyle}>
               <QuestionFeed sortBy="feed" filter={this.props.authenticatedUsername} limit={40} />
             </Tab>
            }
            <Tab heading="Trending" style={bgColorStyle}>
              <QuestionFeed sortBy="trending" filter={Config.question.parentPermlink} limit={20} />
            </Tab>
          </Tabs>
          <Footer screen="feed" />
        </Container>
      </StyleProvider>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: getIsAuthenticated(state),
  authenticatedUsername: getAuthenticatedUserName(state)
})

export default connect(mapStateToProps, null)(Feed)

const bgColorStyle = {
  backgroundColor: '#fafafa'
}

const swipeTabStyle = {
  alignItems: 'center',
  flex: 1
}
