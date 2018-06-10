import React, { Component } from 'react'

import { 
  StyleProvider, Container, Content, Footer, Spinner
} from 'native-base'

import theme from '../theme/components'
import material from '../theme/variables/material'

import Header  from '../components/headers/loading'


export default class Launch extends Component {
  render() {
    return (
      <StyleProvider style={theme(material)}>
        <Container style={bgColorStyle}>
          <Header />
            <Content contentContainerStyle={bgColorStyle} />
          <Footer />
        </Container>
      </StyleProvider>
    )
  }
}

const bgColorStyle = {
  backgroundColor: '#fafafa'
}