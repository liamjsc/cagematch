import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet, 
  TouchableHighlight,
  View,
} from 'react-native';

import { 
  Button,
  Icon,
  Input,
  Image,
  Text,
} from 'react-native-elements';
import { connect } from 'react-redux';
import { postImage } from '../actions/entries';

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
    console.log('saving image url');
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
              label="Image URL"
              ref={(el) => this.el = el}
              inputStyle={rowStyle.input}
              containerStyle={{
                backgroundColor: constants.cardGray,
                borderColor: constants.background,
                paddingLeft: 0,
                marginLeft: 0,
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

  updateImage = ({ entryId, image }) => {
    return this.props.dispatch(postImage({ entryId, image }));
  }

  render() {
    const {
      listMeta,
      entryById,
    } = this.props;

    return (
      <View style={styles.container}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
        >
          <Text style={{ padding: 10 }}>Add entries or edit images</Text>
          <View>
            {listMeta.entries.sort((a, b) => {
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
          <Padding/>
        </ScrollView>
        <Icon
          type="material"
          name="add"
          color={constants.lightPurple}
          reverse
          raised
          containerStyle={styles.positionAdd}
        />
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
