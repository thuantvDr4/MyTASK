/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { connect } from "react-redux";

const defaultProps = {
  route: false
};

class ButtonBack extends React.Component {
  constructor(props) {
    super(props);
    this._handlePress = this._handlePress.bind(this);
  }

  _handlePress() {
    this.props.navigation.goBack();
    if (this.props.route) {
      this.props.navigation.navigate(this.props.route);
    } else {
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View>
        <TouchableOpacity
          style={{ padding: 20, backgroundColor: "transparent" }}
          onPress={this._handlePress}
        >
          <Image
            style={{ width: 19, height: 16 }}
            source={require("../../assets/images/ic_24Back.png")}
          />
        </TouchableOpacity>
      </View>
    );
  }
}

ButtonBack.defaultProps = defaultProps;

export default connect()(ButtonBack);
