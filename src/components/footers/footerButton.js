import React from 'react'
import { Footer, FooterTab, Button, Text} from 'native-base'

export default ({children, onClick}) => {
  return (
    <Footer>
      <FooterTab style={styles.footerStyle}>
        <Button full onPress={onClick}>
          <Text 
            uppercase={false} 
            style={styles.footerTextStyle}
          >
            {children}
          </Text>
        </Button>
      </FooterTab>
    </Footer>
  )
}

const styles = {
  footerStyle: {
    backgroundColor: '#3056aa'
  },
  footerTextStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    lineHeight: 26,
    color: '#fff'
  }
}