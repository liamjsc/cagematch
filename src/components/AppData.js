import React from 'react';
import Constants from 'expo-constants';
import {
  Card,
  Text,
} from 'react-native-elements';

function AppData({ height = 30, width = '100%', }) {
  const {
    nativeAppVersion,
    nativeBuildVersion,
    expoVersion,
  } = Constants;
  return (
    <Card title="App Version">
      <Text>Version: {nativeAppVersion}</Text>
      <Text>Build: {nativeBuildVersion}</Text>
      <Text>Expo: {expoVersion}</Text>
    </Card>
  )
}

export default AppData;