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
    } = this.props;
    return (
      <View>
        {rankedList.map((item, i) => {
          const { title, score } = item;
          return (
            <ListItem
              key={i}
              title={title}
              subtitle={'' + score}
              bottomDivider
            />
          )
        })}
      </View>
    )
  }
}

const styles = StyleSheet.create({
});

function mstp({ listRankings, entries }, { listId }) {
  console.log('####');
  console.log(listRankings);
  console.log(entries);
  const listEntries = listRankings[listId].children;
  return {
    rankedList: listEntries.map(id => entries.byId[id]).sort(function (a, b) {
      return a.score > b.score ? -1 : 1;
  })
  }
}

export default connect(mstp)(Rankings);