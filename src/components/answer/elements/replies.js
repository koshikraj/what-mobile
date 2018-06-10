import React, {Component} from 'react'
import { Actions } from 'react-native-router-flux'
import { View } from 'react-native'
import { Text, Left, Right, Button } from 'native-base'


const CardSectionReplies = ({
  repliesById, id, onPress
}) => {
  const { sectionStyle } = styles;

  return (
    <View style={sectionStyle}>
     <Left>
        <Text onPress={onPress} style={{color: '#3056aa'}}>REPLY</Text>
      </Left>
      {
        repliesById[id].length === 1 &&
        <Right>
          <Button style={{backgroundColor: '#3056aa'}} onPress={() => Actions.replies({id})} rounded><Text>View 1 reply</Text></Button>
        </Right>
      }
      {
        repliesById[id].length > 1 &&
        <Right>
          <Button style={{backgroundColor: '#3056aa'}} onPress={() => Actions.replies({id})}  rounded><Text>View {repliesById[id].length} replies</Text></Button>
        </Right>
      }
    </View>
  )
}

const styles = {
  sectionStyle: {
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 10,
    paddingBottom: 10,
    alignItems: 'center',
    flexDirection: 'row'
  }
}

export {CardSectionReplies}