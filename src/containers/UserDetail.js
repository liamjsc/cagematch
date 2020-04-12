import React, { Component } from 'react';
import {
  StyleSheet, 
  View,
  RefreshControl,
  ScrollView,
 } from 'react-native';

 import { 
  Button,
  Card,
  ListItem,
  Text,
 } from 'react-native-elements';
import { connect } from 'react-redux';

import {
  Padding,
} from '../components';

import { loadUser } from '../actions/users';
import * as constants from '../util/constants';

class UserDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('username');
    return {
      title,
    }
  };

  state = {
    loading: false,
    loaded: false,
    refreshing: false,
    error: '',
  }

  componentDidMount() {
    if (this.props.user && this.props.user.listStats) return;
    this.loadUser();
  }

  loadUser = () => {
    const { userId } = this.props;
    this.setState({ loading: true });
    return this.props.dispatch(loadUser(userId))
      .then(() => {
        return this.setState({
          loaded: true,
          loading: false,
        });
      })
      .catch((error) => {
        return this.setState({
          error,
          loading: false,
          loaded: false,
        })
      })
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadUser()
      .then(() => this.setState({ refreshing: false }));
  }

  goToUserRankings = (listId) => {
    const { userId } = this.props;
    this.props.navigation.navigate('Standings', { listId, userId });
  }

  render() {
    const {
      listStats = {},
      listsCreated = [],
      created_at,
      listById,
      username,
    } = this.props;

    const listsVotedOn = Object.keys(listStats).sort((a,b) => {
      return listStats[a].matchup_count < listStats[b].matchup_count ? 1 : -1;
    })
    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
      >
        <Card title={`Rankings - ${username}`}>
          {listsVotedOn.map(listId => {
            const listData = listById[listId];
            const { matchup_count } = listStats[listId];
            return (
              <ListItem
                key={listId}
                title={listData.title}
                subtitle={`${matchup_count} vote${matchup_count === 1 ? '' : 's'}`}
                subtitleStyle={styles.lightPurple}
                containerStyle={{
                  backgroundColor: constants.cardGray,
                  borderWidth: 1,
                  borderColor: constants.raisinBlack,
                }}
                bottomDivider
                chevron
                onPress={() => this.goToUserRankings(listId)}
              />
            )
          })}
        </Card>

        {!(listsCreated && listsCreated.length) ? null : (
          <Card
          title="Lists Created"
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
  lightPurple: {
    color: constants.lightPurple,
  }
});

function mstp({
  users: { byId: usersById },
  list: { byId: listById },
}, { navigation }) {
  const userId = navigation.getParam('userId');
  const user = usersById[userId];
  console.log('mstp userdetail');
  console.log(user);
  return {
    userId,
    listById,
    ...user,
  };
}
export default connect(mstp)(UserDetail);
