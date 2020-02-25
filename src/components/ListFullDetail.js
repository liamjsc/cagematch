import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
  Dimensions,
  Text,
} from 'react-native';

import { loadList } from '../actions/list';
import { TouchableHighlight } from 'react-native-gesture-handler';

// import {
// } from 'react-native-elements';

class ListFullDetail extends Component {
  static navigationOptions = {
    headerTitleStyle : { width : Dimensions.get('window').width }
  };

  componentDidMount() {
    const { listId, dispatch } = this.props;
    dispatch(loadList(listId));
  }

  goToCage = () => {
    this.props.navigation.navigate('Cage', { listId: this.props.listId });
  }
  render() {
    const {
      title,
      createdBy = 'cage_fan_l27',
      description = 'best cage movie',
      rankedList,
    } = this.props;
    if (!rankedList || !rankedList.length) return null;
    console.log(rankedList);
    return (
      <View>
        <Text h2>{title}</Text>
        <Text>Created by: {createdBy}</Text>
        <Text>{description}</Text>
        <View>
          <Text>Top 5</Text>
          <View>
            {
              rankedList.map((item, index) => {
                const rank = index + 1;
                if (rank > 5) return null;
                return (
                  <View>
                    <Text>{rank}: {item.title}</Text>
                  </View>
                );
              })
            }
          </View>
          <TouchableHighlight
            onPress={this.goToCage}
          >
            <Text>Go To CAGE!!!</Text>
          </TouchableHighlight>
        </View>
      </View>
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