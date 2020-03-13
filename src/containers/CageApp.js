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

const BrowseStack = createStackNavigator({
  Browse: BrowseLists,
  ListFullDetail,
  Cage,
  ManageListEntries,
  Standings
});

BrowseStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon
      type="material"
      focused={focused}
      name="list"
    />
  ),
  tabBarOptions: {
    showLabel: false,
  },
}

const AccountStack = createStackNavigator({
  Account,
});

AccountStack.navigationOptions = {
  tabBarIcon: ({ focused }) => (
    <Icon
      type="material"
      focused={focused}
      name="person"
    />
  ),
  tabBarOptions: {
    showLabel: false,
  },
}

const AppNavigator = createBottomTabNavigator(
  {
    Browse: BrowseStack,
    Account: AccountStack,
    // CreateList: {
    //   screen: CreateList,
    //   navigationOptions: {
    //     tabBarIcon: ({ focused }) => (
    //       <Icon
    //         type="material"
    //         focused={focused}
    //         name="create"
    //       />
    //     ),
    //     tabBarOptions: {
    //       showLabel: false,
    //     },
    //   }
    // }
  },
  {
    initialRouteName: 'Browse',
    headerMode: 'none',
  }
);

const AppContainer = createAppContainer(AppNavigator);

const styles = StyleSheet.create({
  cardContainer: {
    // flex: 1,
    // width: '100%',
    backgroundColor: constants.secondary_sub,
    // alignItems: 'center',
    // justifyContent: 'center',
    minHeight: 200,
    // padding: 0,
    // width: '100%',
    // marginBottom: 5,
    // marginTop: 5,
  },
});

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
      // borderWidth: 1,
      // borderColor: 'gray',
      // backgroundColor: 'white',
      paddingLeft: 5,
    }
  },
  // Card: {
  //   containerStyle: styles.cardContainer,
  // },
  colors: {
    ...Platform.select({
      default: colors.platform.android,
      ios: colors.platform.ios,
    }),
  },
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