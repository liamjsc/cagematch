import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import { Input, Button } from 'react-native-elements';

import { connect } from 'react-redux';
import { createList as postList } from '../actions/list';

const TITLE = 'TITLE';
const DESCRIPTION = 'DESCRIPTION';
const ENTRIES = 'ENTRIES';

class CreateList extends Component {
  constructor(props) {
    super(props);
    this.pendingEntryEl = null;
  }

  state = {
    section: TITLE,
    title: '',
    description: '',
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

  getPromptText() {
    const { section } = this.state; // will be title, description, or entries
    if (section === TITLE) return 'Give your list a title';
    if (section === DESCRIPTION) return 'Add a description. What is the criteria?';
    if (section === ENTRIES) return 'Add entries to your list';
  }

  goToTitle = () => {
    this.setState({ section: TITLE });
  }

  goToDescription = () => {
    this.setState({ section: DESCRIPTION });
  }

  goToEntries = () => {
    this.setState({ section: ENTRIES });
  }

  pushEntry = () => {
    this.setState({
      entries: [...this.state.entries, this.state.pendingEntry],
      pendingEntry: '',
    });
    this.pendingEntryEl.focus();
  }

  render() {
    if (this.state.error) console.log(error);
    const { section, title, description, pendingEntry } = this.state; // will be title, description, or entries

    return (
      <View style={styles.createList}>
        <View style={styles.outline}>
          <View style={[styles.outlineBox, section === TITLE && styles.outlineActive]}>
            <TouchableOpacity style={styles.touch} onPress={this.goToTitle}>
              <Text style={styles.outlineText}>Title</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.outlineBox, section === DESCRIPTION && styles.outlineActive]}>
            <TouchableOpacity style={styles.touch} onPress={this.goToDescription}>
              <Text style={styles.outlineText}>Description</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.outlineBox, section === ENTRIES && styles.outlineActive]}>
            <TouchableOpacity style={styles.touch} onPress={this.goToEntries}>
              <Text style={styles.outlineText}>Entries</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.promptBox}>
          <Text style={styles.promptText}>
            {this.getPromptText()}
          </Text>
        </View>

        { section === TITLE && (
          <View style={styles.titleInputBox}>
            <Input
              label="Title"
              onChangeText={(text) => {
                this.setState({ title: text })
              }}
              value={title}      
            />
            <Button
              title="Continue"
              onPress={this.goToDescription}
              type="clear"
            />
          </View>
        )}

        { section === DESCRIPTION && (
          <View style={styles.titleInputBox}>
            <Input
              label="Description"
              onChangeText={(text) => {
                this.setState({ description: text })
              }}
              value={description}      
            />
            <Button
              title="Continue"
              onPress={this.goToEntries}
              type="clear"
            />
          </View>
        )}

        { section === ENTRIES && (
          <View style={styles.titleInputBox}>
            <Input
              key="Entries"
              label="Entries"
              onChangeText={(text) => {
                this.setState({ pendingEntry: text })
              }}
              onSubmitEditing={this.pushEntry}
              value={pendingEntry}  
              ref={(el) => this.pendingEntryEl = el}    
            />
            <Button
              title="Add to list"
              onPress={this.pushEntry}
              type="clear"
            />
            <Button
              title="Start ranking"
              onPress={this.saveList}
              type="clear"
            />
          </View>
        )}
        <Text>
          {JSON.stringify(this.state)}
        </Text>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  createList: {
    width: '100%',
    padding: 10,
    paddingTop: 30,
    height: '100%',
  },
  outline: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  outlineBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    borderColor: 'black',
    height: 40,
  },
  outlineActive: {
    backgroundColor: 'lightsteelblue',
  },
  outlineText: {
    fontSize: 18,
  },
  promptText: {
    fontSize: 26,
  },
  titleInputBox: {
    width: '100%',
  },
  touch: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
});

export default connect()(CreateList);