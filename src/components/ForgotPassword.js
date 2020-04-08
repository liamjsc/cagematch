import React, { Component } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { 
  Button,
  Input,
  Text,
} from 'react-native-elements';

import * as constants from '../util/constants';

function validate({ email }) {
  return email && email.length && email.indexOf('@') && email.indexOf('.');
}

class LoginForm extends Component {
  state = {
    email: '',
    error: '',
    forgotSuccess: false,
  }

  onClickSubmit = () => {
    console.log('onClickSubmit');
    console.log(this.state);
    const valid = validate(this.state);
    if (!valid) return this.setState({ error: 'Invalid email' })
    const { email } = this.state;
    const credentials = {
      email,
    }
    console.log(credentials);
    this.props.submitForgotPassword(credentials)
      .then(() => this.setState({ forgotSuccess: true, error: '' }))
      .catch(() => this.setState({ forgotSuccess: false, error: 'Error generating password reset link'}))
  }

  onChangeEmail = (e) => {
    this.setState({ 
      email: e.nativeEvent.text,
      error: '',
    });
  }


  render() {
    console.log('loginForm -- render');
    const { forgotSuccess, error } = this.state;
    return (
      <View styles={styles.loginForm}>
        <Input
          label="Email"
          value={this.state.email}
          onChange={this.onChangeEmail}
        />
        <Button
          title="Reset Password"
          containerStyle={styles.button}
          onPress={this.onClickSubmit}
          underlayColor='#99d9f4'
        />

        <View style={styles.changeFormTextArea}>
          <TouchableOpacity
            onPress={this.props.hideForgotPassword}
          >
            <Text>Back to Login</Text>
          </TouchableOpacity>
        </View>
        {
          forgotSuccess ? (
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
              <Text style={{ color: 'green' }}>Your Password Reset link should arrive soon</Text>
            </View>
          ) : null
        }
        {
          error ? (
            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingTop: 15 }}>
              <Text style={{ color: 'red' }}>{error}</Text>
            </View>
          ) : null
        }
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
}

export default LoginForm;
