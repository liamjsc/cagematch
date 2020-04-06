import React, { Component } from 'react';
import { 
  Platform,
  StyleSheet,
} from 'react-native';
import { ThemeProvider, colors, Icon } from 'react-native-elements';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { connect } from 'react-redux';

import * as constants from '../util/constants';

import {
  Account,
  BrowseLists,
  Cage,
  CreateList,
  ManageListEntries,
  Splash,
  Standings,
} from './index';
import { ListFullDetail } from '../components'

// https://reactnavigation.org/docs/4.x/stack-navigator/#stacknavigatorconfig
const sharedStackNavigatorConfig = {
  defaultNavigationOptions: {
    headerBackTitle: ' ',
    headerTintColor: constants.white,
    headerStyle: {
      backgroundColor: constants.cardGray,
    },
    headerTitleStyle: {
      color: constants.lightPurple,
      width: '100%',
    }
  }
}

const BrowseStack = createStackNavigator({
  Browse: BrowseLists,
  ListFullDetail,
  Cage,
  ManageListEntries,
  Standings
}, {
  ...sharedStackNavigatorConfig,
  navigationOptions: {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        type="material"
        focused={focused}
        name="list"
        color={tintColor}
      />
    ),
  }
});

const AccountStack = createStackNavigator({
  Account,
}, {
  ...sharedStackNavigatorConfig,
  navigationOptions: {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        type="material"
        focused={focused}
        name="person"
        color={tintColor}
      />
    ),
  }
});

const CreateStack = createStackNavigator({
  CreateList,
}, { 
  ...sharedStackNavigatorConfig,
  navigationOptions: {
    tabBarIcon: ({ focused, tintColor }) => (
      <Icon
        type="material"
        focused={focused}
        name="create"
        color={tintColor}
      />
    ),
  },
});

const tabNavigatorOptions = {
  initialRouteName: 'Browse',
  headerMode: 'none',
  tabBarOptions: {
    inactiveBackgroundColor: constants.cardGray,
    activeBackgroundColor: constants.darkPurple,
    activeTintColor: constants.lightPurple,
    inactiveTintColor: constants.white,
    showLabel: true,
    labelStyle: {
      color: constants.white,
    },
  },
};

const AppNavigator = createBottomTabNavigator(
  {
    Browse: BrowseStack,
    CreateList: CreateStack,
    Account: AccountStack,
  },
  tabNavigatorOptions,
);

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: constants.secondary_sub,
    minHeight: 200,
  },
});

const theme = {
  Button: {
    type: 'solid',
    raised: true,
    titleStyle: {
      color: constants.textWhite,
    },
    buttonStyle: {
      backgroundColor: constants.darkPurple,
      borderColor: constants.white,
    },
  },
  ButtonGroup: {
    containerStyle: {
      borderWidth: 0,
    },
    selectedButtonStyle: {
      backgroundColor: constants.lightPurple,
    },
    buttonStyle: {
      backgroundColor: constants.lighterBlack,
    },
    textStyle: {
      color: constants.textWhite,
    },
  },
  Input: {
    containerStyle: {
      marginTop: 3,
      marginBottom: 3,
    },
    labelStyle: {
      color: constants.textGrey,
      fontWeight: 'normal',
    },
    inputStyle: {
      paddingLeft: 5,
      color: constants.textWhite,
      backgroundColor: constants.cardGray,
    },
  },
  Text: {
    style: {
      color: constants.textWhite,
    }
  },
  Card: {
    containerStyle: {
      backgroundColor: constants.cardGray,
      borderColor: constants.lighterBlack,
    },
    titleStyle: { color: 'white' },
  },
  // colors: {
  //   ...Platform.select({
  //     default: colors.platform.android,
  //     ios: colors.platform.ios,
  //   }),
  // },
}

class App extends React.Component {
  state = {
    showSplash: true,
  }

  dismissSplash = () => this.setState({ showSplash: false });
  showSplash = () => this.setState({ showSplash: true });

  static getDerivedStateFromProps(nextProps, state) {
    console.log('Cage App CWRP');
    console.log(nextProps);

    if (nextProps.user === null && state.showSplash === false) {
      return {
        showSplash: true,
      }
    }

    return null;
  }

  render() {
    const { showSplash } = this.state;
    const { user } = this.props;
    console.log('CageApp Render');
    console.log(React.version);
    console.log(this.props);
    console.log(this.state);
    return (
      <ThemeProvider theme={theme}>
        {
          showSplash ? (
          <Splash
            onAppReady={this.dismissSplash}
            user={user}
          />
          ) : <AppContainer />
        }
      </ThemeProvider>
    );
  }
}

function mstp({ auth: { user } }) {
  return {
    user,
  }
}
export default connect(mstp)(App);