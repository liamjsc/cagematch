import React, { Component } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet, 
  TouchableHighlight,
  View,
} from 'react-native';

import { 
  Button,
  Card,
  Icon,
  Input,
  Image,
  Text,
} from 'react-native-elements';
import { connect } from 'react-redux';
import {
  postImage,
  postNewEntries,
  deleteEntry,
} from '../actions/entries';

import * as constants from '../util/constants';

import {
  Padding,
} from '../components';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

class ListEditItem extends Component {
  constructor(props) {
    super(props);
    this.el = null;
  }

  state = {
    pendingImageUrl: '',
    saving: false,
    saved: false,
    showDeletePrompt: false,
  }

  focusInput = () => {
    this.setState({ showDeletePrompt: false });
    this.el.focus();
  }

  saveImageUrl = () => {
    const { id: entryId } = this.props;
    const { pendingImageUrl } = this.state;
    this.setState({ saving: true, saved: false });
    return this.props.postImage({ entryId, image: pendingImageUrl })
      .then(() => {
        this.setState({ saved: true, saving: false, });
      })
  }

  showDeletePrompt = () => {
    this.setState({ showDeletePrompt: true })
    console.log('show delete prompt');
  }

  hideDeletePrompt = () => {
    this.setState({ showDeletePrompt: false })
  }

  deleteEntry = () => {
    this.props.deleteEntry(this.props.id);
  }

