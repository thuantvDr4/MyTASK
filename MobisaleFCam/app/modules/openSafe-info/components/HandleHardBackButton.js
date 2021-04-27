// LIB
import React, { Component } from 'react';
import { withNavigation } from 'react-navigation';
import { BackHandler } from 'react-native';

class HandleHardBackButton extends Component {
	
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
	}

	componentWillUnmount() {
		BackHandler.removeEventListener('hardwareBackPress', this.handleBackPress);
	}

	handleBackPress = () => {
		this.goBack();
		return true;
	}

	goBack() {
		this.props.onBack();
	}


	render() {
		return this.props.children;
	}
}

export default withNavigation(HandleHardBackButton);