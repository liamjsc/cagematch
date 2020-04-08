import React, { Component } from 'react';
import {
  StyleSheet, 
  View,
  ScrollView,
  Dimensions,
} from 'react-native';

import { 
  Text,
  Button,
  Divider,
} from 'react-native-elements';

import { connect } from 'react-redux';

import ToggleSwitch from 'toggle-switch-react-native';
import { batchUpdateExclusions } from '../actions/auth';
import * as constants from '../util/constants';

class RowItem extends Component {
  onToggle = (id) => {
    this.props.onToggle(id);
  }

  render() {
    const {
      title,
      isExcluded,
      id,
    } = this.props;

    return (
      <View style={rowStyles.rowItem}>
        <Text style={rowStyles.title}>{title}</Text>
        <ToggleSwitch
          style={rowStyles.toggle}
          isOn={!isExcluded}
          onToggle={() => this.onToggle(id)}
        />
      </View>
    );
  }
}

const rowStyles = StyleSheet.create({
  rowItem: {
    flexDirection: 'row',
    flex: 1,
    padding: 20,
    width: '100%',
  },
  title: {
    flex: 4,
  },
  toggle: {
    flex: 1,
  }
});

class ManageListEntries extends Component {
  static navigationOptions = {
    title: 'Manage List',
  };

  // map of id: excludeBool
  state = {}

  componentWillUnmount() {
    console.log('unmounting, saving', this.state);
    this.saveChanges();
  }

  saveChanges = () => {
    console.log('@saveChanges')
    const { dispatch, listId, user: { id: userId } } = this.props;
    const toExclude = [];
    const toInclude = [];
    Object.keys(this.state).forEach(id => {
      this.state[id] ? toExclude.push(id) : toInclude.push(id);
    });
    const data = {
      toExclude,
      toInclude,
      listId,
      userId,
    };
    console.log(data);
    dispatch(batchUpdateExclusions(data))
  }

  onToggle = (id) => {
    const isPending = typeof this.state[id] !== 'undefined';

    let excludeBool;
    if (isPending) {
      // if its already pending, just reverse it
      excludeBool = !this.state[id];
    } else {
      // if its not pending, see if its in exclusions already
      const isInExclusions = typeof this.props.exclusionById[id] !== 'undefined';
      if (isInExclusions) {
        excludeBool = !this.props.exclusionById[id];
      } else {
        // it is not excluded, and it is not already pending. exclude it
        excludeBool = true;
      }
    }

    const updateState = {
      [id]: excludeBool,
    }

    this.setState(updateState);
  };

  render() {
    const { entriesById, items, exclusionById } = this.props;
    const sortedItems = items.slice().sort((a, b) => {
      return entriesById[b].title.toLowerCase() < entriesById[a].title.toLowerCase() ? 1 : -1;
    });
    return (
      <ScrollView style={styles.container}>
        <View>
          {
            sortedItems.map((entryId, i) => {
              const entry = entriesById[entryId];
              const isPending = typeof this.state[entryId] !== 'undefined';
              const isExcluded = isPending ? this.state[entryId] : !!exclusionById[entryId];
              return (
                <View
                  key={entry.id}
                >
                  <RowItem
                    id={entry.id}
                    title={entry.title}
                    isExcluded={isExcluded}
                    onToggle={this.onToggle}
                  />
                  { i === items.length -1 ? null : <Divider/> }
                </View>
              )
            })
          }
        </View>
        
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: constants.background,
  },
});

function mstp({
  entries,
  auth: { user, exclusions },
  list,
}, { navigation }) {
  const { byId: entryIdMap } = entries;
  const listId = navigation.getParam('listId');
  const items = list.byId[listId].entries || [];
  const listExclusions = exclusions[listId] || [];

  const exclusionById = {};
  listExclusions.forEach(excludeId => {
    exclusionById[excludeId] = true;
  });

  return {
    user,
    entriesById: entryIdMap,
    items,
    exclusionById,
    listId,
  };
}
export default connect(mstp)(ManageListEntries);
