import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import { StyleSheet, 
	View, TextInput, Image, Text,
	Animated } from 'react-native';

// HELPER
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

// Gobal Style
var reStyle = require('../../../styles/Ola-style');
const ols = reStyle.default;

export default class InputO extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isEmpty: '',
			isValid: true
		};
	}

    setValid(isValid) {
        this.setState({
            isValid: isValid
        })
    }

	render() {
		const validStyle = createValidStyleSheet(this.state.isValid);

		return (
			<View style={[ols.field, validStyle.validStyleBorder]} >
                <Text style={[ols.plfake, ols.fs12, this.props.styleLabelArea ]}>{this.props.label}</Text>
				<TextInput
					{...this.props} 
					style={[this.props.style, {}]}
					placeholder={this.props.placeholder}
					placeholderTextColor= { this.state.isValid ? this.props.placeholderTextColor : '#ff5050' }
					secureTextEntry={this.props.secureTextEntry}
					textAlign={this.props.textAlign}
					autoCorrect={this.props.autoCorrect}
					autoCapitalize={this.props.autoCapitalize}
					returnKeyType={this.props.returnKeyType}
					underlineColorAndroid="transparent"
					keyboardType={this.props.keyboardType}
					multiline={this.props.multiline}
					numberOfLines={this.props.numberOfLines}
					value={ this.props.value }
					onChangeText={ this.props.onChangeText }
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
	value: PropTypes.string,
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;