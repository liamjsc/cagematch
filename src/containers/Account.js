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
  Image,
 } from 'react-native-elements';
import { connect } from 'react-redux';

import { loadList, fetchUserListRankings } from '../actions/list';
import { signOut } from '../actions/auth';


class Account extends Component {
  static navigationOptions = {
    title: 'Profile',
    headerTitleStyle : {width : Dimensions.get('window').width}
  };

  signOut = () => {
    this.props.dispatch(signOut());
  }

  render() {
    const { user } = this.props;
    const { email, username } = user;
    return (
      <ScrollView style={styles.container}>
        <View>
          <Text>
            Email: {email}
          </Text>
          <Text>
            Username: {username}
          </Text>
        </View>
        <Button
          title='Sign Out'
          onPress={this.signOut}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    backgroundColor: 'lightslategray',
    width: '100%',
    borderWidth: 1,
    borderColor: 'green',
  },
});

function mstp({ auth: { user } }) {
  return {
    user,
  };
}
export default connect(mstp)(Account);
