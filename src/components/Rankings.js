import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  ListItem,
} from 'react-native-elements';

class Rankings extends Component {
  render() {
    const {
      rankedList,
      length,
    } = this.props;
    const items = length ? rankedList.slice(0, length) : rankedList;
    return (
      <View style={styles.rankings}>
        {
          items.map((item, i) => {
            const { title, score } = item;
            return (
              <ListItem
                key={i}
                title={title}
                subtitle={'' + score}
                bottomDivider
              />
            )
          })      
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rankings: {
    width: '100%',
  }
});

function mstp({ listRankings, userRankings, entries }, { listId, userId }) {
  console.log('MSTP Rankings');
  console.log('userId', userId);
  if (userId) {
    const { scores, rankings } = userRankings[userId][listId];
    console.log(scores);
    console.log(rankings);
    const rankedList = rankings.map(id => {
      return {
        ...entries.byId[id],
        score: scores[id],
      }
    });
    console.log(rankedList);
    return { rankedList }
  }
  
  const listEntries = listRankings[listId].children;
  return {
    rankedList: listEntries.map(id => entries.byId[id]).sort(function (a, b) {
      return a.score > b.score ? -1 : 1;
  })
  }
}

export default connect(mstp)(Rankings);