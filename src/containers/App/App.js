import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { loadAllLists } from '../../actions/list';
import { Splash, CreateList } from '../../containers';
import { white } from 'ansi-colors';

class App extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    setTimeout(() => {
      dispatch(loadAllLists());
    }, 1000);
  }

  render() {
    const {
      listLoaded,
      headerText = 'Create',
    } = this.props;
    console.log('cage app render');
    console.log(this.props);
    return (
      <View style={styles.app}>
        {/* <View style={styles.header}>
          <Text style={styles.headerText}>{headerText}</Text>
        </View> */}

        <View style={styles.container}>
          {!listLoaded ? <Splash /> : <CreateList />}
        </View>
        <View style={styles.footer}></View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: 'lightslategray',
  },
  header: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 48,
    paddingBottom: 15,
  },
  container: {
    flex: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
  },
  footer: {
    backgroundColor: 'lightslategray',
    flex: 1,
  }
});

const mapStateToProps = (state) => {
  console.log('mapStateToProps')
  console.log(state);
  const { list: {
    byId,
    listIds,
    loaded,
    loading,
  } } = state;
  return {
    listLoaded: loaded,
  }
}
export default connect(mapStateToProps)(App);