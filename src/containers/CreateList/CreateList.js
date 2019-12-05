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
      <View style={{width: '100%', backgroundColor: 'lightgreen', color: 'black' }}>
        <TextInput
          style={{ height: 40 }}
          placeholder="Title"
          onChangeText={(text) => this.setState({ title: text })}
          value={this.state.title}
        />
        <TextInput
          style={{height: 30 }}
        />
        {/* <FlatList
          data={this.state.entries}
          keyExtractor={(e) => `${e.index}-${e.title}`}
          renderItem={(item, index) => {
            return (
              <View>
                <TextInput
                  style={{ height: 40 }}
                  placeholder="entry..."
                  onChangeText={this.editEntry.bind(index, this)}
                  value={item.title}
                />
              </View>
            )
          }}
        /> */}
        <Button
          onPress={this.onClickCreateList}
          title="Create List"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    width: '100%',
    backgroundColor: 'lightslategray',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect()(CreateList);