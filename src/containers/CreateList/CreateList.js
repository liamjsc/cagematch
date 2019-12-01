import React, { Component } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

export default class CreateList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    entries: [],
  }

  render() {
    return (
      <View>
        <View>
          <Text>
            Create a new list
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    width: '100%',
    backgroundColor: 'lightslategray',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
