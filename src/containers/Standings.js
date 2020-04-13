import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
} from 'react-native';
import {
  Card,
  Button,
  ButtonGroup,
  Text,
} from 'react-native-elements';

import { loadList, fetchUserListRankings } from '../actions/list';
import { getExclusions } from '../actions/auth';
import Rankings from '../components/Rankings';
import * as constants from '../util/constants';
import { Padding } from '../components';

class Standings extends Component {
  static navigationOptions = {
    title: 'Standings',
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: props.initGlobal ? 0 : 1,
      loading: true,
    }
  }

  setGlobal = () => this.setState({ selectedIndex: 0 });
  setUser = () => this.setState({ selectedIndex: 1 });

  componentDidMount() {
    const { listId, dispatch, userId } = this.props;
    const promises = [
      dispatch(loadList(listId)),
      dispatch(getExclusions()),
      dispatch(fetchUserListRankings({ listId, userId }))
    ];
    Promise.all(promises).then(() => {
      this.setState({ loading: false })
    });
  }

  render() {
    const {
      userId,
      listId,
      title,
      usersById,
    } = this.props;

    const { loading, selectedIndex } = this.state;
    if (loading) return null;

    const { username } = usersById[userId];

    return (
      <View style={{
        backgroundColor: constants.background,
        height: '100%',
       }}>
        <View style={{
          justifyContent: 'center',
          flexDirection: 'row',
          width: '100%',
        }}>
          <Text h3>{title}</Text>
        </View>
        <ButtonGroup
          onPress={(idx) => this.setState({ selectedIndex: idx })}
          selectedIndex={selectedIndex}
          buttons={['Global', username]}
        />
        <ScrollView>
          <Card title="STANDINGS">
            <Rankings
              listId={listId}
              userId={selectedIndex === 1 ? userId : null}
            />
          </Card>
          <Padding/>
        </ScrollView>
      </View>
    );
  }
}

function mstp(state, ownProps) {
  const {
    users: { byId: usersById },
    list,
    auth: { user },
  } = state;
  const listId = ownProps.navigation.getParam('listId');
  const userIdOverride = ownProps.navigation.getParam('userId');
  const {
    title,
  } = list.byId[listId];

  return {
    usersById,
    title,
    listId,
    userId: userIdOverride || user.id,
    initGlobal: !userIdOverride,
  }
}

export default connect(mstp)(Standings);