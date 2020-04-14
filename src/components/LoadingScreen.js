import React from 'react';
import {
  Text,
} from 'react-native-elements';
import {
  ActivityIndicator,
  View,
} from 'react-native';

import * as constants from '../util/constants';

function LoadingScreen({ text }) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: constants.background,
    }}>
      { !text ? null : <Text>{text}</Text> }
      <ActivityIndicator
        color={constants.lightPurple}
        size="large"
        style={{ paddingTop: 25 }}
      />
    </View>
  )
}

export default LoadingScreen;