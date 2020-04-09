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
      entries,
      voterCount,
      matchupCount,
      // image = 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Conairinternational.jpg/220px-Conairinternational.jpg',
    } = this.props;
    console.log('browse list');
    console.log(this.props);
    const count = entries.length;

    return (
      <TouchableWithoutFeedback
        style={{ padding: 0, justifyContent: 'center', alignItems: 'stretch' }}
        onPress={this.handlePress}
      >
        <Card
          title={title}
          containerStyle={styles.card}
          // image={{ uri: image }}
        >
          { !description ? null : (<Text>{description}</Text>) }
          <Text style={styles.lightPurple}>{count} entries</Text>
          { !voterCount ? null : (<Text style={styles.lightPurple}>{voterCount} voters</Text>) }
          { !matchupCount ? null : (<Text style={styles.lightPurple}>{matchupCount} matchups</Text>) }
        </Card>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    height: 180,
  },
  lightPurple: {
    color: constants.textBlue,
  }
});

export default ListCard;