import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class BrowseLists extends Component {
  render() {
    console.log(this.props);
    return (
      <Text style={{width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        Browse Lists
      </Text>
    )
  }
}

export default BrowseLists;
