import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  ScrollView,
} from 'react-native';
import {
  Card,
  Button,
  Text,
} from 'react-native-elements';

import { loadList } from '../actions/list';
import { getExclusions } from '../actions/auth';
import Rankings from '../components/Rankings';
import * as constants from '../util/constants';

class ListFullDetail extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const title = navigation.getParam('title');
    console.log('get title on full detail', title)
    return {
      title,
    };
  };

  componentDidMount() {
    const { listId, dispatch } = this.props;
    const promises = [
      dispatch(loadList(listId)),
      dispatch(getExclusions()),
    ];
    Promise.all(promises);
  }

  goToCage = () => {
    const params = {
      listId: this.props.listId,
      title: this.props.title,
    }
    this.props.navigation.navigate('Cage', params);
  }

  goToManageEntries = () => {
    const params = {
      listId: this.props.listId,
      title: this.props.title,
    }
    this.props.navigation.navigate('ManageListEntries', params);
  }

  goToFullStandings = () => {
    const params = {
      listId: this.props.listId,
      title: this.props.title,
    }
    this.props.navigation.navigate('Standings', params);
  }

  render() {
    const {
      // createdBy = 'cage_fan_l27',
      description = 'best cage movie',
      rankedList,
      listId,
      image,
      matchupCount,
    } = this.props;

    if (!rankedList || !rankedList.length) return null;

    return (
      <ScrollView style={style.container}>
        <Card>
          <Text style={{marginBottom: 10}}>
            {description}
          </Text>
          {
            matchupCount ? (<Text style={{marginBottom: 10}}>
              {matchupCount} matchup{matchupCount === 1 ? '' : 's'} counted
            </Text>) : null
          }
          {/* 
          <Text style={{marginBottom: 10}}>
            Created by: {createdBy}
          </Text> */}

          <Button
            containerStyle={{ marginBottom: 10 }}
            buttonStyle={{ borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0 }}
            title='Rank'
            onPress={this.goToCage}
          />
          <Button
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='Show/Hide Entries'
            onPress={this.goToManageEntries}
          />
        </Card>

        <Card title="STANDINGS">
          <Rankings 
            listId={listId}
            length={5}
          />
          <Button
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='View Full Standings'
            onPress={this.goToFullStandings}
          />
        </Card>

        {/* <Card title="STATS">
          <View>
            <Text>319 Matchups</Text>
            <Text>4 Contributors</Text>
          </View>
        </Card> */}
      </ScrollView>
    )
  }
}

const style = StyleSheet.create({
  container: {
    backgroundColor: constants.background,
  }
});

function mstp(state, ownProps) {
  const { list, listRankings, entries } = state;
  const listId = ownProps.navigation.getParam('listId');
  const {
    title,
    createdBy,
    description,
    matchupCount,
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
    matchupCount,
  }
}

export default connect(mstp)(ListFullDetail);