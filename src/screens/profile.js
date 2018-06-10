import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import { getProfile } from '../profile/profileActions'
import { followUser } from '../app/follow/followActions'

import { 
  StyleProvider, Container, Title, Content, 
  Left, Right, Body, Icon, Text, Tabs, Tab, TabHeading,
  Spinner
} from 'native-base'


import theme from '../theme/components'
import material from '../theme/variables/material'

import Header  from '../components/headers'
import Footer from '../components/footers'

import ProfileHeader from '../profile/header'

import QuestionFeed from '../feed/feed'

import AnswerFeed from '../answers/feed'

class Profile extends Component {
  constructor(props){
    super(props)

    this.renderUser = this.renderUser.bind(this)
  }

  componentWillMount(){
    const username = this.props.username || this.props.authenticatedUser.user
    const isSelf = username === this.props.authenticatedUser.user

    this.props.getProfile(username, isSelf)
  }

  handleFollowClick(username, isFollowing){
    if(!this.props.isAuthenticated) return Actions.login()
    this.props.followUser(this.props.authenticatedUser.user, username, isFollowing)
  }


  handleLogoClick(){
    Actions.main()
  }

  // Getting User Profile
  renderUser(username, followers, following, isFollowing, isSelf, isPendingFollow){
    return (
      <StyleProvider style={theme(material)}>
      <Container style={bgColorStyle}>
        {
          isSelf && !this.props.username ? 
          <Header headerSettings onLogoClick={this.handleLogoClick} /> 
          :
          <Header headerBack onLogoClick={this.handleLogoClick} />
        }
        {
          isSelf ?
          <ProfileHeader
            isSelf={isSelf}
            username={username}
            followers={followers || 0}
            following={following || 0}
          />
          :
          <ProfileHeader
            onFollowClick={() => this.handleFollowClick(username, isFollowing)}
            isSelf={isSelf}
            isFollowing={isFollowing}
            isPending={isPendingFollow}
            username={username}
            followers={followers || 0}
            following={following || 0}
          />
        }
        
        <Tabs initialPage={0}>
          <Tab heading="Questions" style={bgColorStyle}>
            <QuestionFeed 
              sortBy="blog" 
              filter={username} 
              limit={20} 
            />
          </Tab>
          <Tab heading="Answers" style={bgColorStyle}>
            <AnswerFeed 
              username={username} 
              replies={false} 
              sortBy="user"
            />
          </Tab>
        </Tabs>
        {isSelf && <Footer screen="profile" />}
      </Container>
      </StyleProvider>
    )
  }

  render() {
    const {authenticatedUser, isAuthenticated} = this.props
    const isSelf = this.props.username === authenticatedUser.user

    if(authenticatedUser && isAuthenticated && !this.props.username){
      return this.renderUser(
        authenticatedUser.user, 
        this.props.followers, 
        this.props.following, 
        null, 
        true, 
        false
      )
    }else{
      const isPendingFollow = this.props.isPendingFollow !== null ? true : false
      return this.renderUser(
        this.props.username, 
        this.props.followers, 
        this.props.following, 
        this.props.isFollowing, 
        isSelf, 
        isPendingFollow
      )
    }
  }
}

const bgColorStyle = {
  backgroundColor: '#fafafa'
}


const mapStateToProps = state => {
  const {user, isAuthenticated} = state.auth
  const {followers, following, isFollowing} = state.profile
  const {pending} = state.follow
  return {
    followers,
    following,
    isFollowing,
    isAuthenticated,
    authenticatedUser: user,
    isPendingFollow: pending
  }
}

export default connect(mapStateToProps, { getProfile, followUser })(Profile)