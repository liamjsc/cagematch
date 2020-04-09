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

class Standings extends Component {
  static navigationOptions = {
    title: 'Standings',
  };

  state = {
    selectedIndex: 0,
    loading: true,
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
    } = this.props;

    const { loading, selectedIndex } = this.state;
    if (loading) return null;

    return (
      <View style={{
        paddingBottom: 100,
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
          buttons={['Global', 'User']}
        />
        <ScrollView>
          <Card title="STANDINGS">
            <Rankings 
              listId={listId}
              userId={selectedIndex === 1 ? userId : null}
            />
          </Card>
        </ScrollView>
      </View>
    );
  }
}

function mstp(state, ownProps) {
  const { list, auth: { user } } = state;
  const listId = ownProps.navigation.getParam('listId');
  console.log('mstp--', listId);
  const {
    title,
  } = list.byId[listId];

  return {
    title,
    listId,
    userId: user.id,
  }
}

export default connect(mstp)(Standings);