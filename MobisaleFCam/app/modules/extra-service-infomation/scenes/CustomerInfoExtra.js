import React, { Component } from "react";
import {
	Text,
	View,
	KeyboardAvoidingView,
	Platform,
	Keyboard
} from "react-native";
import { strings } from "locales/i18n";
import { connect } from "react-redux";

// API
import * as api from "../api";

// REDUX ACTION
import { actions } from "..";
const { nextStep, updateInfoExtraServiceForm } = actions;

// LIB CUSTOM
import NavigationService from "app-libs/helpers/NavigationService";
import PopupWarning from "app-libs/components/PopupWarning";
import TechLoading from "app-libs/components/TechLoading";
import { convertPhone } from "app-libs/helpers/regex";
// COMPONENT

import InputO from "app-libs/components/input/InputO";
import ButtonNext from "../../customer-info/components/ButtonNext";

//  STYLE
import styles from "../../customer-info/styles";
import cusInfStyle from "../styles";
import ols from "../../../styles/Ola-style";
import { ScrollView } from "react-native-gesture-handler";
import { KEYBOARD_NUMBER } from "../constants";
import InputOAutoWidth from "../../../libs/components/input/InputOAutoWidth";

class CustomerInfoExtra extends Component {
	constructor(props) {
		super(props);

		this.state = {
			dataTemp: {
				changeForm: true,
				step: 1,
				nextScreen: "ciServiceTypeExtra"
			},
			data: props.formData,
			loadingVisible: false
		};
	}

	componentDidMount() {
		const { navigation, updateInfoExtraServiceForm } = this.props;
		navigation.addListener("willBlur", () => {
			updateInfoExtraServiceForm(this.state.data);
		});

		navigation.addListener("willFocus", async () => {
			setTimeout(() => {

				this.setState({
					data: this.props.formData
				});
			}, 300);
		});
	}

	/**
	 * Validate form cusinfo
	 */
	_isValidData = () => {
		const { data } = this.state;
		let errorList = [];

		// //check FullName
		// if (data.FullName && data.FullName.trim() != "") {
		//   this.refs["FullName"].setValid(true);
		// } else {
		//   this.refs["FullName"].setValid(false);
		//   errorList.push({
		//     name: "FullName",
		//     msg: strings("dl.extra_service_info.customer_info.err.FullnameType")
		//   });
		// }

		// //check Contract number
		// if (data.Contract && data.Contract.trim() != "") {
		//   this.refs["Contract"].setValid(true);
		// } else {
		//   this.refs["Contract"].setValid(false);
		//   errorList.push({
		//     name: "Contract",
		//     msg: strings("dl.extra_service_info.customer_info.err.ContractNumber")
		//   });
		// }

		// //check Phone1
		// if (data.Phone1 && data.Phone1.trim() != "") {
		//   this.refs["Phone1"].setValid(true);
		// } else {
		//   this.refs["Phone1"].setValid(false);
		//   errorList.push({
		//     name: "Phone1",
		//     msg: strings("dl.extra_service_info.customer_info.err.Phone1Type")
		//   });
		// }

		// //check Email
		// if (data.Email && data.Email.trim() != "") {
		//   let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

		//   if (reg.test(data.Email) === false) {
		//     this.refs["Email"].setValid(false);

		//     errorList.push({
		//       name: "Email",
		//       msg: strings("dl.extra_service_info.customer_info.err.EmailType")
		//     });
		//   } else {
		//     this.refs["Email"].setValid(true);
		//   }
		// } else {
		//   this.refs["Email"].setValid(false);
		// }

		// //check Address
		// if (data.Address && data.Address.trim() != "") {
		//   this.refs["Address"].setValid(true);
		// } else {
		//   this.refs["Address"].setValid(false);
		//   errorList.push({
		//     name: "",
		//     msg: strings("dl.extra_service_info.customer_info.err.Address")
		//   });
		// }

		//check Contact name
		if (data.Contact2 && data.Contact2.trim() != "") {
			this.refs["Contact2"].setValid(true);
		} else {
			this.refs["Contact2"].setValid(false);
			errorList.push({
				name: "",
				msg: strings("dl.extra_service_info.customer_info.err.Contact1Type")
			});
		}

		//check Contact phone
		if (data.Phone2 && data.Phone2.trim() != "") {
			this.refs["Phone2"].setValid(true);
		} else {
			this.refs["Phone2"].setValid(false);
			errorList.push({
				name: "Phone2",
				msg: strings("dl.extra_service_info.customer_info.err.Phone2Type")
			});
		}

		// error list
		if (errorList.length == 0) {
			return true;
		}

		this.refs["popup"].getWrappedInstance().show(errorList[0].msg);
		return false;
	};

