import React, { Component } from 'react';
import { Platform } from 'react-native';
import { ThemeProvider, colors, Icon } from 'react-native-elements';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Splash, CreateList, BrowseLists, Cage } from './index';

const BrowseStack = createStackNavigator({
  Browse: BrowseLists,
  Cage: Cage,
});

BrowseStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon
      type="material"
      focused={focused}
      name="search"
    />
  ),
  tabBarOptions: {
    showLabel: false,
  },
  
}

const AppNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Splash,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Icon
            type="material"
            focused={focused}
            name="home"
          />
        ),
        tabBarOptions: {
          showLabel: false,
        },
      }
    },
    Browse: BrowseStack,
    CreateList: {
      screen: CreateList,
      navigationOptions: {
        tabBarIcon: ({ focused }) => (
          <Icon
            type="material"
            focused={focused}
            name="add"
          />
        ),
        tabBarOptions: {
          showLabel: false,
        },
      }
    }
  },
  {
    initialRouteName: 'Browse',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(AppNavigator);

const theme = {
  Button: {
    type: 'outline',
    raised: true,
  },
  Input: {
    containerStyle: {
      marginTop: 3,
      marginBottom: 3,
    },
    labelStyle: {
      color: 'white',
      fontWeight: 'normal',
    },
    inputStyle: {
      borderWidth: 1,
      borderColor: 'gray',
      backgroundColor: 'white',
      paddingLeft: 5,
    }
  },
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  },
}

export default class App extends React.Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppContainer />
      </ThemeProvider>
    );
  }
}
