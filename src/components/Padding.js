import React from 'react';
import {
  View,
} from 'react-native';

function Padding({ height = 30, width = '100%', }) {
  return (
    <View style={{
      height,
      width,
    }}/>
  )
}

export default Padding;