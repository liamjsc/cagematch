import React, { Component } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Input, Button } from 'react-native-elements';

function validate({ email, username, passwordOne, passwordTwo }) {
  return email && username && passwordOne && passwordOne === passwordTwo;
}

class RegisterForm extends Component {
  state = {
    email: 'a',
    username: 'a',
    passwordOne: 'ab',
    passwordTwo: 'ab',
  }

  onClickCreate = () => {
    console.log('onClickCreate');
    console.log(this.state);
    const valid = validate(this.state);
    if (!valid) return this.setState({ error: 'Double check the form'})
    const { email, username, passwordOne: password } = this.state;
    const credentials = {
      email,
      username,
      password,
    }
    this.props.createAccount(credentials);
  }

  onChangeEmail = (e) => {
    this.setState({ email: e.nativeEvent.text });
  }

  onChangeUsername = (e) => {
    this.setState({ username: e.nativeEvent.text });
  }
  onChangePasswordOne = (e) => {
    this.setState({ passwordOne: e.nativeEvent.text });
  }
  onChangePasswordTwo = (e) => {
    this.setState({ passwordTwo: e.nativeEvent.text });
  }

  render() {
    const styles = {};
    console.log('registerform -- render');
    return (
      <View styles={styles.registerForm}>
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
        />
        <Input
          label="Confirm Password"
          value={this.state.passwordTwo}
          onChange={this.onChangePasswordTwo}
        />
        <Button
          title="Create Account"
          onPress={this.onClickCreate}
          underlayColor='#99d9f4'
        />
      </View>
    );
  }
}

const styles = {
  registerForm: {
    flex: 1,
    width: '100%'
  }
}

export default RegisterForm;