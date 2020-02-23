import React, { Component } from 'react';
import { Platform } from 'react-native';
import { ThemeProvider, colors, Icon } from 'react-native-elements';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import { Home, Splash, CreateList, BrowseLists, Cage } from './index';

const BrowseStack = createStackNavigator({
  Browse: BrowseLists,
  Cage,
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
      screen: BrowseLists,
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
            name="create"
          />
        ),
        tabBarOptions: {
          showLabel: false,
        },
      }
    }
  },
  {
    initialRouteName: 'CreateList',
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
      // color: 'white',
      fontWeight: 'normal',
    },
    inputStyle: {
      // borderWidth: 1,
      // borderColor: 'gray',
      // backgroundColor: 'white',
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
  state = {
    showSplash: true,
  }

  dismissSplash = () => this.setState({ showSplash: false });
  showSplash = () => this.setState({ showSplash: true });

  render() {
    const { showSplash } = this.state;
    return (
      <ThemeProvider theme={theme}>
        {
          showSplash ? (
          <Splash
            onAppReady={this.dismissSplash}
          />
          ) : <AppContainer />
        }
      </ThemeProvider>
    );
  }
}
