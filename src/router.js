import React, { Component } from 'react'
import { connect } from 'react-redux'

import { parseUrl } from './helpers/externalUrl'
import { checkLoginExist } from './auth/authActions'
import { getSettings } from './settings/settingsActions'

import { Linking } from 'react-native'

import { Scene, Router, Actions } from 'react-native-router-flux'

import SplashScreen from 'react-native-smart-splash-screen'

import Launch from './screens/launch'
import Login from './screens/login'
import Browser from './screens/browser'

import Ask from './screens/ask'
import Search from './screens/search'

import Feed from './screens/feed'
import Swipe from './screens/swipe'
import Answers from './screens/answers'
import Profile from './screens/profile'

import Question from './screens/question'
import Replies from './screens/replies'

import Settings from './screens/settings'


class RouterComponent extends Component {
  componentDidMount(){
    // Close Splash Screen
    SplashScreen.close({animationType: SplashScreen.animationType.scale, duration: 850, delay: 500})

    // Get Settings
    this.props.getSettings()

    // If on Launch Screen
    if(Actions.currentScene === "launch"){
      // Check If Authenticated
      this.props.checkLoginExist(true)
    }
  }

  render(){
    return(
      <Router>
        <Scene key="root">
          <Scene key="launch" component={Launch} hideNavBar initial/>
          <Scene key="login" component={Login} hideNavBar />
          <Scene key="browser" component={Browser} hideNavBar />
          <Scene key="main" duration={0}>
            <Scene key="feed" component={Feed} hideNavBar duration={0} initial />
            <Scene key="swipe" component={Swipe} hideNavBar duration={0}  />
            <Scene key="answers" component={Answers} hideNavBar duration={0}  />
            <Scene key="profile" component={Profile} hideNavBar duration={0} />
          </Scene>
          <Scene key="question" component={Question} hideNavBar />
          <Scene key="replies" component={Replies} hideNavBar />
          <Scene key="ask" component={Ask} hideNavBar />
          <Scene key="search" component={Search} hideNavBar />
          <Scene key="settings" component={Settings} hideNavBar />
        </Scene>
      </Router>
    )
  }
}


export default connect(null, { 
  checkLoginExist, 
  getSettings 
})(RouterComponent)
