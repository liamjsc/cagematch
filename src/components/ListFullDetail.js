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
    dispatch(loadList(listId));
  }

  goToCage = () => {
    const params = {
      listId: this.props.listId,
      title: this.props.title,
    }
    this.props.navigation.navigate('Cage', params);
  }

  render() {
    const {
      createdBy = 'cage_fan_l27',
      description = 'best cage movie',
      rankedList,
      listId,
    } = this.props;

    if (!rankedList || !rankedList.length) return null;

    return (
      <ScrollView>
        <Card
          image={{uri: 'https://s22928.pcdn.co/wp-content/uploads/2016/05/Kobe-Shaq.jpg' }}
        >
          <Text style={{marginBottom: 10}}>
            {description}
          </Text>

          <Text style={{marginBottom: 10}}>
            Created by: {createdBy}
          </Text>

          <Button
            icon={<Icon name='assessment' color='#ffffff' />}
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='RANK NOW'
            onPress={this.goToCage}
          />
        </Card>

        <Card title="STANDINGS">
          <Rankings 
            listId={listId}
            length={5}
          />
        </Card>

        <Card title="STATS">
          <View>
            <Text>319 Matchups</Text>
            <Text>4 Contributors</Text>
          </View>
        </Card>
        <Card>
          <Button
            icon={<Icon name='assessment' color='#ffffff' />}
            buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
            title='RANK NOW'
            onPress={this.goToCage}
          />
        </Card>
      </ScrollView>
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