import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Actions } from 'react-native-router-flux'

import { searchQuery, clearSearchForm } from '../search/searchActions'
import { Platform } from 'react-native'
import { 
  StyleProvider, Container, Content, Item, Input, Header, Icon, Button, Text, Left
} from 'native-base'

import theme from '../theme/components'
import material from '../theme/variables/material'

import SearchResults from '../search/searchResults'

class Search extends Component {
  constructor(props){
    super(props)

    this.handleTyping = this.handleTyping.bind(this)
  }

  state = {
    text: '',
    typing: false,
    typingTimeOut: 0
  }

  componentWillUnmount(){
    this.setState({text: ''})
    this.props.clearSearchForm()
  }

  componentDidMount(){
    if(this.props.text){
      this.handleTyping(this.props.text)
    }
  }

  handleBackClick(){
    Actions.pop()
  }

  handleTyping(text){
    if (this.state.typingTimeout) {
      clearTimeout(this.state.typingTimeout)
    }

   this.setState({
      text,
      typing: false,
      typingTimeout: setTimeout(() => {
        this.props.searchQuery(this.state.text)
      }, 1600)
   });
  }
  
  render() {
    const { bgColorStyle } = styles;
    return (
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
          <Header style={{backgroundColor: '#1e1e1e'}} searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input
                value={this.state.text}
                placeholder="Search" 
                onChangeText={value => this.handleTyping(value)}
              />
              <Icon name="ios-people" />
            </Item>
            <Button 
              transparent
              onPress={this.handleBackClick}
            >
              <Text style={{color: '#fff'}}>Cancel</Text>
            </Button>
          </Header>
          <Content>
            <SearchResults 
              data={this.props.searchResults} 
              isFetching={this.props.isFetching} 
            />
          </Content>
        </Container>
      </StyleProvider>
    )
  }
}

const styles = {
  bgColorStyle: {
    backgroundColor: '#fafafa'
  }
}

const mapStateToProps = ({search}) => {
  return {...search}
}

export default connect(mapStateToProps, { searchQuery, clearSearchForm })(Search)