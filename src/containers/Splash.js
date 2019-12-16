import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Button, Text } from 'react-native-elements';
import { connect } from 'react-redux';
import { RegisterForm, LoginForm } from '../components';
import { createAccount, login } from '../actions/auth';


class Splash extends Component {
  state = {
    showRegister: true,
  }

  goToBrowse = () => {
    this.props.navigation.navigate('Browse');
  }

  createAccount = (creds) => {
    return this.props.dispatch(createAccount(creds))
      .then(() => {
        this.props.navigation.navigate('Browse');
      })
      .catch(error => console.log('should handle error better!', error));
  }
  render() {
    console.log('splash render');
    console.log(RegisterForm);
    return (
      <View style={styles.splash}>
        <View style={styles.center}>
          <Text h1>CAGE MATCH</Text>
        </View>
        <RegisterForm
          createAccount={this.createAccount}
        />
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
  },
  center: {
    alignItems: 'center',
  }
});

export default connect()(Splash);
