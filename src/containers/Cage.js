import React, { Component } from 'react';
import {
  StyleSheet, 
  View, 
  TouchableHighlight,
  Dimensions,
 } from 'react-native';
import { 
  Text,
  Card,
  Button,
  Image,
 } from 'react-native-elements';
import { connect } from 'react-redux';

import { loadList } from '../actions/list';
import { exclude, getExclusions } from '../actions/auth';
import { postMatchup } from '../actions/matchup';
import { Rankings } from '../components';

class Cage extends Component {
  static navigationOptions = ({ navigation }) => {
    const title = navigation.getParam('title');
    return {
      title,
      headerTitleStyle : { width : Dimensions.get('window').width }
    };
  }

  // todo- make an entriesById map and access ID here
  state = {
    entryAId: '',
    entryBId: '',
    entryA: {},
    entryB: {},
    loaded: false,
  }

  componentDidMount() {
    const listId = this.getListId();
    const { list, listRankings, dispatch } = this.props;
    const { loading, loaded } = listRankings[listId] || {};

    return dispatch(getExclusions())
      .then(() => {
        return dispatch(loadList(listId));
      })
      .then(() => {
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

  getListId = () => {
    console.log('get list id');
    return this.props.navigation.getParam('listId');
  }

  selectTwoEntries = () => {
    const { list, hiddenEntries } = this.props;
    const listId = this.getListId();
    const { entries } = list.byId[listId];
    const candidates = entries.filter(entry => {
      return hiddenEntries.indexOf(entry.id) < 0;;
    });
    // Object {
    //   "createdAt": "2019-11-26T02:38:28.866Z",
    //   "id": "d42cfd9f-1cba-44e5-9cea-7d4efc12bd40",
    //   "listId": "9d0098ed-d07c-43ff-a3f3-3ce958858b6b",
    //   "list_id": "9d0098ed-d07c-43ff-a3f3-3ce958858b6b",
    //   "title": "Shaq",
    //   "updatedAt": "2019-11-26T02:38:28.866Z",
    // },

    const indexOne = Math.floor(Math.random() * candidates.length);
    let indexTwo = Math.floor(Math.random() * candidates.length);
    while (candidates && candidates.length && candidates.length > 1 && indexOne === indexTwo) {
      indexTwo = Math.floor(Math.random() * candidates.length);
    }
    return [candidates[indexOne], candidates[indexTwo]];
  }

  resetEntries = () => {
    const entries = this.selectTwoEntries();
    this.setState({
      loaded: true,
      entryA: entries[0],
      entryB: entries[1],
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
    
    this.resetEntries();
  }

  // hides entry for this user
  hide = (entryId) => {
    const listId = this.getListId();
    this.props.dispatch(exclude({
      listId, entryIds: [entryId]
    }));
    this.resetEntries();
  }

  render() {
    const listId = this.getListId();

    if (!this.state.loaded) {
      return <Text>Loading {listId} </Text>;
    }
    const { list, listRankings } = this.props;
    const { loading, loaded } = listRankings[listId] || {};
    const { entryA, entryB } = this.state;

    const { title } = list.byId[listId];

    console.log('cage render');
    console.log(this.state);
    console.log(this.props.hiddenEntries);

    return (
      <View style={styles.container}>
        <View style={styles.entriesContainer}>
          <View style={styles.entryWrapper}>
            <TouchableHighlight
              style={styles.entry}
              onPress={() => this.handlePress(entryA.id, entryB.id)}
            >
              <Image
                source={{ uri: entryA.image }}
                style={{ width: '95%', aspectRatio: 182 / 268 }}
              />
            </TouchableHighlight>
            <Button
              buttonStyle={styles.hideButton}
              titleProps={{ style: { color: 'white' } }}
              title="Hide this entry"
              onPress={() => {
                this.hide(entryA.id);
              }}
              type="clear"
            />
          </View>
          <View style={styles.entryWrapper}>
            <TouchableHighlight
              style={styles.entry}
              onPress={() => this.handlePress(entryB.id, entryA.id)}
            >
              <Image
                source={{ uri: entryB.image }}
                style={{ width: '95%', aspectRatio: 182 / 268 }}
              />
            </TouchableHighlight>
            <Button
              titleProps={{ style: { color: 'white' } }}
              buttonStyle={styles.hideButton}
              title="Hide this entry"
              onPress={() => {
                this.hide(entryB.id);
              }}
              type="clear"
            />
          </View>
        </View>
        <View style={styles.skip}>
          <Button
            titleProps={{ style: { color: 'white' } }}
            buttonStyle={styles.skip}
            title="Skip"
            onPress={() => {
              this.resetEntries()
            }}
            type="clear"
          />
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
  entriesContainer: {
    paddingTop: 10,
    borderColor: 'yellow',
    borderWidth: 1,
    // flex: 1,
    flexDirection: 'row',
  },
  entryWrapper: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'purple',
    borderWidth: 1,
    flex: 1,
  },
  entry: {
    borderColor: 'black',
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  skip: {
    paddingTop: 15,
    alignItems: 'center',
  },
  skipText: {
    color: 'white',
  },
  hideButton: {
    paddingTop: 10,
    paddingBottom: 10,
  }
});

function mstp({ list, listRankings, auth }, { navigation }) {
  const { exclusions, user } = auth;
  const listId = navigation.getParam('listId');

  const hiddenEntries = exclusions[listId] || [];
  return {
    list,
    listRankings,
    user,
    hiddenEntries,
  };
}
export default connect(mstp)(Cage);
