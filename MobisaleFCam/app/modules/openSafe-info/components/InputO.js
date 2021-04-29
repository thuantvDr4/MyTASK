import React, { Component } from "react";
import PropTypes from "prop-types";
import Dimensions from "Dimensions";
import {
	StyleSheet, View, TextInput, Image, Text, Animated, Keyboard
} from "react-native";

// HELPER
import createValidStyleSheet from "app-libs/helpers/ValidStyleSheet";

// Gobal Style
import { color, fontSize } from "../../../styles/Theme";
import styles from "../styles";
var reStyle = require("../../../styles/Ola-style");
const ols = reStyle.default;

export default class InputO extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isEmpty: "",
			isValid: true
		};
	}

	setValid (isValid) {
		this.setState({
			isValid: isValid
		});
	}


	render() {
		const validStyle = createValidStyleSheet(this.state.isValid);
		return (
			<View style={[styles.field, validStyle.validStyleBorder]}
			>
				<Text style={[styles.plfake, ols.fs12]}>{this.props.label}</Text>
				<TextInput
					{...this.props}
					style={[this.props.style, validStyle.validStyleText, {}]}
					placeholder={this.props.placeholder}
					placeholderTextColor={
						this.state.isValid ? this.props.placeholderTextColor : "#ff5050"
					}
					textAlign={this.props.textAlign}
					secureTextEntry={this.props.secureTextEntry}
					autoCorrect={this.props.autoCorrect}
					autoCapitalize={this.props.autoCapitalize}
					returnKeyType={this.props.returnKeyType}
					underlineColorAndroid={"transparent"}
					keyboardType={this.props.keyboardType}
					value={this.props.value}
					onChangeText={this.props.onChangeText}
					onBlur={ this.props.onBlur ? this.props.onBlur : () => {} }
				/>
			</View>
		);
	}
}

InputO.propTypes = {
	style: PropTypes.array,
	source: PropTypes.number,
	placeholder: PropTypes.string,
	placeholderTextColor: PropTypes.string,
	secureTextEntry: PropTypes.bool,
	autoCorrect: PropTypes.bool,
	autoCapitalize: PropTypes.string,
	returnKeyType: PropTypes.string,
	value: PropTypes.string
};

const DEVICE_WIDTH = Dimensions.get("window").width;
const DEVICE_HEIGHT = Dimensions.get("window").height;
