import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { Linking, View, Platform, Image, WebView } from 'react-native'

import { parseUrl } from '../helpers/externalUrl'
import { authenticateUser, checkLoginExist } from '../auth/authActions'
import steemConnectAPI from '../steemConnectAPI'
import Config from '../constants/config'

import { 
  StyleProvider, Container, Header, Footer, Title, Content, Button,
  Left, Right, Body, Icon, Text, H1, Spinner
} from 'native-base'

import material from '../theme/variables/material'
import theme from '../theme/components'
import logo from '../theme/media/logo-white.png'
import { getIsCheckingAuth } from '../reducers';

class Login extends Component {
  openSteemConnect(){
    steemConnectAPI.setCallbackURL(Config.steemConnectCallbackURL.default)
    Actions.browser({url: steemConnectAPI.getLoginURL()})
  }

  openSteemitSignUpUrl(){
    Actions.browser({url: Config.app.signUpURL})
  }

  handleBackClick(){
    Actions.pop()
  }


  render() {
    //Styling
    material.toolbarDefaultBg = undefined;
    material.footerDefaultBg = undefined;
    material.toolbarDefaultBorder = undefined;
    const { 
      containerStyle, contentStyle, logoStyle, 
      buttonStyle, h1Style, footerStyle, footerTextStyle,
      buttonTextStyle, headerBodyStyle
    } = styles;

    return (
      <StyleProvider style={theme(material)}>
        <Container style={ containerStyle }>
        <Header style={{backgroundColor: 'rgba(0,0,0,0)'}}>
          <Left style={{ flex: 1 }}>
            <Button transparent onPress={this.handleBackClick}>
              <Icon name="arrow-back" /> 
            </Button>
          </Left>
          <Right style={headerBodyStyle}>
            <Image 
              style={ logoStyle }
              source={ logo } 
            />
          </Right>
        </Header>
        <Content contentContainerStyle={contentStyle}>        
          <H1 style={h1Style}>Login</H1>
          {
            this.props.isChecking 
          ? 
            <Spinner />
          :
            <Button
              rounded
              style={buttonStyle}
              onPress={this.openSteemConnect}
            >
              <Text uppercase={false} style={buttonTextStyle}>Sign In via Steem Connect</Text>
            </Button>
          }
          
        </Content>
        <Footer style={footerStyle}>
          <Text 
            style={footerTextStyle}
            onPress={this.openSteemitSignUpUrl}
          >
            No account? Click here to sign up
          </Text>
        </Footer>
        </Container>
      </StyleProvider>
    )
  }
}

const styles = {
  buttonStyle: {
    alignSelf: "center",
    backgroundColor: "#fff"
  },
  buttonTextStyle: {
    color: '#3F51B5',
    fontWeight: 'bold',
    fontSize: 15
  },
  containerStyle: {
    backgroundColor: '#3F51B5'
  },
  headerBodyStyle: {
    justifyContent: 'center', 
    alignItems: 'center',
    flex: 1
  },
  contentStyle: { 
    justifyContent: 'center', 
    flex: 1, 
    alignItems: 'center'
  },
  logoStyle: {
    alignSelf: 'center',
    width: 50.75,
    height: 27.2
  },
  footerStyle: {
    backgroundColor: 'rgba(0,0,0,0)',
    justifyContent: 'center', 
    alignItems: 'center'
  },
  footerTextStyle: {
    color: '#fff'
  },
  headerBodyStyle: {
    alignItems: 'center' 
  },
  h1Style: {
    lineHeight: 60,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30
  }
}
const mapStateToProps = (state) => ({
  isChecking: getIsCheckingAuth(state)
})


export default connect(mapStateToProps, null)(Login)
