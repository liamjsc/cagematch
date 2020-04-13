import React, { Component } from 'react';
import {
  StyleSheet, 
  View,
  ScrollView,
  Dimensions,
 } from 'react-native';

 import { 
  Button,
  Card,
  ListItem,
  Text,
 } from 'react-native-elements';
import { connect } from 'react-redux';

import {
  AppData,
  Padding,
} from '../components';

import { signOut } from '../actions/auth';
import * as constants from '../util/constants';


class Account extends Component {
  static navigationOptions = {
    title: 'Profile',
  };

  signOut = () => {
    this.props.dispatch(signOut());
  }

  goToListEdit = (listId) => {
    this.props.navigation.navigate('ListEdit', { listId });
  }

  render() {
    const {
      listById,
      user,
    } = this.props;
    const {
      listsCreated = [],
    } = user;
    const { email, username, id } = user;
    return (
      <ScrollView style={styles.container}>
        <Card>
          <Text style={styles.cardText}>
            Email: {email}
          </Text>
          <Text style={styles.cardText}>
            Username: {username}
          </Text>
          <Text style={styles.cardText}>
            ID: {id}
          </Text>
          <Button
            title='Sign Out'
            onPress={this.signOut}
          />
        </Card>
        {!(listsCreated && listsCreated.length) ? null : (
          <Card
            title="Edit Lists"
          >
            {listsCreated.map((listId, i) => {
              const listMeta = listById[listId];
              return (
                <ListItem
                  key={i+1}
                  title={listMeta.title}
                  containerStyle={{
                    backgroundColor: constants.cardGray,
                    borderWidth: 1,
                    borderColor: constants.raisinBlack,
                  }}
                  bottomDivider
                  chevron
                  onPress={() => this.goToListEdit(listId)}
                />
              )
            })}
          </Card>
        )}
        <AppData/>
        <Padding/>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.background,
    width: '100%',
  },
  cardText: {
    marginBottom: 10,
  }
});

function mstp({
  auth: { user: { id } },
  users: { byId: usersById },
  list,
}) {
  const user = usersById[id];
  console.log(user);
  return {
    user,
    listById: list.byId,
  };
}
export default connect(mstp)(Account);
