import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Text,
} from 'react-native';
import {
  Card,
  Button,
  Icon,
} from 'react-native-elements';

import { loadList } from '../actions/list';
import { getExclusions } from '../actions/auth';
import Rankings from '../components/Rankings';

class ListFullDetail extends Component {
  static navigationOptions = ({ navigation, screenProps }) => {
    const title = navigation.getParam('title');
    return {
      title,
      headerTitleStyle : { width : Dimensions.get('window').width }
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
    } = this.props;

    if (!rankedList || !rankedList.length) return null;

    return (
      <ScrollView>
        <Card>
          <Text style={{marginBottom: 10}}>
            {description}
          </Text>
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
            title='Manage Entries'
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

// const styles = StyleSheet.create({
// });

function mstp(state, ownProps) {
  const { list, listRankings, entries } = state;
  const listId = ownProps.navigation.getParam('listId');
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