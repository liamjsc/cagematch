import React, { Component } from 'react';
import { ScrollView } from 'react-native';
import {
  FormLabel,
  FormInput,
  FormValidationMessage,
} from 'react-native-elements'

export default class LoginForm extends Component {
  render() {
    return (
      <ScrollView>
        <View>
          <FormLabel>Username</FormLabel>
          <FormInput onChangeText={someFunction} />
          <FormValidationMessage>Error message</FormValidationMessage>
        </View>
        <View>
          <FormLabel>Email</FormLabel>
          <FormInput onChangeText={someFunction} />
          <FormValidationMessage>Error message</FormValidationMessage>
        </View>
        <View>
          <FormLabel>Password</FormLabel>
          <FormInput onChangeText={someFunction} />
          <FormValidationMessage>Error message</FormValidationMessage>
        </View>
        <View>
          <FormLabel>Confirm Password</FormLabel>
          <FormInput onChangeText={someFunction} />
          <FormValidationMessage>Error message</FormValidationMessage>
        </View>
      </ScrollView>
    )
  }
}