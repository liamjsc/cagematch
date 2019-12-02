import React, { Component } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

import CageApp from './src/containers/App/App';
import reducer from './src/reducers'

const store = createStore(reducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <CageApp />
      </Provider>
    );
  }
}

export default App;