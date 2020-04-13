import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { Card, Image, Text } from 'react-native-elements';
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
      image,
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
          <View style={image ? styles.listCardViewImage : styles.listCardView}>
            {!image ? null : (
              <Image
                source={{ uri: image }}
                style={styles.image}
                resizeMode="contain"
              />
            )}

            <View style={styles.textBox}>
              <Text style={styles.lightPurple}>{count} entries</Text>
              { !voterCount ? null : (<Text style={styles.lightPurple}>{voterCount} voters</Text>) }
              { !matchupCount ? null : (<Text style={styles.lightPurple}>{matchupCount} matchups</Text>) }
              { !createdBy ? null : (
                <TouchableWithoutFeedback
                  onPress={() => goToUserDetail({ userId: user_id, username: createdBy })}
                >
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{ color: constants.lightPurple, paddingRight: 5 }}>Created by</Text>
                    <Text style={{ color: constants.textWhite }}>{createdBy}</Text>

                  </View>
                </TouchableWithoutFeedback>
              )}
              { !createdAt ? null : (<Text style={styles.lightPurple}>{date}</Text>) }

            </View>
          </View>
        </Card>
      </TouchableWithoutFeedback>
    )
  }
}

const styles = StyleSheet.create({
  card: {
    // height: 180,
  },
  listCardView: {
    flexDirection: 'row',
    // borderWidth: 1,
    borderColor: 'orange',
  },
  listCardViewImage: {
    flexDirection: 'row',
    borderColor: 'orange',
    height: 180,
  },
  image: {
    flex: 1,
    aspectRatio: 182 / 268,
    // borderWidth: 1,
    borderColor: 'blue'

  },
  textBox: {
    paddingLeft: 5,
    flex: 1,
    // borderWidth: 1,
    borderColor: 'yellow',
  },
  lightBlue: {
    color: constants.textBlue,
  },
  lightPurple: { color: constants.lightPurple },
});

export default ListCard;