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
  Card,
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
    const { user, dispatch } = this.props;

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
    const { candidates } = this.props;
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
    const { hiddenEntries, candidates } = this.props;
    const { entryA, entryB } = this.state;

    const hiddenCount = hiddenEntries.length;
    const candidatesLength = candidates.length;

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
          <View style={styles.spacing}/>
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

        <View style={{ flexDirection: 'row' }}>
          {
            candidatesLength ? (
              <Text>
                {candidatesLength} candidates     
              </Text>
            ) : null
          }
          {
            hiddenCount ? (
              <Text>
                {hiddenCount} hidden     
              </Text>
            ) : null
          }
        </View>
        <View style={styles.rankingsWrapper}>
          <Card title="Your Rankings">
            <Rankings 
              listId={listId}
              length={5}
              userId={this.props.user.id}
            />
          </Card>
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
    // paddingTop: 10,
    padding: 15,
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
    flex: 9,
  },
  spacing: {
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
    // alignItems: 'center',
    width: '100%',
  }
});

function mstp({ list, listRankings, auth, userRankings }, { navigation }) {
  const { exclusions, user } = auth;
  const listId = navigation.getParam('listId');

  const hiddenEntries = exclusions[listId] || [];
  const { entries } = list.byId[listId];
  const candidates = entries.filter(entry => {
    return hiddenEntries.indexOf(entry.id) < 0;;
  });
  return {
    list,
    listRankings,
    user,
    hiddenEntries,
    candidates,
  };
}
export default connect(mstp)(Cage);
