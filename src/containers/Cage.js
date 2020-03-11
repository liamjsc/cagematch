import React, { Component } from 'react';
import {
  StyleSheet, 
  View,
  ScrollView,
  TouchableHighlight,
  Dimensions,
  RefreshControl,
 } from 'react-native';

 import { 
  Text,
  Button,
  Image,
 } from 'react-native-elements';
import { connect } from 'react-redux';

import { loadList, fetchUserListRankings } from '../actions/list';
import { exclude, getExclusions } from '../actions/auth';
import { postMatchup } from '../actions/matchup';
import { Rankings } from '../components';

const CageEntry = (props) => {
  const {
    id,
    handlePress,
    image,
    hide,
    title,
  } = props;

  return (
    <View style={styles.entryWrapper}>
      <TouchableHighlight
        style={styles.entry}
        onPress={handlePress}
      >
        <View style={styles.touchableEntry}>
          {
            !image ? null : (<Image
              source={{ uri: image }}
              style={{ width: '95%', aspectRatio: 182 / 268 }}
            />)
          }
          <Text>{title}</Text>
        </View>
      </TouchableHighlight>
      <Button
        titleProps={{ style: { color: 'gray' } }}
        buttonStyle={styles.hideButton}
        title="Hide this entry"
        onPress={hide}
        type="clear"
      />
    </View>
  )
}

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
    this.loadCage();
  }

  loadCage = () => {
    const listId = this.getListId();
    const { user, listRankings, dispatch } = this.props;

    const userId = user.id;
    return dispatch(getExclusions())
      .then(() => {
        return dispatch(loadList(listId));
      })
      .then(() => dispatch(fetchUserListRankings({ listId, userId })))
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
    const { dispatch, user: { id: userId } } = this.props;
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

    dispatch(postMatchup(matchupResults));
    
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

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.loadCage()
      .then(() => this.setState({ refreshing: false }));
  }

  render() {
    const listId = this.getListId();

    if (!this.state.loaded) {
      return <Text>Preparing the cage</Text>;
    }
    const { list } = this.props;
    const { entryA, entryB } = this.state;

    const { title: listTitle } = list.byId[listId];

    console.log('cage render');
    console.log(this.state);
    console.log(this.props.hiddenEntries);

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
        <View style={styles.entriesContainer}>
          <CageEntry
            handlePress={() => this.handlePress(entryA.id, entryB.id)}
            hide={() => this.hide(entryA.id)}
            image={entryA.image}
            title={entryA.title}
            id={entryA.id}
          />
          <CageEntry
            handlePress={() => this.handlePress(entryB.id, entryA.id)}
            hide={() => this.hide(entryB.id)}
            image={entryB.image}
            title={entryB.title}
            id={entryB.id}
          />
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
        <View style={styles.rankingsWrapper}>
          <Text h4>Rankings</Text>
          <Rankings 
            listId={listId}
            userId={this.props.user.id}
            length={5}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    // backgroundColor: 'lightslategray',
    width: '100%',
    borderWidth: 0,
    borderColor: 'green',
  },
  entriesContainer: {
    width: '100%',
    paddingTop: 10,
    borderColor: 'yellow',
    borderWidth: 0,
    // flex: 1,
    flexDirection: 'row',
  },
  entryWrapper: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'purple',
    borderWidth: 0,
    flex: 1,
  },
  entry: {
    borderColor: 'black',
    borderWidth: 1,
    width: '100%',
    alignItems: 'center',
  },
  touchableEntry: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
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
  },
  rankingsWrapper: {
    alignItems: 'center',
    width: '100%',
  }
});

function mstp({ list, listRankings, auth, userRankings }, { navigation }) {
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
