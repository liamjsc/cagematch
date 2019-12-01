import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore } from 'redux';
import { connect } from 'react-redux';

import { loadLists } from '../../actions/list';
import { Splash, CreateList } from '../../containers';
import listReducer from '../../reducers/list';

const store = createStore(listReducer);

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    console.log('App.js did mount');
    setTimeout(() => {
      console.log('calling load lists');
      dispatch(loadLists());
    }, 5000);
  }

  render() {
    const { listLoaded } = this.props;
    console.log('cage app');
    return (
      <View style={styles.container}>
        { listLoaded ? <Splash/> : <CreateList/> }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => {
  console.log(state);
  return {
    listLoaded: state.listLoaded,
  }
}
export default connect(mapStateToProps)(App);