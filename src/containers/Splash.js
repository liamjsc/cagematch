import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
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

  render() {
    console.log('splash render');
    console.log(RegisterForm);
    const { showRegister } = this.state;
    return (
      <View style={styles.splash}>

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
});

export default connect()(Splash);
