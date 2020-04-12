import React from 'react';
import { ThemeProvider, Icon } from 'react-native-elements';

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
  ListEdit,
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
  ListEdit,
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

const theme = {
  Button: {
    type: 'solid',
    raised: true,
    titleStyle: {
      color: constants.textWhite,
      fontFamily: 'Roboto Mono',
      
    },
    buttonStyle: {
      backgroundColor: constants.darkPurple,
      borderColor: constants.white,
    },
  },
  ButtonGroup: {
    containerStyle: {
      borderWidth: 0,
      borderColor: constants.background,
    },
    selectedButtonStyle: {
      borderBottomColor: constants.lightPurple,
      backgroundColor: constants.background,
    },
    buttonStyle: {
      borderWidth: 1,
      borderColor: constants.background,
      backgroundColor: constants.background,
    },
    textStyle: {
      color: constants.textWhite,
    },
    innerBorderStyle: {
      color: constants.background,
      width: 0,
    }
  },
  Input: {
    placeholderTextColor: constants.textGrey,
    containerStyle: {
      marginTop: 3,
      marginBottom: 3,
      backgroundColor: constants.background,
    },
    labelStyle: {
      color: constants.textGrey,
      fontWeight: 'normal',
      fontFamily: 'Roboto Mono',
    },
    inputStyle: {
      paddingLeft: 5,
      color: constants.textWhite,
      backgroundColor: constants.cardGray,
      fontFamily: 'Roboto Mono',
    },
    inputContainerStyle: {
      backgroundColor: constants.cardGray,
      borderBottomWidth: 0,
    }
  },
  Text: {
    style: {
      color: constants.textWhite,
      fontFamily: 'Roboto Mono',
    },
    allowFontScaling: false,
  },
  Card: {
    containerStyle: {
      backgroundColor: constants.cardGray,
      borderColor: constants.lighterBlack,
    },
    titleStyle: {
      color: 'white',
      fontFamily: 'Roboto Mono Bold',
      fontWeight: 'bold',
    },
  },
}

class App extends React.Component {
  state = {
    showSplash: true,
  }

  dismissSplash = () => this.setState({ showSplash: false });
  showSplash = () => this.setState({ showSplash: true });

  static getDerivedStateFromProps(nextProps, state) {
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