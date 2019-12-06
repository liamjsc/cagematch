import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, FlatList } from 'react-native';

class ListCard extends Component {
  render() {
    const { title } = this.props;
    return (
      <View style={styles.card}>
        <Text style={styles.title}>{title}</Text>
      </View>
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