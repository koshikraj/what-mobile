import React, {Component} from 'react'
import { View, TouchableOpacity } from 'react-native'
import { Text, Right, Icon, Spinner } from 'native-base'


const CardSectionFooter = ({
  likeColour, 
  likes, 
  earnings, 
  likeClick, 
  longLikeClick,
  isRefreshing
}) => {
  const { sectionStyle, likeContainerStyle, likeArrowStyle, likeStyle, earningsStyle} = styles;

  return (
    <View style={sectionStyle}>
      {
        isRefreshing ? 
      <View style={likeContainerStyle}><Spinner style={{height: 14}} /></View>
      :
      <View style={likeContainerStyle}>
        <TouchableOpacity onPress={likeClick} onLongPress={longLikeClick}>
          <Icon name="thumbs-up" style={[likeArrowStyle, likeColour]} />
        </TouchableOpacity>
        <Text style={[likeStyle, likeColour]}>{likes}</Text>
      </View>
      }
      <Right>
        <Text style={earningsStyle}>
         {earnings}
        </Text>
      </Right>
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
  likeContainerStyle: {
    flexDirection: 'row',
    alignItems:'center',
    marginRight: 15
  },
  likeArrowStyle: {
    marginRight: 5
  },
  likeStyle: {
    fontWeight: 'bold', 
    fontSize: 15
  },
  earningsStyle: {
    color: '#727272',
    fontSize: 14,
    fontWeight: 'bold'
  }
}

export {CardSectionFooter}