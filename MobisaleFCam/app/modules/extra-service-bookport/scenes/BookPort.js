// LIB
import React, { Component } from 'react';
import {
	Alert, View,
} from 'react-native';

// LANGUAGE
import {strings} from 'locales/i18n';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import TechLoading from 'app-libs/components/TechLoading';
import ButtonBack from '../../../libs/components/ButtonBack.js';
// import {HeaderBackButton} from 'react-navigation';
import HeaderBackButtonBookport from '../components/HeaderBackButtonBookport';
import HandleBackButtonHardware from '../components/HandleBackButtonHardware';

// REDUX
import {connect} from "react-redux";

// ACTION
import {actions} from '../';
const { resetDataBookport } = actions;

// COMPONENT
import BookPortTop from "../components/BookPortTop";
import BookPortMap from "../components/BookPortMap";
import BookPortAction from "../components/BookPortAction";

// STYLE
import styles from '../BookPort.styles';


class Bookport extends React.Component {

	static navigationOptions = ({ navigation }) => {
		return {
			title: strings('sale_new.bookport_map.title'),
			headerLeft: <HeaderBackButtonBookport navigation={navigation} />
		};
	};

	constructor(props) {

		super(props);

		/*
		State cuc bo
		 */
		this.state = {
			loadingVisible: false,
		};

		this.onBack = this.onBack.bind(this);
	}

	componentWillUnmount() {

		// 
		const { resetDataBookport } = this.props;

		// Clear obj bookport
		resetDataBookport();
	}

	/**
	 * Xử lý back
	 * Note: Dùng cho khi bookport mới hoặc cập nhật port từ màn hình Detail Cus
	 */
	onBack() {
		const { navigation } = this.props;

		// Get Param từ màn hình detail customer
		const extraServiceEditPort = navigation.getParam('extraServiceEditPort', false);
		
		Alert.alert(
			strings('sale_new.dialog.title'),
			strings('dl.sale_new.goBack'),
			[
				{ text: strings('dialog.btnCancel'), onPress: () => {}, style: "cancel" },
				{ text: strings('dialog.btnOK'), onPress: () => {
					// extraServiceEditPort 
					// 	?
					// 		// Quay về màn hình Detail Customer
					// 		NavigationService.navigate('extraServiceEditPort', {
					// 			RegID : this.props.RegistrationObj.RegId, 
					// 			RegCode : this.props.RegistrationObj.RegCode
					// 		})
					// 		// Quay về bình thường
					// 	: this.props.navigation.goBack() 

						NavigationService.navigateGoBack();
					} 
				},
			],
			{ cancelable: false },
		);
		return true;
	};

	render() {

		return (
			<HandleBackButtonHardware onBack={this.onBack}>
				<View style={styles.container}>
					<BookPortTop/>

					<View style={styles.mainContainer}>
						<BookPortMap navigation={this.props.navigation}/>
						<BookPortAction navigation={this.props.navigation}/>
					</View>
				</View>
			</HandleBackButtonHardware>
		);
	}
}

export default connect((state) => {
	
	const extraServiceState = state.extraServiceInfoReducer;

	return {
		RegistrationObj: state.extraServiceState && state.extraServiceState.formData
	}
}, {resetDataBookport})(Bookport);

