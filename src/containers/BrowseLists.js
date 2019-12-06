import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';
import { connect } from 'react-redux';

import { ListCard } from '../components';
import { loadAllLists } from '../actions/list';

class BrowseLists extends Component {
  componentDidMount() {
    if (!this.props.loading) this.props.dispatch(loadAllLists());
  }

  render() {
    const { loaded, loading, listIds, byId } = this.props;
    if (loading) return <Text>Loading</Text>;

    console.log('loading', loading);
    console.log('loaded', loaded);
    console.log('listIds', listIds);
    return (
      <FlatList
        style={styles.list}
        data={listIds}
        renderItem={({ item }) => {
          console.log('renderItem', item);
          return <ListCard {...byId[item]} />
        }}
        keyExtractor={(item, idx) => `${idx}`}
      />
    );
  }
}
const styles = StyleSheet.create({
  list: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: 'lightslategray',
    width: '100%',
  },
});

function mstp(state) {
  const { list } = state;
  return list;
}
export default connect(mstp)(BrowseLists);
