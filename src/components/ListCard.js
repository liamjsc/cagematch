import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableHighlight,
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
      goToUserDetail,
      title,
      entries,
      voterCount,
      matchupCount,
      createdBy,
      createdAt,
      user_id,
      // image = 'https://upload.wikimedia.org/wikipedia/en/thumb/1/1d/Conairinternational.jpg/220px-Conairinternational.jpg',
    } = this.props;
    const count = entries.length;

    let date;
    if (createdAt) {
      const arr = new Date(createdAt).toString().split(' ');
      date = `${arr[1]} ${arr[2]}, ${arr[3]}`
    } 
    return (
      <TouchableWithoutFeedback
        style={{ padding: 0, justifyContent: 'center', alignItems: 'stretch' }}
        onPress={this.handlePress}
      >
        <Card
          title={title}
          containerStyle={styles.card}
        >
          <Text style={styles.lightPurple}>{count} entries</Text>
          { !voterCount ? null : (<Text style={styles.lightPurple}>{voterCount} voters</Text>) }
          { !matchupCount ? null : (<Text style={styles.lightPurple}>{matchupCount} matchups</Text>) }
          { !createdBy ? null : (
            <TouchableWithoutFeedback
              onPress={() => goToUserDetail({ userId: user_id, username: createdBy })}
            >
              <Text style={styles.lightPurple}>Created by {createdBy}</Text>
            </TouchableWithoutFeedback>
          )}
          { !createdAt ? null : (<Text style={styles.lightPurple}>{date}</Text>) }
        </Card>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    // height: 180,
  },
  lightBlue: {
    color: constants.textBlue,
  },
  lightPurple: { color: constants.lightPurple },
});

export default ListCard;