  render() {
    const {
      image,
      title,
      deleteInProgress,
      listCreator,
      userId,
      user_id: entryCreator,
    } = this.props;

    console.log(this.props);
    console.log('listCreator', listCreator, typeof listCreator);
    console.log('userId', userId, typeof userId);
    console.log('entryCreator', entryCreator, typeof entryCreator);
    const { pendingImageUrl, saved, showDeletePrompt } = this.state;
    const showDeleteIcon = parseInt(listCreator) === parseInt(userId) || parseInt(entryCreator) === parseInt(userId);

    return (
      <TouchableHighlight
        onPress={() => this.focusInput()}
        style={rowStyle.touchable}
      >
        <View 
          style={rowStyle.container}
        >
          {
            !(pendingImageUrl || image) ? null : (<Image
              source={{ uri: pendingImageUrl || image }}
              style={rowStyle.image}
            />)
          }
          {!showDeletePrompt ? null : (
            <View style={rowStyle.deletePrompt}>
              <Text>Delete {title}?</Text>
              {
                !deleteInProgress ? (
                  <View style={{flexDirection: 'row', marginTop: 10}}>
                    <Button
                      title="Delete"
                      onPress={this.deleteEntry}
                      titleStyle={{ color: constants.textWhite }}
                      buttonStyle={{
                        backgroundColor: constants.red,
                      }}
                      containerStyle={{
                        flex: 1,
                      }}
                      raised={false}
                    />
                    <Button
                      title="Cancel"
                      onPress={this.hideDeletePrompt}
                      titleStyle={{ color: constants.textWhite }}
                      buttonStyle={{
                        backgroundColor: constants.cardGray,
                      }}
                      containerStyle={{
                        borderColor: constants.raisinBlack,
                        flex: 1,
                      }}
                      raised={false}
                    />
                  </View>
                ) : (
                  <ActivityIndicator size="small" color={constants.lightPurple}/>
                )
              }
            </View>
          )}
          {showDeletePrompt ? null : (
            <View style={rowStyle.contentWrapper}>
              <View style={rowStyle.x}>
                {!showDeleteIcon ? null : (
                  <Icon
                    name="trash-can-outline"
                    type="material-community"
                    color={constants.white}
                    onPress={this.showDeletePrompt}
                    underlayColor={constants.lightPurple}
                    containerStyle={{
                      margin: 7,
                    }}
                  />
                )}
              </View>
              <View style={rowStyle.textWrapper}>
                <Text style={rowStyle.text}>{title}</Text>
                <Input
                  label="image url:"
                  ref={(el) => this.el = el}
                  inputStyle={rowStyle.input}
                  containerStyle={{
                    backgroundColor: constants.cardGray,
                    borderColor: constants.cardGray,
                    borderBottomColor: constants.lightPurple,
                    borderWidth: 1,
                    paddingLeft: 0,
                    marginLeft: 0,
                  }}
                  labelStyle={{
                    fontSize: 10,
                  }}
                  placeholder={image}
                  value={pendingImageUrl}
                  onChangeText={(val) => this.setState({ pendingImageUrl: val })}
                />
                { !saved ? null : <Text style={{color: 'green'}}>Success!</Text>}
                { saved || !pendingImageUrl ? null : (
                  <View style={{flexDirection: 'row'}}>
                    <Button
                      title="Save"
                      onPress={this.saveImageUrl}
                      titleStyle={{ color: constants.lightPurple }}
                      buttonStyle={{
                        backgroundColor: constants.cardGray,
                      }}
                      containerStyle={{
                        flex: 1,
                      }}
                      raised={false}
                    />
                    <Button
                      title="Reset"
                      onPress={() => this.setState({ pendingImageUrl: '' })}
                      titleStyle={{ color: constants.red }}
                      buttonStyle={{
                        backgroundColor: constants.cardGray,
                      }}
                      containerStyle={{
                        flex: 1,
                      }}
                      raised={false}
                    />
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </TouchableHighlight>
    )
  }
}
const rowStyle = StyleSheet.create({
  touchable: {
    marginTop: 5,
    marginBottom: 5,
    // backgroundColor: constants.background,
  },
  deletePrompt: {
    paddingLeft: 15,
    flexGrow: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flexDirection: 'row',
    backgroundColor: constants.cardGray,
    height: 160,
    paddingRight: 10,
    paddingLeft: 10,
  },
  image: {
    flex: 1,
    aspectRatio: 182 / 268,
  },
  contentWrapper: {
    flex: 1,
    paddingLeft: 15,
  },
  x: {
    flexDirection: 'row-reverse',
    flex: 15,
  },
  textWrapper: {
    flex: 40,
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: constants.textWhite
  },
  input: {
    fontSize: 12,
  }
});

class ListEdit extends Component {
  static navigationOptions = {
    title: 'Edit List',
  };

  state = {
    saving: false,
    pendingTitle: '',
    pendingImage: '',
    newEntries: [], // array of { image, title, id }
    deleting: '',
  }

  updateImage = ({ entryId, image }) => {
    return this.props.dispatch(postImage({ entryId, image }));
  }

  saveNewEntry = () => {
    const { pendingTitle: rawTitle = '', pendingImage: rawImage = '', newEntries } = this.state;
    const { listId } = this.props;

    const title = rawTitle.trim();
    const image = rawImage.trim();
    const newEntry = { title, image };

    if (!title.length) return false;
    if (newEntries.some(existingEntry => existingEntry.toLowerCase() === title.toLowerCase())) return false;

    this.setState({ saving: true });
    this.props.dispatch(postNewEntries({ listId, entries: [newEntry] }))
      .then((newIds) => {
        this.setState({
          newEntries: [
            ...newIds,
            ...this.state.newEntries,
          ],
          pendingTitle: '',
          pendingImage: '',
          saving: false,
        })
      })
      .catch(e => {
        console.log(e);
        this.setState({ saving: false });
      })
  }

  deleteEntry = (entryId) => {
    const { listId } = this.props;
    console.log('setting state', entryId);
    this.setState({ deleting: entryId });
    return this.props.dispatch(deleteEntry({ entryId, listId }))
      .then(() => {
        this.setState({ deleting: '' });
      })
      .catch(() => {
        this.setState({ deleting: '' });
      });
  }

  clearNewEntry = () => {
    this.setState({ pendingImageUrl: '', pendingImage: '' });
  }

  render() {
    const {
      listMeta,
      entryById,
      userId,
      listId,
    } = this.props;

    const { pendingImage, pendingTitle, newEntries, saving } = this.state;

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <Card title="Add Entries" 
            containerStyle={{
              height: 275,
            }}
          >
            <View style={{ flexDirection: 'row' }}>
              {
                !(pendingImage) ? null : (<Image
                  source={{ uri: pendingImage }}
                  style={rowStyle.image}
                />)
              }
              <View style={{ flex: 1 }}>
                <Input
                  label="title"
                  // ref={(el) => this.el = el}
                  inputStyle={rowStyle.input}
                  containerStyle={{
                    backgroundColor: constants.cardGray,
                    borderColor: constants.cardGray,
                    borderBottomColor: constants.lightPurple,
                    borderWidth: 1,
                    paddingLeft: 0,
                    marginLeft: 0,
                  }}
                  labelStyle={{
                    fontSize: 10,
                  }}
                  placeholder="new title"
                  value={pendingTitle}
                  onChangeText={(val) => this.setState({ pendingTitle: val })}
                />
                <Input
                  label="image url"
                  ref={(el) => this.el = el}
                  inputStyle={rowStyle.input}
                  containerStyle={{
                    backgroundColor: constants.cardGray,
                    borderColor: constants.cardGray,
                    borderBottomColor: constants.lightPurple,
                    borderWidth: 1,
                    paddingLeft: 0,
                    marginLeft: 0,
                  }}
                  labelStyle={{
                    fontSize: 10,
                  }}
                  placeholder="new image"
                  value={pendingImage}
                  onChangeText={(val) => this.setState({ pendingImage: val })}
                />
              </View>
            </View>
            {
              saving ? (
                <ActivityIndicator size="large" style={{ paddingTop: 5 }}/>
              ) : (
                <View style={{flexDirection: 'row' }}>
                  <Button
                    title="Save"
                    onPress={this.saveNewEntry}
                    titleStyle={{ color: constants.lightPurple }}
                    buttonStyle={{
                      backgroundColor: constants.cardGray,
                    }}
                    containerStyle={{
                      flex: 1,
                    }}
                    raised={false}
                  />
                  <Button
                    title="Reset"
                    onPress={this.clearNewEntry}
                    titleStyle={{ color: constants.red }}
                    buttonStyle={{
                      backgroundColor: constants.cardGray,
                    }}
                    containerStyle={{
                      flex: 1,
                    }}
                    raised={false}
                  />
                </View>
              )
            }
          </Card>

          {!(newEntries && newEntries.length) ? null : (
            <Card title="Just Added">
              {newEntries.map(entryId => {
                return (
                  <ListEditItem
                    key={entryId}
                    postImage={this.updateImage}
                    deleteEntry={this.deleteEntry}
                    deleteInProgress={entryId === this.state.deleting}
                    listCreator={listMeta.user_id}
                    userId={userId}
                    {...entryById[entryId]}
                  />
                )
              })}
            </Card>
          )}

          <Text style={{ padding: 20 }}>Tap an entry to edit images</Text>

          <View>
            {listMeta.entries
              .filter(id => this.state.newEntries.indexOf(id) < 0)
              .sort((a, b) => {
                return entryById[b].title.toLowerCase() < entryById[a].title.toLowerCase() ? 1 : -1;
              }).map(entryId => {
                return (
                  <ListEditItem
                    key={entryId}
                    postImage={this.updateImage}
                    deleteEntry={this.deleteEntry}
                    deleteInProgress={entryId === this.state.deleting}
                    listCreator={listMeta.user_id}
                    userId={userId}
                    {...entryById[entryId]}
                  />
                )
            })}
          </View>
          <Padding
            height={300}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: constants.background,
    width: '100%',
  },
  positionAdd: {
    position: 'absolute',
    bottom: 20,
    right: 20,
  },
  inputArea: {

  },
});

function mstp({
  list,
  entries,
  auth: { user: { id: userId } },
}, { navigation }) {
  const listId = navigation.getParam('listId');

  const listMeta = list.byId[listId];
  const entryById = entries.byId;
  return {
    listId,
    listMeta,
    entryById,
    userId,
  };
}
export default connect(mstp)(ListEdit);
