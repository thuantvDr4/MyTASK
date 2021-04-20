import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import {StyleSheet, View, TextInput, Image, Animated, Easing, Text} from 'react-native';

class UserInput extends Component {
		
		constructor(props)
		{
			super(props);

			this.state = {
					isFocus: false,
					labelTop: new Animated.Value(props.value ? -10 : 8),
					labelSize: new Animated.Value(props.value ? 14 : 18),
					labelColor: new Animated.Value(props.value ? 1: 0),
					value: props.value
			};

			this._focus = this._focus.bind(this);
			this._blur  = this._blur.bind(this);
		}

		_focus()
		{
				if (this.state.isFocus) return;
				
				this.setState({isFocus: true});

				if (this.props.value) return;

				Animated.parallel([

					Animated.timing(this.state.labelTop, {
							toValue: -10,
							duration: 200,
					}),

					Animated.timing(this.state.labelSize, {
							toValue: 14,
							duration: 200,
					}),

					Animated.timing(this.state.labelColor, {
						toValue: 1,
						duration: 200,
					}),

				]).start();
		}

		_blur()
		{
			if (! this.state.isFocus) return;

			this.setState({isFocus: false});

			if (this.props.value) return;

			Animated.parallel([

				Animated.timing(this.state.labelTop, {
						toValue: 8,
						duration: 200,
				}),

				Animated.timing(this.state.labelSize, {
						toValue: 18,
						duration: 200,
				}),

				Animated.timing(this.state.labelColor, {
					toValue: 0,
					duration: 200,
				}),

			]).start();
		}

	render() {
		const { labelTop, labelSize } = this.state;
		const active = this.state.isFocus ? {img: {tintColor: '#0b76ff'}, text:{color: '#0b76ff'}}  : {img: {}, text: {color: '#444'}};
		const labelColor = this.state.labelColor.interpolate({
			inputRange: [0, 1],
			// outputRange: ['#C2D0E2', '#444444']
			outputRange: ['#C2D0E2', '#C2D0E2']
		});
	
		return (
			<View style={styles.inputWrapper}>
				<Image source={this.props.source} style={[styles.inlineImg, active.img]} />
				<View>
						<TextInput
							style={[styles.input, active.text]}
							secureTextEntry={this.props.secureTextEntry}
							autoCorrect={this.props.autoCorrect}
							autoCapitalize={this.props.autoCapitalize}
							returnKeyType={this.props.returnKeyType}
							placeholderTextColor="#C2D0E2"
							underlineColorAndroid="transparent"
							onFocus={this._focus}
							onBlur={this._blur}
							onChangeText={ this.props.onChangeText }
							value={this.props.value}
							// contextMenuHidden={true}
							// selectTextOnFocus={false}
						/>
						<Animated.Text style={{ position:"absolute", fontSize:labelSize,top: labelTop, left: 65,zIndex:-1,color:labelColor}}>{this.props.placeholder}</Animated.Text>
				</View>
			</View>
		);
	}
}

UserInput.propTypes = {
	source: PropTypes.number.isRequired,
	placeholder: PropTypes.string.isRequired,
	secureTextEntry: PropTypes.bool,
	autoCorrect: PropTypes.bool,
	autoCapitalize: PropTypes.string,
	returnKeyType: PropTypes.string,
};

UserInput.defaultProps = {
	value: null
}

export default UserInput;

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
	input: {
		//backgroundColor: 'rgba(255, 255, 255, 0.4)',
		width: DEVICE_WIDTH - 98,
		height: 43,
		minHeight: 43,
		marginHorizontal: 20,
		paddingLeft: 45,
		borderRadius: 20,
		fontSize: 18,
		//color: '#ffffff',
	},
	inputWrapper: {
		flex: 1,
		minHeight: 50,
	},
	inlineImg: {
		position: 'absolute',
		zIndex: 99,
		width: 16,
		height: 16,
		left: 35,
		top: 12
	},
});