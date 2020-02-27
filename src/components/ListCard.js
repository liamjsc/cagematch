import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';

import { Card, Text } from 'react-native-elements';

class ListCard extends Component {
  handlePress = () => {
    const { goToListDetail, id: listId, title } = this.props;
    console.log('list card handlePress');
    console.log('go to listDetail', listId);
    goToListDetail({ listId, title });
  }

  render() {
    const {
      title,
      description = 'Placeholder description to explain what the list is about'
     } = this.props;
    return (
      <TouchableWithoutFeedback
        style={{ padding: 0, justifyContent: 'center', alignItems: 'stretch' }}
        onPress={this.handlePress}
      >
        <Card
          title={title}
          containerStyle={styles.card}
        >
          <Text>{description}</Text>
          {/* <Text h3>{title}</Text> */}
        </Card>
      </TouchableWithoutFeedback>
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