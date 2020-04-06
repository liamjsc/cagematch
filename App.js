import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import {
  View,
} from 'react-native';

import CageApp from './src/containers/CageApp';
import reducer from './src/reducers'

import * as constants from './src/util/constants';

const store = createStore(reducer, applyMiddleware(thunk));

class App extends Component {
  render() {
    return (
        <Provider store={store}>
          <View  style={{
            backgroundColor: constants.background,
            width: '100%',
            height: '100%',
            }}>
              <CageApp />
          </View>
        </Provider>

    );
  }
}

export default App;