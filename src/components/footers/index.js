import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { Footer, FooterTab, Button, Icon, Text, Badge } from 'native-base'

class ThemeFooter extends Component {
  constructor(props){
    super(props);
  }

  addActive(tabName){
    return this.props.screen === tabName ? true : false
  }

  isSameTab(tabName){
    if(this.props.screen === tabName){
      if(this.props.isAuthenticated && tabName === 'profile') return Actions[tabName]
      return Actions.refresh()
    }
    else{
      return Actions[tabName]
    }
  }

  render(){
    return (
      <Footer>
            <FooterTab>
              <Button vertical active={this.addActive('feed')}
                onPress={this.isSameTab('feed')}
              >
                <Icon android="md-list" ios="ios-list-box-outline" />
                <Text uppercase={false}>Feed</Text>
              </Button>
              <Button vertical active={this.addActive('swipe')}
                onPress={this.isSameTab('swipe')}
              >
                <Icon android="md-swap" ios="ios-swap-outline" />
                <Text uppercase={false}>Swipe</Text>
              </Button>
              {
                this.props.isAuthenticated &&
                <Button vertical active={this.addActive('answers')}
                  onPress={this.isSameTab('answers')}
                  badge={this.props.unreadNotifications > 0 ? true : false}
                >
                  {
                    this.props.unreadNotifications > 0 && 
                    <Badge><Text>{this.props.unreadNotifications > 10 ? "10+" : this.props.unreadNotifications}</Text></Badge>
                  }
                  <Icon android="md-chatboxes" ios="ios-chatboxes-outline" />
                  <Text uppercase={false}>Answers</Text>
                </Button>
              }
              {
                this.props.isAuthenticated &&
                <Button vertical active={this.addActive('profile')}
                  onPress={this.isSameTab('profile')}
                >
                <Icon android="md-person" ios="ios-person-outline" />
                <Text uppercase={false}>Profile</Text>
              </Button>
              }
              
            </FooterTab>
      </Footer>
    )
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  unreadNotifications: state.notification.unreadNotifications
})

export default connect(mapStateToProps, null)(ThemeFooter)