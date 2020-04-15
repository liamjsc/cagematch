import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Divider,
  Text,
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
                style={{ width: '100%' }}
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

function mstp({ userRankings, entries, list }, { listId, userId }) {
  if (userId) {
    const {
      records,
      rankings, // array of id's
    } = userRankings[userId][listId];
    const rankedList = rankings.map(id => {
      return {
        ...entries.byId[id],
        ...records[id], // attaches score, winCount, lossCount
      }
    }).filter(x => (x.winCount > 0 || x.lossCount > 0));
    return { rankedList }
  }
  
  const { entries: listEntries } = list.byId[listId]; // array of ID's
  const rankedGlobalList = listEntries.map(id => entries.byId[id]).sort(function (a, b) {
    return a.score > b.score ? -1 : 1;
  });

  return {
    rankedList: rankedGlobalList,
  }
}

export default connect(mstp)(Rankings);