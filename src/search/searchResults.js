import React, { Component } from 'react'

import { Actions } from 'react-native-router-flux'

import { FlatList, Platform } from 'react-native'
import { View, Spinner, H3, Text, Button } from 'native-base'

import Question from '../components/question/searchItem'

export default class SearchResults extends Component {
  handleOnClick(author, permlink){
    Actions.question({author, permlink})
  }

  handleProfileClick(username){
    Actions.profile({username})
  }

  handleListHeaderComponent(){
    if(Platform.OS === "android") {
      return (
      <View style={{padding: 10}}>
        <Button full onPress={() => Actions.pop()}>
          <Text uppercase={false}>Back</Text>
        </Button>
      </View>
      )
    } else return null
  }

  handleFooterComponent(){
    if(this.props.isFetching){
      return <View><Spinner /></View> 
    } else return null
  }

  render(){
    const { data } = this.props
    return (
      <FlatList
        ListHeaderComponent={() => this.handleListHeaderComponent()}
        data={data}
        keyExtractor={(x, i) => i}
        ListFooterComponent={() => this.handleFooterComponent()}
        renderItem={({ item }) => (
          <Question
            question={item} 
            usernameClick={() => this.handleProfileClick(item.author)}
            onClick={() => this.handleOnClick(item.author, item.permlink)}
          />
          )
        }
      />
    )  
  }
}

