import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Splash, CreateList, BrowseLists } from '../../containers';

// const styles = StyleSheet.create({
//   app: {
//     flex: 1,
//     backgroundColor: 'lightslategray',
//   },
//   container: {
//     flex: 10,
//     backgroundColor: 'white',
//     borderWidth: 1,
//     borderColor: 'white',
//   },
// });

const AppNavigator = createStackNavigator(
  {
    Home: {
      screen: Splash,
    },
    BrowseLists: {
      screen: BrowseLists,
    },
    CreateList: {
      screen: CreateList,
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
