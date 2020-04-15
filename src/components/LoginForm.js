import React, { Component } from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { 
  Button,
  Input,
  Text,
} from 'react-native-elements';

import * as constants from '../util/constants';

function validate({ username, password }) {
  return username && password;
}

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    hidePassword: true,
    error: '',
    posting: false,
  }

  onClickLogin = () => {
    console.log('onClickLogin');
    console.log(this.state);
    const valid = validate(this.state);
    if (!valid) return this.setState({ error: 'Double check the form' })
    const { email, username, password } = this.state;
    const credentials = {
      email,
      username,
      password,
    }
    this.setState({ posting: true });
    return this.props.login(credentials)
      .catch(() => {
        this.setState({ posting: false });
      })
  }

  onChangeUsername = (e) => {
    this.setState({
      username: e.nativeEvent.text,
      error: ''
    });
  }
  onChangepassword = (e) => {
    this.setState({ 
      password: e.nativeEvent.text,
      error: '',
    });
  }

  toggleVisibility = () => {
    this.setState({ 
      hidePassword: !this.state.hidePassword,
      error: '',
    });
  }

  render() {
    console.log('loginForm -- render');
    const { hidePassword } = this.state;
    return (
      <View styles={styles.loginForm}>
        <Input
          label="Username or Email"
          value={this.state.username}
          onChange={this.onChangeUsername}
          // placeholder="Placeholder..."
          // placeholderTextColor={constants.lightPurple}
        />
        <Input
          label="Password"
          value={this.state.password}
          onChange={this.onChangepassword}
          secureTextEntry={hidePassword}
          rightIcon={{
            name: hidePassword ? 'visibility-off' : 'visibility',
            type: 'material',
            onPress: this.toggleVisibility,
            underlayColor: constants.cardGray,
            color: constants.lightPurple,
          }}
        />

        {
          this.state.posting ? (
            <ActivityIndicator size="large" style={{ paddingTop: 5 }}/>
          ) : (
            <Button
              title="Sign In"
              containerStyle={styles.button}
              onPress={this.onClickLogin}
              underlayColor='#99d9f4'
            />  
          )
        }

        <View style={styles.changeFormTextArea}>
          <TouchableOpacity
            onPress={this.props.changeForm}
          >
            <Text>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.forgotPwText}>
          <TouchableOpacity
            onPress={this.props.goToForgotPassword}
          >
            <Text style={{ color: constants.textGrey }}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = {
  loginForm: {
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
  },
  forgotPwText: {
    alignItems: 'center',
    paddingTop: 20,
  }
}

export default LoginForm;
