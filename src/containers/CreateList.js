import React, { Component } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { 
  Button,
  Input,
  ListItem,
  Text,
 } from 'react-native-elements';

import { connect } from 'react-redux';
import { createList as postList } from '../actions/list';
import * as constants from '../util/constants';
import { Padding } from '../components';

const TITLE = 'TITLE';
const DESCRIPTION = 'DESCRIPTION';
const ENTRIES = 'ENTRIES';

const initialState = {
  section: TITLE,
  title: '',
  description: '',
  entries: [],
  pendingEntry: '',
  posting: false,
  posted: false,
  error: null,
}

function ListIsPosting({ title }) {
  return (
    <View style={styles.posting}>
      <Text h3>{title}</Text>
      <Text>Setting up your list for rankings, this might take a moment.</Text>
      <ActivityIndicator
        style={{ paddingTop: 25 }}
        size="large"
      />
    </View>
  )
}

class CreateList extends Component {
  static navigationOptions = {
    title: 'Create List',
  }

  constructor(props) {
    super(props);
    this.pendingEntryEl = null;
  }

  state = initialState;

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
      .then((newListData) => {

        console.log('newList');
        console.log(newListData);
        const cage = { listId: newListData.list.id, title };
        console.log(cage)
        this.setState(initialState)
        this.goToCage(cage);
      })
      .catch((error) => {
        console.log('error post list');
        console.log(error);
        this.setState({ posting: false, posted: false, error })
      })
  }

  goToCage = ({ listId, title }) => {
    this.props.navigation.navigate('Cage', {
      listId,
      title,
    });
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
    if (section === TITLE) return 'Give your new list a title';
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
    // validate entry
    const { pendingEntry } = this.state;
    const toInsert = pendingEntry.trim();
    if (!toInsert.length) return false;
    if (this.state.entries.some(currentEntry => currentEntry === toInsert)) return false;

    this.setState({
      entries: [...this.state.entries, toInsert],
      pendingEntry: '',
    });
    this.pendingEntryEl.focus();
  }

  render() {
    if (this.state.error) console.log(this.state.error);
    const {
      section,
      title,
      description,
      pendingEntry,
      posting,
      entries,
    } = this.state; // will be title, description, or entries

    if (posting) {
      return <ListIsPosting/>
    }

    return (
      <View style={styles.outer}>
        <ScrollView style={styles.createList}>
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

          {
            (section !== TITLE && title) ? (
              <Text h3>{title}</Text>
            ) : null
          }

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
                containerStyle={styles.button}
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
                containerStyle={styles.button}
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
                label="Entry"
                onChangeText={(text) => {
                  this.setState({ pendingEntry: text })
                }}
                onSubmitEditing={this.pushEntry}
                value={pendingEntry}  
                ref={(el) => this.pendingEntryEl = el}    
              />
              <Button
                containerStyle={styles.button}
                title="Add to list"
                onPress={this.pushEntry}
                type="clear"
              />
            </View>
          )}
          { section === ENTRIES && (
            <View style={styles.entriesArea}>
              {
                entries && entries.length ? (
                  <View style={styles.entriesList}>
                    {
                      entries.map((entryTitle, i) => {
                        return (<ListItem
                          key={i+1}
                          title={entryTitle}
                          bottomDivider
                          containerStyle={styles.entry}
                          titleStyle={styles.entryTitle}
                        />);
                      })
                    }
                  </View>
                ) : null
              }
              <View style={styles.submitArea}>
                { (entries && entries.length < 3) ? (
                  <Text>Add at least 3 items</Text>
                ) : null}
                <Button
                  containerStyle={{
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                  title="Save & start ranking"
                  onPress={this.onClickCreateList}
                  disabled={entries.length < 3}
                  type="solid"
                />
              </View>
            </View>
          )}
          <Padding/>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outer: {
    height: '100%',
    backgroundColor: constants.background,
  },
  createList: {
    width: '100%',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 30,
    // borderWidth: 1,
    // borderColor: 'orange',
  },
  outline: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  outlineBox: {
    alignItems: 'center',
    justifyContent: 'center',
    // borderWidth: 1,
    // borderColor: 'black',
    height: 40,
    width: '31%',
  },
  outlineActive: {
    borderBottomColor: constants.lightPurple,
    borderColor: constants.background,
    borderWidth: 1,
    // color: constants.lightPurple,
  },
  outlineText: {
    fontSize: 16,
  },
  promptBox: {
    paddingTop: 25,
  },
  promptText: {
    fontSize: 26,
  },
  titleInputBox: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    marginTop: 10,
    marginBottom: 10,
    width: '80%',
  },
  entry: {
    backgroundColor: constants.cardGray,
  },
  entryTitle: {
    color: constants.textWhite,
  },
  touch: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  entriesList: {
    // borderWidth: 1,
    // borderColor: 'orange',
  },
  submitArea: {
    paddingTop: 20,
  },
  posting: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default connect()(CreateList);