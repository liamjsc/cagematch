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
  Image,
  ListItem,
} from 'react-native-elements';

import { connect } from 'react-redux';

import ToggleSwitch from 'toggle-switch-react-native';

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
    headerTitleStyle : { width : Dimensions.get('window').width }
  };

  // map of id: excludeBool
  state = {}

  onToggle = (id) => {
    console.log('on toggle', id);
    console.log(this.state);
    console.log(this.state.id);
    console.log('update state');
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
    console.log(this.state);
    return (
      <ScrollView style={styles.container}>
        {
          items.map(entryId => {
            const entry = entriesById[entryId];
            const isPending = typeof this.state[entryId] !== 'undefined';
            console.log('isPending', isPending);
            const isExcluded = isPending ? this.state[entryId] : !!exclusionById[entryId];
            return (
              <RowItem
                key={entry.id}
                id={entry.id}
                title={entry.title}
                isExcluded={isExcluded}
                onToggle={this.onToggle}
              />
            )
          })
        }
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 15,
    // paddingRight: 15,
    backgroundColor: 'lightslategray',
    width: '100%',
    borderWidth: 1,
    borderColor: 'green',
  },
});

function mstp({
  entries,
  auth: { user, exclusions },
  list,
}, { navigation }) {
  const listId = navigation.getParam('listId');
  const items = list.byId[listId].entries.map(entry => entry.id) || [];
  const listExclusions = exclusions[listId] || [];

  exclusionById = {}
  listExclusions.forEach(excludeId => {
    exclusionById[excludeId] = true;
  });

  return {
    user,
    entriesById: entries.byId,
    items,
    exclusionById,
  };
}
export default connect(mstp)(ManageListEntries);
