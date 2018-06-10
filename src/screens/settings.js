import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import { 
  StyleProvider, Container, Content, Item, Input, Icon, Button, Text, 
  Left, List, ListItem, Right, Body, Form, Picker, Switch, View, Spinner
} from 'native-base'

import Header  from '../components/headers'
import Footer from '../components/footers/footerButton'

import theme from '../theme/components'
import material from '../theme/variables/material'

import { setSettings } from '../settings/settingsActions'
import { logoutUser } from '../auth/authActions'
import { getIsLoggingOut, getVotePercent, getCurrency } from '../reducers';


class Settings extends Component {
  constructor(props){
    super(props)

    this.handleLogoutClick = this.handleLogoutClick.bind(this)
  }

  handleLogoutClick(){
    this.props.logoutUser();
  }

  handleBackClick(){
    Actions.pop();
  }

  render() {
    const { bgColorStyle } = styles;
    return (
      
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
          <Header
            headerBack
            onLogoClick={this.handleLogoCLick}
          />
          <Content>
          <Form>
            <ListItem itemDivider>
              <Text>Default Vote Percent</Text>
            </ListItem>  
            <Content>
              <Picker
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.props.votePercent}
                onValueChange={value => this.props.setSettings({prop: 'votePercent', value})}
              >
                <Item label="100%" value={10000} />
                <Item label="90%" value={9000} />
                <Item label="80%" value={8000} />
                <Item label="70%" value={7000} />
                <Item label="60%" value={6000} />
                <Item label="50%" value={5000} />
                <Item label="40%" value={4000} />
                <Item label="30%" value={3000} />
                <Item label="20%" value={2000} />
                <Item label="10%" value={1000} />
              </Picker>
            </Content>
          </Form>
          <Form>
            <ListItem itemDivider>
              <Text>Currency</Text>
            </ListItem>  
            <Content>
              <Picker
                iosHeader="Select one"
                mode="dropdown"
                selectedValue={this.props.currency}
                onValueChange={value => this.props.setSettings({prop: 'currency', value})}
              >
                <Item label="USD" value="USD" />
                <Item label="GBP" value="GBP" />
                <Item label="EUR" value="EUR" />
              </Picker>
            </Content>
          </Form>
          </Content>
          {
            !this.props.isLoggingOut ?
            <Footer onClick={this.handleLogoutClick}>
              Logout
            </Footer>
            :
            <View><Spinner /></View>
          }
          
        </Container>
      </StyleProvider>
    )
  }
}

const mapStateToProps = state => ({
  votePercent: getVotePercent(state), 
  currency: getCurrency(state),
  isLoggingOut: getIsLoggingOut(state)
})

export default connect(mapStateToProps, { 
  setSettings, 
  logoutUser 
})(Settings)

const styles = {
  bgColorStyle: {
    backgroundColor: '#fafafa'
  }
}