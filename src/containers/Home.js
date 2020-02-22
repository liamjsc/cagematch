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

class Home extends Component {
  state = {
    showRegister: true,
  }
  /**
   * if auth status is not resolved, call get user from device, then set the user as appropriate
   */
  componentDidMount() {
    const { dispatch, authStatusResolved } = this.props;
    if (!authStatusResolved) {
      return getUserFromDevice()
        .then(user => {
          console.log('callback', user);
          // if user is null here, the action handles it appropriately
          dispatch(setUser(user));
        });
    }
  }

  goToBrowse = () => {
    this.props.navigation.navigate('Browse');
  }

  login = (creds) => {
    return this.props.dispatch(login(creds))
      .then(() => {
        this.props.navigation.navigate('Browse');
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

  /**
   * if we dont know the auth status yet, show a spinner and a loading message
   * else if no user is logged in, show a login form
   * else if user is logged in, show the list of groups
   */
  render() {
    console.log('-- HOME render');
    console.log(this.props);
    const { user = null, authStatusResolved = false } = this.props;

    const isLoggedIn = !!user;

    if (!authStatusResolved) return (
      <View style={styles.home}>
        <Text>Checking for a user account</Text>
        <View style={styles.fullScreenSpinner}>
          <ActivityIndicator
            size="large"
          />
        </View>
      </View>
    )

    if (!isLoggedIn) {
      const { showRegister } = this.state;
      return (
        <View style={styles.home}>

          <View style={styles.header}>
            <Text h1>CAGE MATCH</Text>
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
    this.goToBrowse();
    return null;
  }
}

const styles = StyleSheet.create({
  home: {
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

const mapStateToProps = ({ auth }) => {
  console.log('mstp home', auth);
  const { user, authStatusResolved } = auth; 
  return {
    user, // { email, id, username }, or null
    authStatusResolved,
  }
}
export default connect(mapStateToProps)(Home);
