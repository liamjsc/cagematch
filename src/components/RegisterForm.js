import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import {
  Button,
  Input,
  Text,
} from 'react-native-elements';

import * as constants from '../util/constants';

function validate({ email, username, passwordOne, passwordTwo }) {
  return email && username && passwordOne && passwordOne === passwordTwo;
}

class RegisterForm extends Component {
  state = {
    email: '',
    username: '',
    passwordOne: '',
    passwordTwo: '',
    p1Hidden: true,
    p2Hidden: true,
    error: '',
  }

  onClickCreate = () => {
    console.log('onClickCreate');
    console.log(this.state);
    const valid = validate(this.state);
    if (!valid) return this.setState({ error: 'Double check the form' })
    const { email, username, passwordOne: password } = this.state;
    const credentials = {
      email,
      username,
      password,
    }
    this.props.createAccount(credentials);
  }

  toggleP1Hidden = () => this.setState({
    p1Hidden: !this.state.p1Hidden, 
    error: '',
  });
  toggleP2Hidden = () => this.setState({
    p2Hidden: !this.state.p2Hidden,
    error: '',
  });

  onChangeEmail = (e) => {
    this.setState({
      email: e.nativeEvent.text,
      error: '',
    });
  }

  onChangeUsername = (e) => {
    this.setState({
      username: e.nativeEvent.text,
      error: '',
    });
  }
  onChangePasswordOne = (e) => {
    this.setState({
      passwordOne: e.nativeEvent.text,
      error: '',
    });
  }
  onChangePasswordTwo = (e) => {
    this.setState({
      passwordTwo: e.nativeEvent.text,
      error: '',
    });
  }

  render() {
    console.log('registerform -- render');
    const { p1Hidden, p2Hidden } = this.state;
    return (
      <View style={styles.registerForm}>
        <Input
          label="Email"
          value={this.state.email}
          onChange={this.onChangeEmail}
        />
        <Input
          label="Username"
          value={this.state.username}
          onChange={this.onChangeUsername}
        />
        <Input
          label="Password"
          value={this.state.passwordOne}
          onChange={this.onChangePasswordOne}
          rightIcon={{
            name: p1Hidden ? 'visibility-off' : 'visibility',
            type: 'material',
            onPress: this.toggleP1Hidden,
            underlayColor: constants.background,
            color: constants.lightPurple,
          }}
        />
        <Input
          label="Confirm Password"
          value={this.state.passwordTwo}
          onChange={this.onChangePasswordTwo}
          rightIcon={{
            name: p2Hidden ? 'visibility-off' : 'visibility',
            type: 'material',
            onPress: this.toggleP2Hidden,
            underlayColor: constants.background,
            color: constants.lightPurple,
          }}
        />
        <Button
          containerStyle={styles.button}
          title="Create Account"
          onPress={this.onClickCreate}
          underlayColor='#99d9f4'
        />
        <View style={styles.changeFormTextArea}>
          <TouchableOpacity
            onPress={this.props.changeForm}
          >
            <Text>Already have an account? Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  registerForm: {
    flex: 1,
    width: '100%',
    paddingBottom: 20,
  },
  button: {
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  changeFormTextArea: {
    alignItems: 'center',
  }
}

export default RegisterForm;