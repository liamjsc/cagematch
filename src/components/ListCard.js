import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  TouchableHighlight,
} from 'react-native';

class ListCard extends Component {
  handlePress = () => {
    const { goToCage, id: listId } = this.props;
    console.log('go to cage', listId);
    goToCage(listId);
  }

  render() {
    const { title } = this.props;
    return (
      <TouchableHighlight style={styles.card} onPress={this.handlePress} underlayColor="white">
        <Text style={styles.title}>{title}</Text>
      </TouchableHighlight>
    )
  }
}
const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '100%',
    backgroundColor: 'lightgray',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: '100%',
    marginBottom: 5,
    marginTop: 5,
  },
  title: {
    fontSize: 24,
  }
});

export default ListCard;