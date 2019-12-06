import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  Button,
} from 'react-native';
import { connect } from 'react-redux';
import { createList } from '../actions/list';
import { white } from 'ansi-colors';

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
        <View style={styles.upper}>
          <TextInput
            style={styles.title}
            placeholder="Nicolas Cage Movies..."
            onChangeText={(text) => this.setState({ title: text })}
            value={this.state.title}
            selectionColor="white"
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
        <View style={styles.inputRow}>
          <Text style={{ padding: 10 }}>Add Item</Text>
          <View
            style={{
              flexDirection: 'row',
              flex: 1,
              width: '100%',
            }}
          >
            <TextInput
              selectionColor="white"
              style={styles.textBox}
              placeholder="..."
              value={this.state.pendingEntry}
              onChangeText={(text) => this.setState({ pendingEntry: text })}
            />
            <Button
              title="Add"
              onPress={this.onClickAddItem}
              style={styles.addButton}
            />
          </View>
        </View>


        <Button
          style={styles.button}
          onPress={this.onClickCreateList}
          title="Save List"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  createList: {
    flex: 1,
    flexDirection: 'column',
    width: '100%',
    backgroundColor: 'steelblue',
    color: 'black',
    alignItems: 'stretch',
    // justifyContent: 'space-between',
    padding: 10,
  },
  upper: {
    flex: 2,
  },
  title: {
    marginTop: 40,
    height: 40,
    width: '100%',
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  inputRow: {
    height: 80,
  },
  textBox: {
    borderColor: 'white',
    borderWidth: 1,
    paddingLeft: 10,
    fontSize: 18,
    flex: 8,
  },
  addButton: {
    flex: 2,
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