	/** Function gọi khi bấm button NEXT */
	_onNextStep = () => {
		if (!this._isValidData()) {
			return;
		}

		const { data, dataTemp } = this.state;

		this._loading(true);
		// trim dữ liệu trước khi submit lên store
		const mapData = {
			...data,
			Phone2: data.Phone2 ? data.Phone2.trim() : null,
			Contact2: data.Contact2 ? data.Contact2.trim() : null
		};

		this.setState(
			{
				data: mapData
			},
			() => {
				this.props.updateInfoExtraServiceForm(mapData, () => {
					setTimeout(() => {
						this._loading(false);
						this.props.nextStep(dataTemp);
						NavigationService.navigate(dataTemp.nextScreen);
					}, 0);
				});
			}
		);
	};

	/**
	 * Update lại state khi change field
	 */
	_onChangeField = (field, text) => {
		this.refs[field].setValid(text.trim() !== "");
		this.setState({
			data: {
				...this.state.data,
				[field]: text
			}
		});
	};

	/**
	 * show Loi
	 * @param err
	 * @private
	 */
	_error(err) {
		this._loading(false);
		this.refs["popup"].getWrappedInstance().show(err.message);
	}

	/**
	 * Loading
	 * @param isShow
	 * @private
	 */
	_loading(isShow) {
		this.setState({
			...this.state,
			loadingVisible: isShow
		});
	}

	_convertPhone(key) {
		// console.log(key);
		// console.log(this.state.data);

		let state = this.state;
		let { Phone1, Phone2 } = state.data



		if (key === 'Phone2' && Phone2 !== '') {
			state.data[key] = convertPhone(Phone2);
		}

		this.setState(state);
		return;
	}

