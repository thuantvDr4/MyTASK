import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Dimensions from 'Dimensions';
import { StyleSheet, 
	View, TextInput, Image, Text,
	Animated } from 'react-native';

export default class Input extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isFocus: false,
			isAnimated: false,
			isEmpty: '',
		};

		this.onFocus = this.onFocus.bind(this);
		this.onBlur = this.onBlur.bind(this);
		this.animated = new Animated.Value(0);
	}

	onFocus() {
		this.setState({ 
			isFocus: true,
			isAnimated: true
		}, () => {
			// do this wish u want
		});
	}

	onBlur() {
		this.setState({ 
			isFocus: false,
			isAnimated: false
		}, () => {
			// do this wish u want
		});

		this.CheckTextInputIsEmptyOrNot();
	}

	animate() {
		this.animated.setValue(0);
		Animated.timing(this.animated, {
			toValue: 1,
			duration: 400
		}).start();
	}

	animateRV() {
		this.animated.setValue(1);
		Animated.timing(this.animated, {
			toValue: 0,
			duration: 200
		}).start();
	}

	CheckTextInputIsEmptyOrNot = () => {
		const { isEmpty }  = this.state ;
		
		if ( isEmpty != '') {
			this.setState({ 
				isFocus: true,
			});
		}
	}

	render() {
		const opacity = this.animated.interpolate({
			inputRange: [0, 1],
			outputRange: [0, 1]
		});

		const translateY = this.animated.interpolate({
			inputRange: [0, 1],
			outputRange: [0, -20]
		});

		const transform = [{translateY}];

		// animation when focus
		if (this.state.isAnimated) {
			this.animate();
		} else {
			this.animateRV();
		}

		return (
			<View style={styles.inputWrapper}>
				<Animated.Text style={[styles.textAni, {backgroundColor: 'transparent'}, {transform, opacity}]}>
					{this.props.placeholder}
				</Animated.Text>
				<Image source={this.state.isFocus === false ? this.props.source : this.props.source_act } style={this.props.style === 'user' ? styles.inlineImgU : styles.inlineImgP } />
				<TextInput
					style={[styles.input, {}]}
					placeholder={this.state.isFocus === true ? '' : this.props.placeholder}
					secureTextEntry={this.props.secureTextEntry}
					autoCorrect={this.props.autoCorrect}
					autoCapitalize={this.props.autoCapitalize}
					returnKeyType={this.props.returnKeyType}
					placeholderTextColor= { this.state.isFocus === false ? '#B6C5DC' : '#0B76FF' }
					underlineColorAndroid="transparent"
					value={ this.props.value }
					editable={ this.props.edit }
					onFocus={ this.onFocus }
					onBlur={ this.onBlur } 
					onChangeText={ isEmpty => this.setState({isEmpty})}
				/>
			</View>
		);
  }
}

UserInput.propTypes = {
	source: PropTypes.number,
	source_act: PropTypes.number,
	placeholder: PropTypes.string,
	secureTextEntry: PropTypes.bool,
	autoCorrect: PropTypes.bool,
	autoCapitalize: PropTypes.string,
	returnKeyType: PropTypes.string,
	style: PropTypes.string,
	value: PropTypes.string,
	edit: PropTypes.bool,
};

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
	inputWrapper: {
		// flex: 1/2,
		// backgroundColor: 'red',
	},
	input: {
		width: DEVICE_WIDTH - 130,
		height: 40,
		// marginHorizontal: 20,
		marginBottom: 15,
		paddingLeft: 30,
		// borderRadius: 20,
		color: '#0B76FF',
		fontSize: 18,
		// backgroundColor: 'rgba(210, 255, 255, 1)',
	},
	inlineImgU: {
		position: 'absolute',
		zIndex: 99,
		width: 17, height: 17,
		left: 0, top: 10,
	},
	inlineImgP: {
		position: 'absolute',
		zIndex: 99,
		width: 16, height: 18,
		left: 0, top: 10,
	},
	textAni: {
		position: 'absolute',
		left:     30,
		top: 10,
		fontSize: 14,
		color: '#444444',
	}
});
