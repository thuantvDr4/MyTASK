import React, { Component } from 'react';
import {TouchableOpacity, Text, View} from 'react-native';

import PropTypes from 'prop-types';

// Gobal Style
import ols from '../../../styles/Ola-style';

export default class ButtonNextTwo extends Component
{
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
			<View style={[ols.posAB, { left: 0, bottom: 16, right: 0}]}>
                <TouchableOpacity
                    style={ ols.btnFull }
                    onPress={this.props.onNextTab}
                >
                    <Text style={ ols.btnText }>{this.props.label}</Text>
                </TouchableOpacity>
			</View>
		);
	}
}

ButtonNextTwo.propTypes = {
	label: PropTypes.string,
};