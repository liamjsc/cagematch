import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Splash() {
  return (
    <View style={styles.splash}>
      <Text>CAGE MATCH</Text>
    </View>
  );
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
