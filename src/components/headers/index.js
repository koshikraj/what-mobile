import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { Image } from 'react-native'
import {
  Header, Left, Right, Button, Text, Icon, Body, Spinner
} from 'native-base'
import logo from '../../theme/media/logo.png'

class ThemeHeader extends Component {
  constructor(props){
    super(props);
  }

  handleLoginClick(){
    Actions.login();
  }

  handleAskClick(){
    Actions.ask();
  }

  handleSettingsClick(){
    Actions.settings();
  }

  handleSearchClick(){
    Actions.search();
  }

  handleBackClick(){
    Actions.pop();
  }

  toDisplay(headerBack, headerSettings){
    const { headerTextStyle, headerBodyStyle, logoStyle } = styles;
    const { 
      onLogoClick, onSettingsClick, 
      isAuthenticated, isChecking 
    } = this.props;

    if(headerBack){
      return (
        <Header style={{backgroundColor: '#1e1e1e'}}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={this.handleBackClick}>
              <Icon name="arrow-back" /> 
            </Button>
          </Left>
          <Right style={{ flex: 1 }}>
            <Button transparent onPress={onLogoClick}>
              <Image style={logoStyle} source={logo} />
            </Button>
          </Right>
        </Header>
      )
    } else if(headerSettings && isAuthenticated){
      return (
        <Header style={{backgroundColor: '#1e1e1e'}}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={onLogoClick}>
              <Image style={logoStyle} source={logo} />
            </Button>
          </Left>
          <Right style={{ flex: 1 }}>
          <Button transparent onPress={this.handleSettingsClick}>
            <Icon name="settings" /> 
          </Button>
          </Right>
        </Header>
      )
    } else if(!isAuthenticated){
      return (
        <Header style={{backgroundColor: '#1e1e1e'}}>
          <Left style={{ flex: 1 }}>
          <Button transparent onPress={this.handleSearchClick}>
            <Text style={headerTextStyle} uppercase={false}>search</Text>
            <Icon name="search" /> 
          </Button>
        </Left>
        <Body style={headerBodyStyle}>
          <Button transparent onPress={onLogoClick}>
            <Image style={logoStyle} source={logo} />
          </Button>
        </Body>
        <Right style={{ flex: 1 }}>
          {
            isChecking ?
            <Spinner />
            :
            <Button transparent onPress={this.handleLoginClick}>
            <Text style={headerTextStyle} uppercase={false}>login</Text>
            <Icon name="log-in" />
          </Button>
          }
          
        </Right>
        </Header>
      )
    } else {
      return (
        <Header style={{backgroundColor: '#1e1e1e'}}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={this.handleSearchClick}>
              <Text style={headerTextStyle} uppercase={false}>search</Text>
              <Icon name="search" /> 
            </Button>
          </Left>
          <Body style={headerBodyStyle}>
            <Button transparent onPress={onLogoClick}>
              <Image style={logoStyle} source={logo} />
            </Button>
          </Body>
          <Right style={{ flex: 1 }}>
            <Button transparent onPress={this.handleAskClick}>
              <Text style={headerTextStyle} uppercase={false}>ask</Text>
              <Icon name="create" />
            </Button>
          </Right>
        </Header>
      )
    }
  }

  render(){
    const {headerBack, headerSettings} = this.props;
    return this.toDisplay(headerBack, headerSettings)
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.auth.isAuthenticated,
    isChecking: state.auth.isChecking
  }
}

export default connect(mapStateToProps, null)(ThemeHeader)

const styles = {
  headerTextStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff'
  },
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