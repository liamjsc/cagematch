import React, { Component } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { RegisterForm, LoginForm, ForgotPassword, LoadingScreen } from '../components';
import {
  createAccount,
  login,
  getUserFromDevice,
  setUser,
 } from '../actions/auth';

 import { loadAllLists, fetchUserListRankings } from '../actions/list';
 import { loadUser } from '../actions/users';
 import * as constants from '../util/constants';
 import { api } from '../config';

/**
 * Splash is rendered outside of the AppNavigator context
 * Fetch user info and load all initial data for the app home view
 * When data is loaded, call `props.onAppReady`
 */
class Splash extends Component {
  state = {
    showRegister: true,
    authStatusLoaded: false,
    forgotPassword: false,
    error: '',
    forgotSuccess: true, // indicates the forgot pw email was sent successfully
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
    return dispatch(loadUser(user.id))
      .then(() => {
        return dispatch(loadAllLists(user))
          .then(() => {
            console.log('calling onAppReady', onAppReady);
            onAppReady && onAppReady();
          })
          .catch(() => {
            console.log('CDM error Splash.js')
          });
        })
      .catch((error) => {
        console.log(error);
        this.setState({
          showRegister: false,
          authStatusLoaded: true,
        });
      })
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
      .catch(error => {
        console.log('should handle error better!', error);
        this.setState({
          error,
        });
        return Promise.reject();
      });
  }

  createAccount = (creds) => {
    return this.props.dispatch(createAccount(creds))
      .then(() => {
        console.log('!!!');
        console.log(this.props);
        this.props.onAppReady && this.props.onAppReady();
      })
      .catch(error => {
        console.log('should handle error better!', error);
        this.setState({
          error,
        });
        return Promise.reject();
      });
  }

  submitForgotPassword = (creds) => {
    const forgoPasswordUrl = `${api}/users/forgot`;
    console.log('%%', creds);
    return fetch(forgoPasswordUrl, {
      method: 'POST',
      body: JSON.stringify(creds),
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(response => {
      if (!response.ok) {
        return Promise.reject();
      }
      this.setState({ forgotSuccess: true });
      return Promise.resolve()
    })
  }

  goToForgotPassword = () => this.setState({ forgotPassword: true});
  hideForgotPassword = () => this.setState({ forgotPassword: false});

  changeForm = () => this.setState({ showRegister: !this.state.showRegister });

  render() {
    console.log('splash render');
    console.log(this.state);
    console.log(this.props);
    const {
      showRegister,
      authStatusLoaded,
      error, 
      forgotPassword,
    } = this.state;

    if (!authStatusLoaded) return <LoadingScreen text="cagematch is loading" />;

    return (
      <View style={styles.splash}>

        <View style={styles.header}>
          <Text style={{fontSize: 38}}>CAGEMATCH</Text>
        </View>

        <View style={styles.formWrapper}>
          {
            forgotPassword ? (
              <ForgotPassword
                submitForgotPassword={this.submitForgotPassword}
                hideForgotPassword={this.hideForgotPassword}
              />
            ) : (
              showRegister ?
              (
                <RegisterForm createAccount={this.createAccount} changeForm={this.changeForm} />
              ) : (
                <LoginForm
                  login={this.login}
                  changeForm={this.changeForm}
                  goToForgotPassword={this.goToForgotPassword}
                />
              )
            )
          }
          {
            (error && error.length) ? (
              <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
                <Text style={{ color: 'red' }}>{error}</Text>
              </View>
            ) : null
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
    backgroundColor: constants.background,
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
    alignItems: 'center',
  }
});

export default connect()(Splash);
