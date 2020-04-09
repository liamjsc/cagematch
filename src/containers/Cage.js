import React, { Component } from 'react';
import {
  StyleSheet, 
  View,
  ScrollView,
  TouchableOpacity,
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
import { Rankings, Padding } from '../components';

import * as constants from '../util/constants';

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
      <TouchableOpacity
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
          <Text style={{ fontSize: 18, paddingTop: 5, paddingBottom: 5 }}>{title}</Text>
        </View>
      </TouchableOpacity>
      <Button
        titleProps={{ style: { color: constants.textGrey } }}
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
      headerBackTitleVisible: false,
    };
  }

  // todo- make an entriesById map and access ID here
  state = {
    entryA: {},
    entryB: {},
    loaded: false,
    refreshing: false,
  }

  componentDidMount() {
    this.loadCage();
  }

  goToListDetail = () => {
    const listId = this.getListId();

    const { title } = this.props.list.byId[listId];
    this.props.navigation.navigate('ListFullDetail', {
      listId,
      title
    });
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
        const entries = this.selectTwoEntries();
        this.setState({
          loaded: true,
          entryA: entries[0],
          entryB: entries[1],
        });
      });
  }

  getListId = () => {
    console.log('cage getListId');
    const listId = this.props.navigation.getParam('listId');
    console.log(listId);
    return listId;
  }

  selectTwoEntries = () => {
    const { candidateIds, entryIdMap } = this.props;
    const { entryA: { id: entryAId }, entryB: { id: entryBId } } = this.state;

    const indexOne = Math.floor(Math.random() * candidateIds.length);
    let indexTwo = Math.floor(Math.random() * candidateIds.length);

    console.log('selecting two entries', indexOne, indexTwo);
    // handle some cases here
    // make sure they arent the same index
    // make sure they are nt just repeating the previous two indices
    const validLength = candidateIds && candidateIds.length && candidateIds.length > 2;
    let isRepeat = [indexOne, indexTwo].indexOf(entryAId) >= 0 && [indexOne, indexTwo].indexOf(entryBId) >= 0;
    while (validLength && (indexOne === indexTwo || isRepeat)) {
      indexTwo = Math.floor(Math.random() * candidateIds.length);
      isRepeat = [indexOne, indexTwo].indexOf(entryAId) >= 0 && [indexOne, indexTwo].indexOf(entryBId) >= 0;
    }
    return [entryIdMap[candidateIds[indexOne]], entryIdMap[candidateIds[indexTwo]]];
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
    console.log('hide', entryId);
    const { entryA, entryB } = this.state;
    const { candidateIds, entryIdMap } = this.props;
    const listId = this.getListId();
    if (candidateIds.length <= 3) {
      console.log('handle small lists better');
      return;
    }

    // find the index in state
    const hideIndex = entryId === entryA.id ? 0 : 1;

    let randomIndex = Math.floor(Math.random() * candidateIds.length);
    while (entryIdMap[candidateIds[randomIndex]].id === entryA.id || entryIdMap[candidateIds[randomIndex]].id === entryB.id) {
      randomIndex = Math.floor(Math.random() * candidateIds.length);
    }

    // pick a random number from candidates until the id is neither a or b
    this.props.dispatch(exclude({
      listId, entryIds: [entryId]
    }));

    this.setState({
      [hideIndex === 0 ? 'entryA' : 'entryB']: entryIdMap[candidateIds[randomIndex]],
    });
  }

  goToFullStandings = () => {
    const { listId, list } = this.props;
    const { title } = list.byId[listId];
    const params = {
      listId,
      title,
    }
    this.props.navigation.navigate('Standings', params);
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
    const { entryA, entryB } = this.state;

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
        <View>
          <View style={styles.lrPad}>
            <Button
              titleProps={{
                style: {
                  color: constants.textGrey,
                },
              }}
              buttonStyle={styles.skip}
              title="Skip"
              onPress={() => this.resetEntries()}
              type="clear"
            />
          </View>      
        </View>
        <View>
          <View style={styles.lrPad}>
            <Button
              title="List Details"
              onPress={this.goToListDetail}
            /> 
          </View>      
        </View>

        <View style={styles.rankingsWrapper}>
          <Card title="Your Rankings">
            <Rankings 
              listId={listId}
              length={5}
              userId={this.props.user.id}
            />
            <Button
              title="Full Standings"
              onPress={this.goToFullStandings}
              type="clear"
            />
          </Card>
        </View>
        <Padding/>

      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  lrPad: {
    paddingLeft: 15,
    paddingRight: 15,
  },
  container: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    backgroundColor: constants.background,
    width: '100%',
  },
  entriesContainer: {
    width: '100%',
    padding: 15,
    paddingBottom: 0,
    flexDirection: 'row',
  },
  entryWrapper: {
    padding: 0,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 9,
    height: 350,
  },
  spacing: {
    flex: 1,
  },
  entry: {
    borderColor: constants.almostBlack,
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
    marginTop: 10,
    marginBottom: 10,
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: constants.almostBlack,
},
  hideButton: {
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: constants.almostBlack,
    // paddingTop: 15,
    // paddingBottom: 10,
  },
  rankingsWrapper: {
    // alignItems: 'center',
    width: '100%',
  }
});

function mstp({
  entries,
  list,
  listRankings,
  auth,
  userRankings,
}, { navigation }) {
  const { exclusions, user } = auth;
  const { byId: entryIdMap } = entries;
  const listId = navigation.getParam('listId');

  console.log(exclusions);
  const hiddenEntryIds = exclusions[listId] || [];

  const { entries: entryIds = [] } = (list.byId[listId] || {});
  const candidateIds = entryIds.filter(entryId => {
    return hiddenEntryIds.indexOf(entryId) < 0;;
  });

  console.log(hiddenEntryIds);
  console.log(candidateIds);
  console.log('candidateIds.length');
  console.log(candidateIds.length);
  return {
    listId,
    list,
    listRankings,
    user,
    hiddenEntryIds,
    candidateIds,
    entryIdMap,
  };
}
export default connect(mstp)(Cage);
