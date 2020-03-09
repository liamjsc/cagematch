import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { RegisterForm, LoginForm } from '../components';
import {
  createAccount,
  login,
  getUserFromDevice,
  setUser,
 } from '../actions/auth';

 import { loadAllLists } from '../actions/list';

/**
 * Splash is rendered outside of the AppNavigator context
 * Fetch user info and load all initial data for the app home view
 * When data is loaded, call `props.onAppReady`
 */
class Splash extends Component {
  state = {
    showRegister: true,
    authStatusLoaded: false,
  }

  /**
   * check if we have a user
   * load the app data
   * when app data is loaded, call onAppReady
   */
  async componentDidMount() {
    const { dispatch, onAppReady } = this.props;

    const user = await getUserFromDevice();
    dispatch(setUser(user || null));

    console.log('set the user', user);
    if (!user) return this.setState({ authStatusLoaded: true });

    // there is a user, load app data then dismiss the splash screen
    return dispatch(loadAllLists(user))
      .then(() => {
        console.log('calling onAppReady', onAppReady);
        onAppReady && onAppReady();
      })
      .catch(() => {
        console.log('CDM error Splash.js')
      });
  }

  goToBrowse = () => {
    this.props.navigation.navigate('Browse');
  }

  login = (creds) => {
    const { dispatch, onAppReady } = this.props;
    return dispatch(login(creds))
      .then((user) => {
        console.log('login success', user);
        return dispatch(loadAllLists(user))
      })
      .then(() => {
        console.log('calling onAppReady', onAppReady);
        onAppReady && onAppReady();
      })
      .catch(error => console.log('should handle error better!', error));
  }

  createAccount = (creds) => {
    return this.props.dispatch(createAccount(creds))
      .then(() => {
        this.props.navigation.navigate('Browse');
      })
      .catch(error => console.log('should handle error better!', error));
  }

  changeForm = () => this.setState({ showRegister: !this.state.showRegister });

  render() {
    console.log('splash render');
    console.log(this.state);
    console.log(this.props);
    const { user } = this.props;
    const { showRegister, authStatusLoaded } = this.state;

    const isLoggedIn = !!user;

    if (!authStatusLoaded) return (
      <View style={styles.fullScreenSpinner}>
        <Text>Cagematch is loading</Text>
        <ActivityIndicator
          size="large"
        />
      </View>
    );

    return (
      <View style={styles.splash}>

        <View style={styles.header}>
          <Text h1>CAGE MATCHH</Text>
        </View>

        <View style={styles.formWrapper}>
            {
              showRegister ?
                (
                  <RegisterForm createAccount={this.createAccount} changeForm={this.changeForm} />
                ) : (
                  <LoginForm login={this.login} changeForm={this.changeForm} />
                )
            }
          </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  splash: {
    paddingTop: 30,
    paddingLeft: 25,
    paddingRight: 25,
    alignItems: 'stretch',
    flex: 1,
    width: '100%',
    backgroundColor: 'lightslategray',
    justifyContent: 'flex-start',
  },
  header: {
    flex: 1,
    alignItems: 'center',
  },
  formWrapper: {
    flex: 6,
  },
  fullScreenSpinner: {
    flex: 1,
    justifyContent: 'center',
  }
});

export default connect()(Splash);
