import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Splash, CreateList, BrowseLists } from '../../containers';

const AppNavigator = createBottomTabNavigator(
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
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
