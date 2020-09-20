import React, { Component } from 'react';
import { FlatList, TouchableOpacity, StyleSheet, Text, View , Image} from 'react-native';
import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { getContrastYIQ } from './HelperFunctions';

export default class GridColorPicker extends Component {
  state = {
    colors: this.props.colors,
    selectedColor: this.props.selectedColor,
    style: this.props.style,
    selectedBorderColor: this.props.selectedBorderColor,
    numColumns: this.props.numColumns
  };

  formatData = (data, numColumns) => {
    if (!data) data = [];
    const numberOfFullRows = Math.floor(data.length / numColumns);

    let numberOfElementsLastRow = data.length - (numberOfFullRows * numColumns);
    while (numberOfElementsLastRow !== numColumns && numberOfElementsLastRow !== 0) {
      data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
      numberOfElementsLastRow++;
    }
    return data;
  };

  renderItem = ({ item }) => {
    if (item.empty === true) {
      return <View style={[styles.item, styles.itemInvisible]} />;
    }
    else {
      if (item === "#ffffff00") {
        return (
          <TouchableOpacity
            style={[styles.circle, { backgroundColor: item }, this.state.style, { width: 100 }]}
            onPress={() => {
              this.setState({ selectedColor: item });
              this.props.onSelect(item);
            }}>
            <Text style={{ fontSize: 15 }}>Transparent</Text>
          </TouchableOpacity>
        )
      }
      if (item === "wheel") {
        return (
          <TouchableOpacity
            style={[styles.circle, this.state.style, {borderWidth: 0}]}
            onPress={this.props.openColorWheel}>
            <Image source={require('./wheel.png')} style={{width: 50, height: 50}}/>
        </TouchableOpacity>
        )
      }
      const fontColor = getContrastYIQ(item);
      return (
        <TouchableOpacity
          style={[styles.circle, { backgroundColor: item }, this.state.style]}
          onPress={() => {
            this.setState({ selectedColor: item });
            this.props.onSelect(item);
          }}>
          {this.state.selectedColor === item &&
            <Icon name="check" style={{ color: fontColor, fontSize: 24 }} />}
        </TouchableOpacity>
      );
    }
  }

  _keyExtractor = (item, index) => index;

  render() {
    return (
      <FlatList
        data={this.formatData(this.state.colors, this.state.numColumns)}
        extraData={this.state}
        renderItem={this.renderItem}
        numColumns={this.state.numColumns}
        keyExtractor={this._keyExtractor}
        keyboardShouldPersistTaps="always"
      />
    );
  }
}

const styles = StyleSheet.create({
  circle: {
    width: 50,
    height: 50,
    borderRadius: 50,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  item: {
    height: 50,
    width: 50
  },
  itemInvisible: {
    backgroundColor: 'transparent',
  },
});
