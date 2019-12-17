import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  FlatList,
  TouchableHighlight,
} from 'react-native';

import { Card, Text } from 'react-native-elements';

class ListCard extends Component {
  handlePress = () => {
    console.log('list card handlePress');
    const { goToCage, id: listId } = this.props;
    console.log('go to cage', listId);
    goToCage(listId);
  }

  render() {
    const { title } = this.props;
    return (
      <TouchableHighlight
        style={{ padding: 0, justifyContent: 'center', alignItems: 'stretch' }}
        onPress={this.handlePress}
      >
        <Card containerStyle={styles.card}>
          <Text h3>{title}</Text>
        </Card>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    // flex: 1,
    // width: '100%',
    // backgroundColor: 'lightgray',
    // alignItems: 'center',
    // justifyContent: 'center',
    height: 200,
    // padding: 0,
    // width: '100%',
    // marginBottom: 5,
    // marginTop: 5,
  },
});

export default ListCard;