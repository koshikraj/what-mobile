import React from 'react'
import { Image } from 'react-native'
import { Button, Spinner, View } from 'native-base'
import { Text } from 'react-native'
import Card from '../components/card'
import CardSection from '../components/card/cardSection'

export default ({username, followers, following, isFollowing, isPending, isSelf, onFollowClick}) => {
  return (
    <Card style={styles.cardStyle}>
      <CardSection style={styles.cardSectionStyle}>
        <Image 
          source={{uri: `https://img.busy.org/@${username}`}} 
          style={styles.thumbnailStyle} 
        /> 
        <Text style={styles.textStyle}>{`@${username}`}</Text>
        {
          !isSelf ?
          isPending ?
          <View style={{marginLeft: 10}}><Spinner /></View>
          :
          <Button rounded bordered light style={styles.buttonStyle}
            onPress={onFollowClick}
          >
            <Text style={styles.buttonTextStyle}>{isFollowing ? "Unfollow" : "Follow"}</Text>
          </Button>
          :
          null
        }
      </CardSection>
      <CardSection style={styles.cardSectionStyle}>
        <Text style={styles.textStyle}>{`${followers} Followers | ${following} Following`}</Text>
      </CardSection>
    </Card>
  )
}

const styles = {
  cardStyle: {
    backgroundColor: '#111',
    justifyContent: 'center'
  },
  cardSectionStyle: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  textStyle: {
    color: '#fff'
  },
  buttonTextStyle: {
    color: '#fff',
    margin: 0
  },
  thumbnailStyle: {
    width: 44,
    height: 44,
    marginRight: 4,
    borderRadius: 22
  },
  buttonStyle: {
    paddingLeft: 20, 
    paddingRight: 20, 
    marginLeft: 10,
    height: 30,
    alignSelf: 'center'
  }
}