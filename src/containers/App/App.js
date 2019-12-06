import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { loadAllLists } from '../../actions/list';
import { Splash, CreateList, BrowseLists } from '../../containers';
import { NavigationBar } from '../../components';
import { white } from 'ansi-colors';

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: 'lightslategray',
  },
  container: {
    flex: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'white',
  },
});

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: Splash,
    },
    BrowseLists: {
      screen: BrowseLists,
    }
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
