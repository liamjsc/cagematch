import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';

import { ListCard } from '../components';
import { loadList } from '../actions/list';

class Cage extends Component {
  // todo- make an entriesById map and access ID here
  state = {
    entryAId: '',
    entryBId: '',
    entryA: {},
    entryB: {},
  }

  getListId = () => {
    return this.props.navigation.getParam('listId');
  }

  selectTwoEntries = () => {
    const { list } = this.props;
    const listId = this.getListId();
    const { entries } = list.byId[listId].entries;
    // Object {
    //   "createdAt": "2019-11-26T02:38:28.866Z",
    //   "id": "d42cfd9f-1cba-44e5-9cea-7d4efc12bd40",
    //   "listId": "9d0098ed-d07c-43ff-a3f3-3ce958858b6b",
    //   "list_id": "9d0098ed-d07c-43ff-a3f3-3ce958858b6b",
    //   "title": "Shaq",
    //   "updatedAt": "2019-11-26T02:38:28.866Z",
    // },

    const indexOne = Math.floor(Math.random() * entries.length);
    let indexTwo = Math.floor(Math.random() * entries.length);
    while (indexOne === indexTwo) {
      indexTwo = Math.floor(Math.random() * entries.length);
    }
    console.log('entries');
    console.log(entries);
    return [entries[indexOne], entries[indexTwo]];
  }

  componentDidMount() {
    console.log('CDM');
    const listId = this.getListId();
    const { list, listRankings, dispatch } = this.props;
    const { loading, loaded } = listRankings[listId] || {};

    if (!loading && !loaded) {
      console.log('cdm calling loadList again');
      return dispatch(loadList(listId)).then(() => {
        const entries = this.selectTwoEntries();
        this.setState({
          entryA: entries[0],
          entryB: entries[1],
        });
      })
    } else if (!loading) {
      const entries = this.selectTwoEntries();
      this.setState({
        entryA: entries[0],
        entryB: entries[1],
      });
    }
  }

  render() {
    const listId = this.getListId();
    console.log('rendering', listId);
    const { list, listRankings } = this.props;
    console.log(listRankings);
    const { loading, loaded } = listRankings[listId] || {};
    const { entryA, entryB } = this.state;

    console.log('cage render');
    console.log('loading', loading);
    console.log('loaded', loaded);
    console.log('listId', listId);
    console.log(entryA);
    console.log(entryB);


    if (loading || typeof loading === 'undefined') return <Text>Loading</Text>;

    const { title } = list.byId[listId];

    return (
      <View style={styles.container}>
        <Text h2 style={styles.header}>{title}</Text>
        <View style={styles.entryWrapper}>
          <View style={styles.entry}>
            <Text>{entryA.title}</Text>
          </View>
          <View style={styles.entry}>
            <Text>{entryB.title}</Text>
          </View>
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
    borderWidth: 1,
    borderColor: 'green',
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
