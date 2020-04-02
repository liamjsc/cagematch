import React, { Component } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';

function validate({ username, password }) {
  return username && password;
}

class LoginForm extends Component {
  state = {
    username: '',
    password: '',
    hidePassword: true,
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
    this.props.login(credentials);
  }

  onChangeUsername = (e) => {
    this.setState({ username: e.nativeEvent.text });
  }
  onChangepassword = (e) => {
    this.setState({ password: e.nativeEvent.text });
  }

  toggleVisibility = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
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
            underlayColor: 'ligtsteelblue',
          }}
        />

        <Button
          title="Sign In"
          containerStyle={styles.button}
          onPress={this.onClickLogin}
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