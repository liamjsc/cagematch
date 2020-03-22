import React, { Component } from 'react';
import { StyleSheet, Text, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';

import { ListCard } from '../components';
import { loadAllLists } from '../actions/list';
import * as constants from '../util/constants';

class BrowseLists extends Component {
  static navigationOptions = {
    title: 'CAGEMATCH',
    headerTitleStyle : {width : Dimensions.get('window').width}
  };
  componentDidMount() {
    const { loaded, loading } = this.props;
    if (!loaded && !loading) this.props.dispatch(loadAllLists());
  }

  goToCage = ({ listId, title }) => {
    console.log('BrowseLists.js - go to cage', listId);
    this.props.navigation.navigate('Cage', {
      listId,
      title
    });
  }

  goToListDetail = ({ listId, title }) => {
    console.log('BrowseLists.js - go to list full detail', listId);
    this.props.navigation.navigate('ListFullDetail', {
      listId,
      title
    });
  }

  render() {
    const { loaded, loading, listIds, byId } = this.props;
    if (loading) return <Text>Loading</Text>;

    return (
      <FlatList
        style={styles.list}
        data={listIds}
        renderItem={({ item }) => {
          return (
            <ListCard
              goToListDetail={this.goToListDetail}
              goToCage={this.goToCage}
              {...byId[item]}
            />
          )
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
    // backgroundColor: 'black' || 'lightslategray',
    width: '100%',
  },
});

// const initialState = {
//   loaded: false,
//   loading: false,
//   listIds: [],
//   byId: {},
// }
function mstp(state) {
  const { list } = state;
  return list;
}
export default connect(mstp)(BrowseLists);
