import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Button,
  TouchableWithoutFeedback,
} from 'react-native';

import { Card, Text } from 'react-native-elements';
import * as constants from '../util/constants';

class ListCard extends Component {
  handlePress = () => {
    const { goToCage, id: listId, title } = this.props;
    goToCage({ listId, title });
  }

  render() {
    const {
      title,
      description,
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
        </Card>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    // flex: 1,
    // width: '100%',
    // backgroundColor: constants.secondary_sub,
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