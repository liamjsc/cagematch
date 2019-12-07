import React, { Component } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { Button, Text } from 'react-native-elements';

class Splash extends Component {
  goToBrowse = () => {
    this.props.navigation.navigate('Browse');
  }

  render() {
    return (
      <View style={styles.splash}>
        <Text h1>CAGE MATCH</Text>
        <Button
          title="Browse"
          onPress={this.goToBrowse}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  splash: {
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor: 'lightslategray',
    justifyContent: 'space-around',
  },
});

export default Splash;
