import React from 'react'
import { View, Image } from 'react-native'
import { Text, Right, Icon, Button } from 'native-base'
import { Actions } from 'react-native-router-flux'

const goToSearch = (text) => {
  Actions.search({text})
}

const CardSectionHeader = ({category, username, date, questionScreen, swipeTab, handleOptions, handleProfile }) => {
  const { sectionStyle, tagStyle, usernameStyle, dateStyle, moreBtnStyle, thumbnailStyle, buttonStyle} = styles;

  return (
    <View>
    <View style={sectionStyle}>
      { questionScreen && 
        <Button transparent onPress={handleProfile}>
          <Image 
            source={{uri: `https://img.busy.org/@${username}`}} 
            style={thumbnailStyle} 
          /> 
        </Button>
      }
      
      <Text style={usernameStyle} onPress={handleProfile}>{`@${username}`}</Text>
      <Text style={dateStyle}>{date}</Text>
      <Right>
          <Button 
            transparent
            onPress={handleOptions}
            style={buttonStyle}
          ><Icon name="more" style={moreBtnStyle} /></Button>
      </Right>
    </View>
    {
      !swipeTab && <View style={{paddingLeft: 20}}><Text onPress={() => goToSearch(category)} style={tagStyle}>{category}</Text></View>
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
  },
  tagStyle: {
    fontSize: 14,
    color: '#3056aa',
    marginRight: 5
  },
  usernameStyle: {
    color: '#8a8a8a',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 5
  },
  dateStyle: {
    color: '#727272',
    fontSize: 12
  },
  moreBtnStyle: {
    color: '#727272'
  },
  thumbnailStyle: {
    width: 44,
    height: 44,
    marginRight: 4,
    borderRadius: 22
  },
  buttonStyle: {
    alignSelf: 'flex-end'
  }
}

export {CardSectionHeader}