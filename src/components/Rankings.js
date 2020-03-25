import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Divider,
} from 'react-native-elements';

const RankingRow = ({ id, title, score, rank, winCount, lossCount}) => {
  return (
    <View style={rowStyle.rankingRow}>
      <Text style={rowStyle.rank}>{rank}</Text>
      <Text style={rowStyle.title}>{title}</Text>
      <Text style={rowStyle.record}>{winCount}-{lossCount}</Text>
      <Text style={rowStyle.score}>{score}</Text>
    </View>
  )
}

const rowStyle = StyleSheet.create({
  rankingRow: {
    width: '100%',
    flexDirection: 'row',
    height: 50,
    padding: 10,
    alignItems: 'center',
  },
  rank: {
    color: 'gray',
    flex: 2,
  },
  title: {
    flex: 8,
  },
  record: {
    flex: 4,
  },
  score: {
    flex: 4,
  }
});

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
            const { title, score, winCount, lossCount } = item;
            return (
              <View 
                style={{
                  width: '100%',
                }}
                key={i}
              >
                <RankingRow
                  title={title}
                  score={'' + score}
                  rank={i+1}
                  winCount={winCount}
                  lossCount={lossCount}
                />
                { i === items.length -1 ? null : <Divider/> }
              </View>
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
    const { records, rankings } = userRankings[userId][listId];
    const rankedList = rankings.map(id => {
      return {
        ...entries.byId[id],
        ...records[id], // attaches score, winCount, lossCount
      }
    }).filter(x => (x.winCount > 0 || x.lossCount > 0));
    return { rankedList }
  }
  
  const listEntries = listRankings[listId].children; // array of ID's
  return {
    rankedList: listEntries.map(id => entries.byId[id]).sort(function (a, b) {
      return a.score > b.score ? -1 : 1;
  })
  }
}

export default connect(mstp)(Rankings);