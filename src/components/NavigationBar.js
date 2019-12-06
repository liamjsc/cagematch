import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { Splash } from '../../containers';
import { NavigationBar } from '../../components';
import { white } from 'ansi-colors';

class NavigationBar extends Component {
  render() {
    return (
      <View style={styles.navBar}>
        <View style={styles.container}>
          <Splash />
        </View>
        <NavigationBar/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  navBar: {
    backgroundColor: 'lightGray',
    flex: 1,
    justifyContent: 'space-around',
  },
  navBarIcon: {
    flex: 1,
  }
});

const mapStateToProps = ({list, navigation = {}}) => {
  console.log('mapStateToProps')
  console.log(state);
  const {
    byId,
    listIds,
    loaded,
    loading,
  }= list;
  const { activeTabId } = navigation;
  return {
    activeTabId,
  }
}
export default connect(mapStateToProps)(NavigationBar);