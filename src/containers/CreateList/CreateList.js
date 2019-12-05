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
import { createList } from '../../actions/list';

class CreateList extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    title: '',
    entries: [],
    posting: false,
    posted: false,
    error: {},
  }

  onClickCreateList = (e) => {
    const { title, entries } = this.state;

    const list = {
      title,
      entries,
    }
    console.log('onClickCreateList', list);
    this.setState({ posting: true });
    return this.props.dispatch(createList(list))
      .then(() => this.setState({ posted: true, posting: false }))
      .catch((error) => this.setState({ posting: false, posted: false, error }))
  }

  editEntry = (text, index) => {
    console.log('onEditEntry', text, index);
    this.setState({
      entries: this.entries.map((entry, entryIndex) => {
        if (entryIndex === index) return entry;
        return { title: text }
      })
    })
  }

  render() {
    console.log(this.state);
    return (
      <View style={styles.createList}>
        <TextInput
          style={styles.title}
          placeholder="Title"
          onChangeText={(text) => this.setState({ title: text })}
          value={this.state.title}
        />
        <TextInput
          style={styles.inputRow}
        />
        <Button
          onPress={this.onClickCreateList}
          title="Create List"
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
  },
  title: {
    height: 40,
    width: '100%',
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  inputRow: {
    height: 40,
    borderWidth: 1,
    borderColor: 'white',
  }
});

export default connect()(CreateList);