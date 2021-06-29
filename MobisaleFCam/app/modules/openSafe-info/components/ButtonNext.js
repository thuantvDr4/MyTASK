import React, { Component } from 'react';
import {
	TouchableOpacity,
	Text,
	View,
} from 'react-native';

import PropTypes from 'prop-types';

// Gobal Style
var styleRe = require('../../../styles/Ola-style');

const ols = styleRe.default;

export default class ButtonNext extends Component {

	constructor() {
		super();

		this.state = {

		};
	}

	_onPress() {

	}

	_onGrow() {

	}

	render() {

		return (
			<View>
				<TouchableOpacity
					disabled={this.props.disabled}
					style={[ols.btnFull, ols.btnShadow]}
					onPress={this.props.onNextTab}
				>
					<Text style={ols.btnText}>{this.props.label}</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

ButtonNext.propTypes = {
	label: PropTypes.string,
};
