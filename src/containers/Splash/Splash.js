import React, { Component } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

class Splash extends Component {
  render() {

    return (
      <View style={styles.splash}>
        <Text>CAGE MATCH</Text>
        <Button
          title="Browse"
          onPress={() => this.props.navigation.navigate('BrowseLists')}
        />
      </View>
    );
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

export default Splash;
