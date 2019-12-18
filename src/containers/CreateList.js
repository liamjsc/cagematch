import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
} from 'react-native';
import { Input, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import { createList } from '../actions/list';

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
    const { title, entries } = this.state;

    const list = {
      title,
      entries: entries.map((title) => ({ title })),
    }
    console.log('onClickCreateList', list);
    this.setState({ posting: true });
    return this.props.dispatch(createList(list))
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
    console.log(this.state);
    return (
      <View style={styles.createList}>

        <View style={styles.titleArea}>
          <Input
            containerStyle={styles.titleContainer}
            placeholder="Title..."
            onChange={(text) => this.setState({ title: text })}
            value={this.state.title}
          />
        </View>

        <View style={styles.newEntryRow}>
          <Input
            containerStyle={styles.addInputContainer}
            placeholder='New Entry'
            leftIcon={{ type: 'material', name: 'add-circle-outline' }}
            value={this.state.pendingEntry}
            onChangeText={(text) => this.setState({ pendingEntry: text })}
          />
          <Button
            style={styles.addButton}
            title="Add"
            onPress={this.onClickAddItem}
            style={styles.addButton}
          />
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
          style={styles.button}
          onPress={this.onClickCreateList}
          title="Save List"
        />
      </View >
    )
  }
}

const styles = StyleSheet.create({
  createList: {
    borderWidth: 1,
    borderColor: 'green',
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'steelblue',
    color: 'black',
    alignItems: 'stretch',
    // justifyContent: 'space-between',
    padding: 10,
  },
  titleArea: {
    borderWidth: 1,
    borderColor: 'orange',
    flex: 2,
  },
  titleContainer: {
    marginTop: 40,
    height: 40,
    width: '100%',
  },
  newEntryRow: {
    borderWidth: 1,
    borderColor: 'pink',
    height: 80,
    flexDirection: 'row',
  },
  addInputContainer: {
    borderWidth: 1,
    borderColor: 'yellow',
    flex: 4,
  },
  addButton: {
    flex: 2,
    borderWidth: 1,
    borderColor: 'black',
  },
  textBox: {
    borderColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    fontSize: 18,
    flex: 8,
  },

  button: {
    width: '50%',
    flex: 2,
    marginBottom: 20,
  },
  list: {
    width: '100%',
    flex: 8,
    height: 40,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  listItem: {
    // flex: 1,
    height: 50,
    fontSize: 18,

  }
});

export default connect()(CreateList);