import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet, 
  TouchableHighlight,
  View,
} from 'react-native';

import { 
  Button,
  Card,
  Input,
  Image,
  Text,
} from 'react-native-elements';
import { connect } from 'react-redux';
import {
  postImage,
  postNewEntries,
} from '../actions/entries';

import * as constants from '../util/constants';

import {
  Padding,
} from '../components';

class ListEditItem extends Component {
  constructor(props) {
    super(props);
    this.el = null;
  }

  state = {
    pendingImageUrl: '',
    saving: false,
    saved: false,
  }

  focusInput = () => {
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

  render() {
    const {
      image,
      title,
    } = this.props;

    const { pendingImageUrl, saved } = this.state;
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
  textWrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 15,
  },
  text: {
    fontSize: 18,
    color: constants.textWhite
  },
  input: {
    fontSize: 10,
  }
});

class ListEdit extends Component {
  static navigationOptions = {
    title: 'Edit List',
  };

  state = {
    pendingTitle: '',
    pendingImage: '',
    newEntries: [] // array of { image, title, id }
  }

  updateImage = ({ entryId, image }) => {
    return this.props.dispatch(postImage({ entryId, image }));
  }

  saveNewEntry = () => {
    const { pendingTitle: title, pendingImage: image } = this.state;
    const { listId } = this.props;
    const newEntry = { title, image };
    this.props.dispatch(postNewEntries({ listId, entries: [newEntry] }))
      .then((newIds) => {
        this.setState({
          newEntries: [
            ...newIds,
            ...this.state.newEntries,
          ],
          pendingTitle: '',
          pendingImage: '',
        })
      });
  }

  clearNewEntry = () => {
    this.setState({ pendingImageUrl: '', pendingImage: '' });
  }

  render() {
    const {
      listMeta,
      entryById,
    } = this.props;

    const { pendingImage, pendingTitle, newEntries } = this.state;

    const isKeyboardActive = true;
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
          </Card>

          {!(newEntries && newEntries.length) ? null : (
            <Card title="Just Added">
              {newEntries.map(entryId => {
                return (
                  <ListEditItem
                    key={entryId}
                    postImage={this.updateImage}
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
                    {...entryById[entryId]}
                  />
                )
            })}
          </View>
          <Padding
            height={isKeyboardActive ? 300 : 30}
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
}, { navigation }) {
  const listId = navigation.getParam('listId');

  const listMeta = list.byId[listId];
  const entryById = entries.byId;
  return {
    listId,
    listMeta,
    entryById,
  };
}
export default connect(mstp)(ListEdit);
