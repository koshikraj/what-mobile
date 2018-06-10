import React, { Component } from 'react'
import { View, Text, WebView } from 'react-native'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'
import { authenticateUser } from '../auth/authActions'
import { parseUrl } from '../helpers/externalUrl'
import Header  from '../components/headers'
import theme from '../theme/components'
import material from '../theme/variables/material'
import { 
    StyleProvider, 
    Container
  } from 'native-base'

class Browser extends Component {
constructor(props){
    super(props)

    this.checkURL = this.checkURL.bind(this)
}
checkURL(url) {
    // Logged In
    if(url && url.indexOf("whatapp://login/") !== -1){

        // Get URL variables
        const paramsArray = parseUrl(url, "whatapp://login/")
                                    
        // Authenticate User
        this.props.authenticateUser(
        {
            accessToken: paramsArray[0],
            username: paramsArray[1],
            expiresIn: paramsArray[2]
        },
        false,
        true
        )
    }
}
render() {
    return (
        <StyleProvider style={theme(material)}>
        <Container>
            <Header headerBack />
            <WebView
                source={{uri: this.props.url}}
                onNavigationStateChange={state => this.checkURL(state.url)}
                thirdPartyCookiesEnabled={false}
            />
        </Container>
        </StyleProvider>
    )
}
}

export default connect(null, {authenticateUser})(Browser)
