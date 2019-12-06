import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { connect } from 'react-redux';

import { ListCard } from '../components';
import { loadList } from '../actions/list';

class Cage extends Component {
  state = {
    entryAId: '',
    entryBId: '',
  }

  getListId = () => {
    return this.props.navigation.getParam('listId');
  }

  componentDidMount() {
    const listId = this.getListId();
    const { list, listRankings, dispatch } = this.props;
    console.log('got list id', listId);
    const { loading, loaded } = listRankings[listId] || {};

    if (!loading && !loaded) dispatch(loadList(listId));
  }

  render() {
    const listId = this.getListId();
    console.log('rendering', listId);
    const { list, listRankings } = this.props;
    console.log(listRankings);
    const { loading, loaded } = listRankings[listId] || {};
    const { entryAId, entryBId } = this.state;

    console.log('cage render');
    console.log('loading', loading);
    console.log('loaded', loaded);
    console.log('listId', listId);
    console.log('loaded', loaded);

    if (loading || typeof loading === 'undefined') return <Text>Loading</Text>;

    const { title } = list.byId[listId];

    return (
      <View style={styles.container}>
        <Text style={styles.header}>{title}</Text>
        <View style={styles.entryWrapper}>
          <View style={styles.entry}></View>
          <View style={styles.entry}></View>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'lightslategray',
    width: '100%',
  },
  header: {},
  entryWrapper: {},
  entry: {},
});

function mstp({ list, listRankings }) {
  return {
    list,
    listRankings,
  };
}
export default connect(mstp)(Cage);
