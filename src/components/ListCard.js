import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  Card,
  Divider,
  Icon,
  Image,
  Text,
} from 'react-native-elements';
import * as constants from '../util/constants';

class ListCard extends Component {
  handlePress = () => {
    const { goToCage, id: listId, title } = this.props;
    goToCage({ listId, title });
  }

  goToListEdit = () => {
    const { id: listId } = this.props;
    this.props.goToListEdit({ listId });
  }

  renderTitle(title) {
    return (
      <View style={styles.title}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <View style={styles.iconWrapper} />
          <View style={styles.titleTextWrapper}>
            <Text style={styles.titleText}>{title}</Text>
          </View>
          <View style={styles.iconWrapper}>
            <Icon
              name="settings"
              color={constants.white}
              onPress={this.goToListEdit}
              underlayColor={constants.lightPurple}
            />
          </View>
        </View>
        <Divider style={{
          marginTop: 10,
          marginBottom: 10,
          backgroundColor: constants.textGrey,
          width: '70%',
        }}/>
      </View>
    )
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
          title={this.renderTitle(title)}
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
                <View style={styles.statRow}>
                  <Icon
                    containerStyle={styles.statIcon}
                    name="format-list-bulleted"
                    type="material-community"
                    color={constants.lightPurple}
                  />
                  <View style={styles.statText}>
                    <Text>{count} entries</Text>
                  </View>
                </View>

                {!voterCount ? null : (
                  <View style={styles.statRow}>
                    <Icon
                      containerStyle={styles.statIcon}
                      name="account-multiple"
                      type="material-community"
                      color={constants.lightPurple}
                    />
                    <View style={styles.statText}>
                      <Text>{voterCount} voter{voterCount === 1 ? '' : 's'}</Text>
                    </View>
                  </View>
                )}

                {!matchupCount ? null : (
                  <View style={styles.statRow}>
                    <Icon
                      containerStyle={styles.statIcon}
                      name="chart-line-variant"
                      type="material-community"
                      color={constants.lightPurple}
                    />
                    <View style={styles.statText}>
                      <Text>{matchupCount} matchup{matchupCount === 1 ? '' : 's'}</Text>
                    </View>
                  </View>
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
  title: {
    alignItems: 'center',
  },
  iconWrapper: {
    flex: 1,
  },
  titleTextWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 8,
    flexDirection: 'row',
  },
  titleText: {
    fontSize: 18,
    textAlign: 'center',
  },
  listCardView: {
    flexDirection: 'row-reverse',
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
    justifyContent: 'space-between',
  },
  upperText: {

  },
  statRow: {
    flexDirection: 'row',
    height: 25,
    alignItems: 'center',
  },
  statIcon: {
    marginRight: 10,
  },
  statText: {
    color: constants.textGrey,
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