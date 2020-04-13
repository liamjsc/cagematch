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
              <View style={styles.upperText}>

                <Text style={styles.lightPurple}>{count} entries</Text>
                {!voterCount ? null : (
                  <Text style={styles.lightPurple}>{voterCount} voters</Text>
                )}
                {!matchupCount ? null : (
                  <Text style={styles.lightPurple}>{matchupCount} matchups</Text>
                )}
              </View>
              {!createdBy ? null : (
                <View style={styles.lowerText}>
                  <TouchableWithoutFeedback
                    style={styles.createdBy}
                    onPress={() => goToUserDetail({ userId: user_id, username: createdBy })}
                    >
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{ color: constants.lightPurple, paddingRight: 5 }}>created by</Text>
                      <Text style={styles.createdBy}>
                        {createdBy}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              )}
{/* 
              {!createdAt ? null : (
                <Text style={styles.lightPurple}>{date}</Text>
              )} */}

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
    flexDirection: 'row-reverse',
    borderColor: 'orange',
  },
  listCardViewImage: {
    flexDirection: 'row-reverse',
    height: 180,
  },
  image: {
    flex: 1,
    aspectRatio: 182 / 268,
  },
  textBox: {
    paddingLeft: 5,
    flex: 1,
    // borderWidth: 1,
    // borderColor: 'yellow',
    justifyContent: 'space-between',
  },
  upperText: {

  },
  lowerText: {
    paddingTop: 7,
    paddingBottom: 7,
  },
  createdBy: {
    color: constants.textWhite,
    borderBottomWidth: 1,
    borderColor: constants.lightPurple,
    alignSelf: 'flex-end',
  },
  lightBlue: {
    color: constants.textBlue,
  },
  lightPurple: { color: constants.lightPurple },
});

export default ListCard;