import React, { Component } from 'react';
import {
  StyleSheet, 
  View,
  ScrollView,
  Dimensions,
 } from 'react-native';

 import { 
  Text,
  Button,
  Card,
 } from 'react-native-elements';
import { connect } from 'react-redux';

import { loadList, fetchUserListRankings } from '../actions/list';
import { signOut } from '../actions/auth';


class Account extends Component {
  static navigationOptions = {
    title: 'Profile',
    headerTitleStyle : { width : Dimensions.get('window').width }
  };

  signOut = () => {
    this.props.dispatch(signOut());
  }

  render() {
    const { user } = this.props;
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
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    // backgroundColor: 'lightblue',
    width: '100%',
  },
  cardText: {
    marginBottom: 10,
  }
});

function mstp({ auth: { user } }) {
  return {
    user,
  };
}
export default connect(mstp)(Account);
