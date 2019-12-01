import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import { App as CageApp } from './src/containers/index';
import listReducer from './src/reducers/list';

const store = createStore(listReducer);

class App extends Component {
  render() {
    console.log('entry App')
    return (
      <Provider store={store}>
        <CageApp />
      </Provider>
    );
  }
}

export default App;