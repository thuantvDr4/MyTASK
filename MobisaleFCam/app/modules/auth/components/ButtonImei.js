import React, { Component } from 'react';
import Dimensions from 'Dimensions';
import { StyleSheet, TouchableOpacity, Text, View, } from 'react-native';
import { strings } from 'locales/i18n';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';

// CONST
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;
const MARGIN = 40;

export default class ButtonImei extends Component {
	constructor() {
		super();

		this.state = {
			isLoading: false,
		};

		this._onPress = this._onPress.bind(this);
	}

	_onPress() {
		NavigationService.navigate('Imei');
	}

	_onGrow() {

	}

	render() {
		
		return (
			
			<View style={styles.container}>
				<TouchableOpacity
					style={styles.button}
					onPress={ this._onPress  }
					activeOpacity={1}>
					<Text style={styles.text}>{strings('auth.login.imei_info')}</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'flex-start',
	},
	button: {
		width: DEVICE_WIDTH - 130,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		height: 48,
		borderRadius: 5,
		borderColor: '#0B76FF',
		borderWidth: 1,
		zIndex: 100,
	},
	text: {
		color: '#0B76FF',
		backgroundColor: 'transparent',
		fontSize: 20,
	}
});