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
const {generationAddress} = actions;

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
			addressCustomer : null,
			allowBookport : true,
		};

		this.onBack = this.onBack.bind(this);
	}

	/**
	 * Xử lý back
	 * Note: Dùng cho khi bookport mới hoặc cập nhật port từ màn hình Detail Cus
	 */
	onBack() {
		const { navigation } = this.props;

		// Get Param từ màn hình detail customer
		const lciDetailCustomer = navigation.getParam('lciDetailCustomer', false);

		Alert.alert(
			strings('sale_new.dialog.title'),
			strings('dl.sale_new.goBack'),
			[
				{ text: strings('dialog.btnCancel'), onPress: () => {}, style: "cancel" },
				{ text: strings('dialog.btnOK'), onPress: () => {
					lciDetailCustomer
						?
							// Quay về màn hình Detail Customer
							NavigationService.navigate('lciDetailCustomer', {
								RegID : this.props.RegistrationObj.RegId,
								RegCode : this.props.RegistrationObj.RegCode
							})
							// Quay về bình thường
							//V2.10-26/06/2021-thuantv
						:  NavigationService.navigate('BookportAddress', {}); //this.props.navigation.goBack()
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

	return {
		RegistrationObj: state.saleNewReducer.RegistrationObj
	}
}, {generationAddress})(Bookport);

