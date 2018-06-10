import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import ReduxThunk from 'redux-thunk'
import reducers from './reducers'
import Router from './router'
import { Root } from 'native-base'
import { Linking } from 'react-native'



export default class App extends Component {
  render(){
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));
    return(
      <Root>
        <Provider store={store}>
          <Router />
        </Provider>
      </Root>
    )
  }
}
