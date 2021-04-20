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

/**
 * v2.4
 * Clone từ component InputO
 * // CHỨC NĂNG //
 * Tự động cắt ngắn option theo chiều dài của field - chiều dài của label
 */
export default class InputOAutoWidth extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isEmpty: '',
			isValid: true,
			widthLabel: 0,
			widthField: 0
		};
	}

    setValid(isValid) {
        this.setState({
            isValid: isValid
        })
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
		const { widthLabel, widthField } = this.state;
		const validStyle = createValidStyleSheet(this.state.isValid);
		return (
			<View style={[ols.field, validStyle.validStyleBorder]}  onLayout={e => this._getWidthField(e)}>
                <Text   onLayout={e => this._getWidthLabel(e)} style={[ols.plfake, ols.fs12, this.props.styleLabelArea ]}>{this.props.label}</Text>
				<TextInput
					{...this.props} 
					style={[this.props.style, {
						width: widthField - widthLabel - 16,
						alignSelf: "flex-end"
					  }]}
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

InputOAutoWidth.propTypes = {
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