	render() {
		const { data } = this.state;

		return (
			<KeyboardAvoidingView
				keyboardVerticalOffset={Platform.select({ ios: 150, android: 0 })}
				behavior={Platform.OS === "ios" ? "padding" : null}
				style={[styles.container, cusInfStyle.container]}
			>
				<ScrollView
					keyboardDismissMode={"on-drag"}
					contentContainerStyle={[
						ols.wrapper_scrollview,
						cusInfStyle.cus_scrollview
					]}
				>
					<View
						style={[
							ols.inner_scrollview,
							ols.bgw,
							cusInfStyle.inner_scrollview
						]}
					>
						<View>
							{/*
			 //-- Customer info
			 */}
							<Text
								style={[
									styles.headline,
									ols.mgt15,
									ols.cl444,
									ols.fs14,
									ols.fw500
								]}
							>
								{strings(
									"extra_service.extra_service_info.customer_info.cus_info"
								)}
							</Text>
							<View style={styles.container}>
								<InputO
									ref="FullName"
									label={strings(
										"extra_service.extra_service_info.customer_info.lb_fullname"
									)}
									style={[styles.textInput, ols.fw500, ols.txtR]}
									placeholder={""}
									placeholderTextColor="#444444"
									textAlign={"right"}
									autoCapitalize={"none"}
									returnKeyType={"done"}
									autoCorrect={false}
									editable={false}
									value={data && data["FullName"]}
								/>
							</View>
							<View style={styles.container}>
								<InputO
									ref="Contract"
									label={strings(
										"extra_service.extra_service_info.customer_info.lb_contractNum"
									)}
									style={[styles.textInput, ols.fw500, ols.txtR]}
									placeholder={""}
									placeholderTextColor="#444444"
									textAlign={"right"}
									autoCapitalize={"none"}
									returnKeyType={"done"}
									autoCorrect={false}
									editable={false}
									value={data && data["Contract"]}
								/>
							</View>
							<View style={styles.container}>
								<InputO
									ref="Phone1"
									label={strings(
										"extra_service.extra_service_info.customer_info.lb_mobilePhone"
									)}
									style={[styles.textInput, ols.fw500, ols.txtR]}
									placeholder={""}
									placeholderTextColor="#444444"
									textAlign={"right"}
									autoCapitalize={"none"}
									returnKeyType={"done"}
									autoCorrect={false}
									editable={false}
									value={data && data["Phone1"]}
								/>
							</View>
							<View style={styles.container}>
								<InputO
									ref="Email"
									label={strings(
										"extra_service.extra_service_info.customer_info.lb_email"
									)}
									style={[styles.textInput, ols.fw500, ols.txtR]}
									placeholder={""}
									placeholderTextColor="#444444"
									textAlign={"right"}
									autoCapitalize={"none"}
									returnKeyType={"done"}
									autoCorrect={false}
									editable={false}
									value={data && data["Email"]}
								/>
							</View>
							<View style={styles.container}>
								<InputO
									ref="Address"
									label={strings(
										"extra_service.extra_service_info.customer_info.lb_setupAddress"
									)}
									style={[styles.textInputMultiline, ols.fw500, ols.txtR]}
									placeholder={""}
									placeholderTextColor="#444444"
									textAlign={"right"}
									autoCapitalize={"none"}
									multiline={true}
									numberOfLines={2}
									returnKeyType={"done"}
									autoCorrect={false}
									editable={false}
									value={data && data["Address"]}
								/>
							</View>
							<View style={styles.container}>
								<InputOAutoWidth
									ref="Contact2"
									label={strings(
										"extra_service.extra_service_info.customer_info.lb_contactName"
									)}
									style={[styles.textInput, ols.fw500, ols.txtR]}
									placeholder={strings(
										"extra_service.extra_service_info.customer_info.plh_contactName"
									)}
									placeholderTextColor="#444444"
									textAlign={"right"}
									autoCapitalize={"none"}
									returnKeyType={"done"}
									autoCorrect={false}
									editable={true}
									value={data && data["Contact2"]}
									maxLength={200}
									onChangeText={text => this._onChangeField("Contact2", text)}
								/>
							</View>
							<View style={styles.container}>
								<InputOAutoWidth
									ref="Phone2"
									label={strings(
										"extra_service.extra_service_info.customer_info.lb_contactPhone"
									)}
									style={[styles.textInput, ols.fw500, ols.txtR]}
									placeholder={strings(
										"extra_service.extra_service_info.customer_info.plh_contactPhone"
									)}
									placeholderTextColor="#444444"
									textAlign={"right"}
									autoCapitalize={"none"}
									returnKeyType={"done"}
									autoCorrect={false}
									editable={true}
									onBlur={() => this._convertPhone('Phone2')}
									maxLength={20}
									keyboardType={KEYBOARD_NUMBER}
									value={data && data["Phone2"]}
									onChangeText={text => this._onChangeField("Phone2", text)}
								/>
							</View>
						</View>
						{/*
			  //-- next button
			 */}
						<View style={[{ marginBottom: 24 }]}>
							<ButtonNext
								label={strings(
									"customer_info.customer_info.form.btnNext_label"
								)}
								onNextTab={() => this._onNextStep()}
							/>
						</View>
					</View>
				</ScrollView>
				<PopupWarning ref="popup" />
				<TechLoading visible={this.state.loadingVisible} />
			</KeyboardAvoidingView>
		);
	}
}

function mapStateToProps(state) {
	const extraServiceState = state.extraServiceInfoReducer;
	return {
		formData: extraServiceState && extraServiceState.formData
	};
}
export default connect(mapStateToProps, {
	nextStep,
	updateInfoExtraServiceForm
})(CustomerInfoExtra);
