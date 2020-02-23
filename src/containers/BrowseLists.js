import React, { Component } from 'react';
import { StyleSheet, Text, Dimensions, FlatList } from 'react-native';
import { connect } from 'react-redux';

import { ListCard } from '../components';
import { loadAllLists } from '../actions/list';

class BrowseLists extends Component {
  static navigationOptions = {
    title: 'Browse',
    headerTitleStyle : {width : Dimensions.get('window').width}
  };
  componentDidMount() {
    const { loaded, loading } = this.props;
    if (!loaded && !loading) this.props.dispatch(loadAllLists());
  }

  goToCage = (id) => {
    console.log('go to cage', id);
    this.props.navigation.navigate('Cage', {
      listId: id,
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
    backgroundColor: 'lightslategray',
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
