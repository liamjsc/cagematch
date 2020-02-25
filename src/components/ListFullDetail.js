import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';

import { loadList } from '../actions/list';

// import {
// } from 'react-native-elements';

class ListFullDetail extends Component {
  static navigationOptions = {
    headerTitleStyle : { width : Dimensions.get('window').width }
  };

  componentDidMount() {
    const { listId, dispatch } = this.props;
    dispatch(loadList(listId));
  }

  render() {
    const {
      title,
      createdBy = 'cage_fan_l27',
      description = 'best cage movie',
      rankedList,
    } = this.props;
    if (!rankedList || !rankedList.length) return null;
    console.log(rankedList);
    return (
      <View>
        <Text h2>{title}</Text>
        <Text>Created by: {createdBy}</Text>
        <Text>{description}</Text>
        <View>
          <Text>Leader: </Text>
          <Text>{rankedList[0].title}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
});

// TODO NEXT!!
// LIST ID IS UNDEFINED
function mstp(state, ownProps) {
  // const { listId } = ownProps || {};
  const { list, listRankings, entries } = state;
  const listId = ownProps.navigation.getParam('listId');
  console.log(state);
  console.log('LFD mstp', listId);
  // console.log(list.byId);
  const {
    title,
    createdBy,
    description,
  } = list.byId[listId];
  const listEntries = (listRankings[listId] || {}).children || [];
  const rankedList = listEntries.map(id => entries.byId[id]).sort(function (a, b) {
    return a.score > b.score ? -1 : 1;
  });
  return {
    rankedList,
    title,
    createdBy,
    description,
    listId,
  }
}

export default connect(mstp)(ListFullDetail);