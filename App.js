import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {
  View,
  Text,
} from 'react-native';
import * as Font from 'expo-font';

import CageApp from './src/containers/CageApp';
import reducer from './src/reducers'

import * as constants from './src/util/constants';

const store = createStore(reducer, applyMiddleware(thunk));

class App extends Component {
  state = {
    fontLoaded: false,
  };

  async componentDidMount() {
    console.log('loading font');
    const loaded = await Font.loadAsync({
      'Roboto Mono': require('./src/assets/fonts/RobotoMono-Medium.ttf'),
      'Roboto Mono Bold': require('./src/assets/fonts/RobotoMono-Bold.ttf'),
    });
    console.log(loaded);
    this.setState({ fontLoaded: true });
  }
  render() {
    return this.state.fontLoaded ? (
        <Provider store={store}>
          <View style={{
            backgroundColor: constants.background,
            width: '100%',
            height: '100%',
            }}>
              <CageApp />
          </View>
        </Provider>
    ) : null
  }
}

export default App;