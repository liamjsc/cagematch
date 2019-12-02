import React, { Component } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import CageApp from './src/containers/App/App';
import reducer from './src/reducers'

const store = createStore(reducer, applyMiddleware(thunk));

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