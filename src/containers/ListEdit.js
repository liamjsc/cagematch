import React, { Component } from 'react';
import {
  ScrollView,
  StyleSheet, 
  TouchableHighlight,
  View,
} from 'react-native';

import { 
  Icon,
  Input,
  Image,
  Text,
} from 'react-native-elements';
import { connect } from 'react-redux';

import * as constants from '../util/constants';

import {
  Padding,
} from '../components';

class ListEditItem extends Component {
  render() {
    const {
      image,
      title,
      id,
    } = this.props;
    return (
      <TouchableHighlight
        onPress={() => {
          this.props.openEditImage(id);
        }}
        style={rowStyle.touchable}
      >
        <View 
          style={rowStyle.container}
        >
          {
            !image ? null : (<Image
              source={{ uri: image }}
              style={rowStyle.image}
            />)
          }
          <View style={rowStyle.textWrapper}>
            <Text style={rowStyle.text}>{title}</Text>
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
});

class ListEdit extends Component {
  static navigationOptions = {
    title: 'Edit List',
  };

  state = {
    editImageModal: false,
    editingId: '',
  }

  openEditImage = (entryId) => {
    this.setState({
      editImageModal: true,
      editingId: entryId,
    });
  }

  renderEditImage = (id) => {
    const {
      title,
      image,
    } = this.props.entryById[id];
    return (
      <View style={styles.modal}>
        <View style={styles.header}>
          <Text>{title}</Text>
        </View>
        <View style={styles.inputArea}>
          <Input
            placeholder="http://your.image.url"
            value={this.state.pendingImageUrl}
            onChangeText={(pendingImageUrl) => this.setState({ pendingImageUrl })}
          />
        </View>
      </View>
    )
  }

  render() {
    const {
      listMeta,
      entryById,
    } = this.props;

    const { editImageModal, editingId } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={{ padding: 10 }}>Add entries or edit images</Text>
          <View>
            {listMeta.entries.sort((a, b) => {
              return entryById[b].title.toLowerCase() < entryById[a].title.toLowerCase() ? 1 : -1;
            }).map(entryId => {
              return (
                <ListEditItem
                  key={entryId}
                  openEditImage={this.openEditImage}
                  {...entryById[entryId]}
                />
              )
            })}
          </View>
          <Padding/>
        </ScrollView>

        { !editImageModal ? null : (
          this.renderEditImage(editingId)
        )}

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
  modal: {
    position: 'absolute',
    top: 50,
    height: 200,
  }, 
  header: {
    alignItems: 'center',
    justifyContent: 'center',
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
