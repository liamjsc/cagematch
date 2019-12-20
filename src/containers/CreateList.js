import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import { Input, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import { createList as postList } from '../actions/list';

class CreateList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    title: '',
    entries: [],
    pendingEntry: '',
    posting: false,
    posted: false,
    error: null,
  }

  onClickCreateList = (e) => {
    console.log('click create');
    const { title, entries } = this.state;

    console.log(this.state);
    const list = {
      title,
      entries: entries.map((entryTitle) => ({ title: entryTitle })),
    }
    console.log('onClickCreateList', list);
    this.setState({ posting: true });
    return this.props.dispatch(postList(list))
      .then(() => this.setState({ posted: true, posting: false }))
      .catch((error) => this.setState({ posting: false, posted: false, error }))
  }

  onClickAddItem = () => {
    if (!this.state.pendingEntry) return;
    this.setState({
      entries: [...this.state.entries, this.state.pendingEntry],
      pendingEntry: '',
    })
  }

  render() {
    if (this.state.error) console.log(error);
    return (
      <View style={styles.createList}>

        <View style={styles.titleArea}>
          <Input
            containerStyle={styles.titleContainer}
            label="Title"
            placeholder="Nic Cage Movies..."
            onChangeText={(text) => {
              this.setState({ title: text })
          }}
            value={this.state.title}
            selectionColor="white"
            inputStyle={styles.titleInput}
          />
        </View>

        <View style={styles.newEntryRow}>
          <Input
            containerStyle={styles.addInputContainer}
            placeholder='New Entry...'
            value={this.state.pendingEntry}
            onChangeText={(text) => {
              this.setState({ pendingEntry: text })}
            }
          />
          <View
            style={styles.addButton}
          >
            <Button
              title="Add"
              onPress={this.onClickAddItem}
            />
          </View>
        </View>

        <View style={styles.list}>
          {this.state.entries.map((entry, idx) => {
            return (
              <Text key={idx + entry} style={styles.listItem}>
                {`${idx + 1}: ${entry}`}
              </Text>
            )
          })}
        </View>

        <Button
          containerStyle={styles.saveListButton}
          onPress={this.onClickCreateList}
          title="Save List"
          type="outline"
        />
        <Text>
          {JSON.stringify(this.state)}
        </Text>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  createList: {
    // flex: 1,
    // flexDirection: 'column',
    width: '100%',
    backgroundColor: 'teal',
    color: 'white',
    // alignItems: 'stretch',
    // justifyContent: 'space-between',
    padding: 10,
    paddingTop: 30,
    height: '100%',
  },
  titleArea: {
    // flex: 2,
    height: 110,
    borderBottomWidth: 2,
    borderBottomColor: 'black',
    marginBottom: 20,
  },
  titleContainer: {
    marginTop: 40,
    height: 40,
    width: '100%',
  },
  titleInput: {
    color: 'white',
  },
  newEntryRow: {
    height: 50,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  addInputContainer: {
    flex: 3,
  },
  addButton: {
    flex: 1,
    justifyContent: 'center',
  },
  list: {
    width: '100%',
    // alignItems: 'center',
    // justifyContent: 'flex-start',
    paddingTop: 20,
  },
  listItem: {
    height: 30,
    fontSize: 18,
  },
  saveListButton: {
    marginTop: 20,
  },
});

export default connect()(CreateList);