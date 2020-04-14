import React, { Component } from 'react';
import { 
  ActivityIndicator,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {
  ButtonGroup,
  SearchBar,
} from 'react-native-elements';
import { connect } from 'react-redux';

import { ListCard, Padding } from '../components';
import { loadAllLists } from '../actions/list';
import * as constants from '../util/constants';

const POPULAR = 'Popular';
const MY_LISTS = 'My Lists';
const NEW = 'New';
const tabs = [
  POPULAR,
  MY_LISTS,
  NEW,
]
class BrowseLists extends Component {
  static navigationOptions = {
    title: 'CAGEMATCH',
  };

  state = {
    refreshing: false,
    search: '',
    tabIndex: 0,
  }

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

  goToListEdit = ({ listId }) => {
    console.log('BrowseLists.js - go to list edit', listId);
    this.props.navigation.navigate('ListEdit', {
      listId,
    });
  }

  goToListDetail = ({ listId, title }) => {
    console.log('BrowseLists.js - go to list full detail', listId);
    this.props.navigation.navigate('ListFullDetail', {
      listId,
      title,
    });
  }

  onRefresh = () => {
    this.setState({ refreshing: true });
    this.props.dispatch(loadAllLists())
      .then(() => this.setState({ search: '', refreshing: false }));
  }

  updateSearch = search => this.setState({ search });
  onSearchClear = () => this.setState({ search: '' });

  setActiveTab = (tabIndex) => this.setState({ tabIndex })

  goToUserDetail = (params) => {
    console.log('gotouserdetail', params);
    this.props.navigation.navigate('UserDetail', params);
  }

  render() {
    const { userId, loading, listIds, byId } = this.props;
    if (loading) return (
      <ActivityIndicator
        style={{ paddingTop: 250 }}
        size="large"
      />
    );
    const { search, tabIndex } = this.state;

    // apply search filter
    const searchFiltered = listIds.filter(id => {
      const { title: listTitle } = byId[id];
      return listTitle.toLowerCase().indexOf(search.toLowerCase()) >= 0;
    });

    let listIdsToRender = searchFiltered;
    // apply tab filter
    const tab = tabs[tabIndex];
    if (tab === MY_LISTS) {
      listIdsToRender = searchFiltered.filter(id => {
        const { user_id } = byId[id];
        return parseInt(user_id) === parseInt(userId);
      }).sort((a,b) => {
        const { createdAt: createdAtA } = byId[a];
        const { createdAt: createdAtB } = byId[b];
        return new Date(createdAtA) > new Date(createdAtB) ? -1 : 1;
      });
    }
    if (tab === NEW) {
      listIdsToRender = searchFiltered.sort((a,b) => {
        const { createdAt: createdAtA } = byId[a];
        const { createdAt: createdAtB } = byId[b];
        return new Date(createdAtA) > new Date(createdAtB) ? -1 : 1;
      });
    }

    return (
      <ScrollView
        style={styles.browseLists}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        <SearchBar
          placeholder="search"
          onChangeText={this.updateSearch}
          value={search}
          containerStyle={{
            backgroundColor: constants.background,
            borderWidth: 1,
            borderColor: constants.darkerGrey,
          }}
          inputContainerStyle={{
            backgroundColor: constants.background,
          }}
          inputStyle={{
            backgroundColor: constants.background,
          }}
          onClear={this.onSearchClear}
        />
        <ButtonGroup
          onPress={this.setActiveTab}
          selectedIndex={tabIndex}
          buttons={tabs}
        />
        <FlatList
          style={styles.list}
          data={listIdsToRender}
          renderItem={({ item }) => {
            console.log('flat list render');
            const topEntryId = byId[item].entries[0];
            console.log(topEntryId);
            const { image } = this.props.entryIdMap[topEntryId];
            return (
              <ListCard
                goToListEdit={this.goToListEdit}
                goToListDetail={this.goToListDetail}
                goToCage={this.goToCage}
                goToUserDetail={this.goToUserDetail}
                image={image}
                {...byId[item]}
              />
            )
          }}
          keyExtractor={(item, idx) => `${idx}`}
        />
        <Padding/>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  browseLists: {
    backgroundColor: constants.background,
  },
  list: {
    flex: 1,
  },
});

// const initialState = {
//   loaded: false,
//   loading: false,
//   listIds: [],
//   byId: {},
// }
function mstp({list, entries, auth}) {
  const { user: { id: userId } } = auth;
  return {
    ...list,
    userId,
    entryIdMap: entries.byId,
  };
}
export default connect(mstp)(BrowseLists);
