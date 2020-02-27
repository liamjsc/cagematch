import React, { Component } from 'react';
import { StyleSheet, View, TouchableHighlight } from 'react-native';
import { Text } from 'react-native-elements';
import { connect } from 'react-redux';

import { loadList } from '../actions/list';
import { postMatchup } from '../actions/matchup';
import { Rankings } from '../components';

class Cage extends Component {
  // todo- make an entriesById map and access ID here
  state = {
    entryAId: '',
    entryBId: '',
    entryA: {},
    entryB: {},
    loaded: false,
  }

  getListId = () => {
    console.log('get list id');
    return this.props.navigation.getParam('listId');
  }

  selectTwoEntries = () => {
    const { list } = this.props;
    const listId = this.getListId();
    const { entries } = list.byId[listId];
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
    while (entries && entries.length && entries.length > 1 && indexOne === indexTwo) {
      indexTwo = Math.floor(Math.random() * entries.length);
    }
    return [entries[indexOne], entries[indexTwo]];
  }

  componentDidMount() {
    const listId = this.getListId();
    const { list, listRankings, dispatch } = this.props;
    const { loading, loaded } = listRankings[listId] || {};

    return dispatch(loadList(listId)).then(() => {
      console.log(this.props);
      const entries = this.selectTwoEntries();
      console.log('got 2 entries', entries);
      this.setState({
        loaded: true,
        entryA: entries[0],
        entryB: entries[1],
      });
    });
  }

  handlePress = (winner, loser) => {
    const listId = this.getListId();
    const { entryA, entryB } = this.state;
    const { id: userId } = this.props.user;
    const entryAId = entryA.id; 
    const entryBId = entryB.id; 
    const matchupResults = {
      entryA: entryAId,
      entryB: entryBId,
      winner,
      loser,
      listId,
      userId,
    }
    console.log('matchup results:', matchupResults);
    
    this.props.dispatch(postMatchup(matchupResults));
    
    const entries = this.selectTwoEntries();
    this.setState({
      loaded: true,
      entryA: entries[0],
      entryB: entries[1],
    });
  }

  render() {
    const listId = this.getListId();

    if (!this.state.loaded) {
      return <Text>Loading {listId} </Text>;
    }
    const { list, listRankings } = this.props;
    const { loading, loaded } = listRankings[listId] || {};
    const { entryA, entryB } = this.state;

    console.log('cage render');
    console.log(this.state)
    // console.log(this.props);
    // console.log(this.state);

    const { title } = list.byId[listId];

    return (
      <View style={styles.container}>
        <Text h2 style={styles.header}>{title}</Text>
        <View style={styles.entriesContainer}>
          <TouchableHighlight
            style={styles.entryWrapper}
            onPress={() => this.handlePress(entryA.id, entryB.id)}
          >
            <View>
              <Text>{(entryA || {}).title}</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight
            style={styles.entryWrapper}
            onPress={() => this.handlePress(entryB.id, entryA.id)}
          >
            <View>
              <Text>{(entryB || {}).title}</Text>
            </View>
          </TouchableHighlight>
        </View>
        {/* <View style={styles.rankingsWrapper}>
          <Rankings listId={listId}/>
        </View> */}
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
  header: {
    borderColor: 'black',
    borderWidth: 1,
  },
  entriesContainer: {
    borderColor: 'yellow',
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  entryWrapper: {
    borderColor: 'purple',
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  entryTitle: {

  }
});

function mstp({ list, listRankings, auth }) {
  return {
    list,
    listRankings,
    user: auth.user,
  };
}
export default connect(mstp)(Cage);
