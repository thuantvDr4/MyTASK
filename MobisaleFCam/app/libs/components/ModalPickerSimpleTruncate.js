import React, { Component } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

// LIB COMPONENT CUSTOM
import { CustomPicker } from "react-native-custom-picker";

// HELPER
import createValidStyleSheet from "app-libs/helpers/ValidStyleSheet";

// Gobal Style
import { color, fontSize } from "../../styles/Ola-style";
var styleRe = require("../../styles/Ola-style");

// IMAGE
var souD = require("assets/images/tech-picker/down-arrow.png");
var souU = require("assets/images/tech-picker/up-arrow.png");

const ols = styleRe.default;

/**
 * TechPickup Component
 *
 * - Document Readmore here: https://www.npmjs.com/package/react-native-custom-picker
 * - Common Properties and Events:
 *
 * ############# Properties #############
 * 1. options: Array of options
 * 2. value: default value of TechPickup
 *
 * ############# Events #################
 * 1. onValueChange(value): Event when select change
 *
 * @author DaiDP
 * @since Jul, 2018
 * 
 * @mixes ThuanDD3
 * @desc Tự động cắt ngắn option theo chiều dài của field - chiều dài của label
 */

export default class ModalPicker extends Component {
	constructor(props) {
		super(props);

		this.state = {
			selectedItem: false,
			isSelected: false,
			isValid: true,
			widthLabel: 0,
			widthField: 0
		};
	}

	_slec() {
		this.setState({
			isSelected: true
		});
	}

	_unslec() {
		this.setState({
			isSelected: false
		});
	}

	setValid(isValid) {
		this.setState({
			isValid: isValid
		});
	}

	componentWillReceiveProps(nextProps) {
		let newState = {};

		if (nextProps.defaultValue != this.props.defaultValue) {
			newState.isValid = true;
		}

		this.setState(newState);
	}

	//get width label;
	_getWidthLabel = e => {
		const { width } = e.nativeEvent.layout;
		this.setState({
			widthLabel: width
		});
	};

	//get width toaàn bộ field;
	_getWidthField = e => {
		const { width } = e.nativeEvent.layout;
		this.setState({
			widthField: width
		});
	};

	render() {
		const validStyle = createValidStyleSheet(this.state.isValid);
		// console.log(this.state.selectedItem);
		
		return (
			<View
				style={[ols.field, validStyle.validStyleBorder]}
				ref="NationlyType"
				onLayout={e => this._getWidthField(e)}
			>
				<Text
					onLayout={e => this._getWidthLabel(e)}
					style={[ols.plfake, ols.fs12]}
				>
					{this.props.label}
				</Text>
				<CustomPicker
					{...this.props}
					fieldTemplate={this.renderField.bind(this)}
					optionTemplate={this.renderOption.bind(this)}
					headerTemplate={this.renderHeader.bind(this)}
					modalStyle={ols.dD_modal}
					backdropStyle={ols.dD_backDrop}
					modalAnimationType={"fade"}
					onFocus={this._slec.bind(this)}
					onBlur={this._unslec.bind(this)}
				/>
			</View>
		);
	}

	renderField(settings) {
		const { widthLabel, widthField } = this.state;
		const { selectedItem, defaultText, getLabel } = settings;
		const validStyle = createValidStyleSheet(this.state.isValid);

		return (
			<View
				style={[ols.dD_container,
					{
						width: widthField - widthLabel - 15,
						alignSelf: "flex-end"
					}
				]}
			>
				<Text
					style={[ols.dD_text, ols.txtR, ols.fw500, ols.cl444, validStyle.validStyleText]}
					ellipsizeMode={"tail"}
					numberOfLines={1}
				>
					{!selectedItem ? defaultText : getLabel(selectedItem)}
				</Text>
				<Image
					style={[ols.dD_ico, { tintColor: "#8a919a" }]}
					source={!this.state.isSelected ? souD : souU}
				/>
			</View>
		);
	}

	renderHeader() {
		if (!this.props.headerTitle) {
			return;
		}

		return (
			<View style={ols.dD_headerContainer}>
				<Text style={ols.dD_headerText}>{this.props.headerTitle}</Text>
				<Image
					resizeMode="cover"
					style={[ols.dD_exitHeaderSelect, { height: 12, width: 12 }]}
					source={require("../../assets/images/list-customer-info/ic_16Close.png")}
				/>
			</View>
		);
	}

	renderOption(settings) {
		const { item, getLabel } = settings;

		return (
			<View style={ols.dD_optionContainer}>
				<Text style={ols.dD_optionText}>{getLabel(item)}</Text>
			</View>
		);
	}
}
