/**
 * Man hinh thanh toán hợp đồng bán thêm
 * 
 * @author ThuanDD3
 * @since Jan, 2020
 */

// LIB
import React from 'react';
import {connect} from 'react-redux';
import {View, ScrollView, Text, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import {strings} from 'locales/i18n';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';

// COMPONENT
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PickerInputDynamic from 'app-libs/components/input/PickerInputDynamic';
import TechLoading from 'app-libs/components/TechLoading';
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';

// API
import * as api from '../api';

// COMPONENT
import RowInfoLarge from '../components/RowInfoLarge';

// STYLE
import moduleStyle from '../styles';
import ols from '../../../styles/Ola-style';
import HandleHardBackButton from '../../customer-info/components/HandleHardBackButton';

class ExtraServiceReceipt extends React.Component {

	static navigationOptions = {
		title: strings('contract.invoice_detail.title'),
		headerRight: <View/>
	}

	constructor(props) {
		super(props);
		console.log(this.props.navigation.state.params);
		// Param get from previous screen
		// ---- 1 - bán equip, ip
		// ---- 2 - bán internet
		const { RegID, RegCode, svType, Contract } = this.props.navigation.state.params;

		this.state = {
			loadingVisible: false,
			params: {
				// RegId: 594713,
				// RegCode: "ZPPFI28004",
				// svType: 2,
				Contract: Contract,
				RegID: RegID,
				RegCode: RegCode,
				svType: svType,
			},
			info: {},
			data: {
				PaymentMethod: {}
			}
		}
	}

	/**
	 * Khi render man hinh lan dau tien. Goi API lay thong tin chi tiet
	 */
	componentDidMount() {
		// load detail
		this.showLoading(true);

		// 
		const { params } = this.state;

		console.log(params);

		// call API
		api.loadExtraContractDetail(params, this.loadDetailSuccess.bind(this));
	}

	/**
	 * 
	 * @param {*} callback 
	 */
	loadPaymentMethod(callback) {
		callback(this.state.listPaymentMethod);
	}

	/**
	 * Callback khi load detail contract thanh cong. Hien thi du lieu ra view
	 * 
	 * @param boolean isSucess 
	 * @param object data 
	 * @param object msg 
	 */
	loadDetailSuccess(isSucess, data, msg) {
		const { params } = this.state;

		if (isSucess) {
			// thay doi state de load du lieu ra
			this.setState({
				info: data[0]
			});

			// load payment method
			// Nếu là bán mới truyền PaymentType=1, nếu là bán thêm truyền PaymentType=2
			// Nếu bán thêm mà IP, Equipment -> truyền 2
			// Nếu bán thêm mà InternetUpgrade -> truyền 3

			// svType 1: Bán thêm: Equipment & IP
			// svType 2: Bán thêm: Internet Upgrade
			api.getPaymentMethodList(
				{ PaymentType: params.svType === 1 ? 2 : 3 }, (data) => {
				console.log(data);
					// 
					this.showLoading(false);

					// 
					this.setState({
						...this.state,
						listPaymentMethod: data
					});
				}
			);

			return;
		}

		// Hien thi thong bao loi
		this.showLoading(false);
		this.refs['popup'].getWrappedInstance().show(msg.message);
	}

	/**
	 * Change data dung cho picker phuong thuc thanh toan
	 * 
	 * @param string name 
	 * @param object selectItem 
	 */
	changePickerValue(name, selectItem) {
		const data = this.state.data;

		if (data[name] == selectItem) {
			return;
		}

		data[name] = selectItem;
		
		this.setState({
			data: data
		});
	}

	/**
	 * Xu ly validate du lieu
	 */
	isValidData() {
		const {data} = this.state;
		let errorList = [];

		// Check PaymentMethod
		if (! data.PaymentMethod.Id) {
			this.refs['PaymentMethod'].setValid(false);

			errorList.push({
				name: 'PaymentMethod',
				msg: strings('dl.contract.invoice_detail.err.PaymentMethod')
			});
		} else {
			this.refs['PaymentMethod'].setValid(true);
		}

		if (errorList.length == 0) {
			return true;
		}

		this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
		return false;
	}

	/**
	 * Ham goi khi nhan nut xac nhan thanh toan
	 */
	onSubmit() {
		// Validate du lieu
		if (! this.isValidData()) {
			return;
		}

		const en = strings('dl.contract.invoice_detail.confirm_pay');
		const km = strings('dl.contract.invoice_detail.confirm_pay_km');

		// Hien thong bao xac nhan
		this.refs['popup_confirm'].getWrappedInstance().show(en + this.state.info.Contract + '?\n\n' + km + this.state.info.Contract + '?');
	}

	/**
	 * Xu ly callback lai khi nhan nut confirm o popup xac nhan
	 */
	paymentProcess() {
		// 
		const { info, params, data } = this.state;

		// 
		this.showLoading(true);
		
		// Khoi tao data goi API thanh toan
		const myData = {
			ObjID: info.ObjId,
			RegID: info.RegId,
			PaymentMethod: data.PaymentMethod.Id,
			svType: params.svType
		};

		// Goi API thanh toan
		api.updateContractPayment(myData, (isSuccess, data, msg) => {

			// 
			this.showLoading(false);

			// Thanh cong thi chuyen sang trang detail
			if (isSuccess) {
				console.log(data);

				if (myData.PaymentMethod === 3 && data.Link) {
					NavigationService.navigate('ExtraServicePaymentQrCode', {qrData: data, paramsData: params});
					return;
				} else {
					NavigationService.navigate('ExtraServiceCTDetail', params);
					return;
				}
				return;
				
				// setTimeout(() => {
				// 	 // Thanh Toán qua WING === 3
				// 	NavigationService.navigate(myData.PaymentMethod === 3 
				// 		? 'ExtraServicePaymentQrCode' 
				// 		: 'ExtraServiceCTDetail', params);
				// 	return;

				// 	// NavigationService.navigate('ExtraServiceCTDetail', params);    
				// 	// return;
				// }, 300);

			} else {
				// Hien thi popup khi co loi xay ra
				this.refs['popup'].getWrappedInstance().show(msg.message);
			}

			return;
		});
	}

	/**
	 * An/Hien loading
	 * 
	 * @param boolean isShow 
	 */
	showLoading(isShow) {
		this.setState({
			loadingVisible: isShow
		});
	}


	/**
	 * Render man hinh chinh
	 */
	render() {
		const { info, params } = this.state;
console.log(this.state);
		return (
			<HandleHardBackButton onBack={() => this.props.navigation.goBack()}>
				<KeyboardAvoidingView 
					keyboardVerticalOffset={Platform.select({ios: 70, android: 0})} 
					behavior= {(Platform.OS === 'ios')? "padding" : null} 
					style={[ols.container_keyboard]} >

					<ScrollView 
						keyboardDismissMode={'on-drag'}
						contentContainerStyle={[ols.wrapper_scrollview]}
					>
						<View style={[ols.inner_scrollview, ols.bgw, {justifyContent: 'space-between'}]}>
								<View style={[{paddingVertical: 15}]}>
									{ 
										//---- Info 
									}
									<Text style={moduleStyle.textTitle}>
										{strings('contract.invoice_detail.service_info')}
									</Text>
									
									<View>
										{
											params.svType === 1 ? 
												<View>
													<RowInfoLarge
														label={strings('extra_service.contract_detail.equipments')}
														text={ info && info.DeviceTotal ? info.DeviceTotal : "0" }
													/>
													<RowInfoLarge
														label={strings('extra_service.contract_detail.ip')}
														text={ info &&
																info.ListStaticIP && 
																info.ListStaticIP.length > 0 ? info.ListStaticIP[0].Total : "0" }
													/>
												</View>
											:
												<RowInfoLarge
													label={strings('extra_service.contract_detail.internet_upgrade')}
													text={ info && info.Total ? info.Total : "0" }
												/>
										}
										
										<RowInfoLarge
											label={strings('extra_service.contract_detail.type_payment')}
											text={info.PaymentMethodName && info.PaymentMethodName !== "" ? info.PaymentMethodName : "" }
										/>
									</View>
									
									{ 
										//---- Picker 
									}
									<Text style={[moduleStyle.textTitle, moduleStyle.boxSpace]}>
										{strings('contract.invoice_detail.payment')}
									</Text>
									<View>
										<PickerInputDynamic
											ref="PaymentMethod"
											prompt={strings('contract.invoice_detail.payment_method')}
											label={strings('contract.invoice_detail.payment_method')}
											getOptionData={this.loadPaymentMethod.bind(this)}
											onBeforeLoad={() => this.showLoading(true)}
											onAfterLoad={() => this.showLoading(false)}
											defaultValue={{Name: "Choose payment method"}}
											onValueChange={(selectedItem) => this.changePickerValue('PaymentMethod', selectedItem)}
										/>
									</View>
								</View>

								<View>
									<View style={styles.buttonContainer}>
										<ButtonElement 
											title={strings('contract.invoice_detail.btnConfirm')}
											onPress={this.onSubmit.bind(this)}
										/>
									</View>
								</View>
						</View>
					</ScrollView>

					<TechLoading visible={this.state.loadingVisible}/>
					<PopupWarning ref="popup"/>
					<PopupAction
						ref="popup_confirm"
						actionCallback={this.paymentProcess.bind(this)}
					/>
				</KeyboardAvoidingView>
			</HandleHardBackButton>   
		);
	}
}

export default connect((state) => {
	return {
		Username: state.authReducer.userInfo.UserName
	}
}, null)(ExtraServiceReceipt);


const styles = StyleSheet.create({
	buttonContainer: {
		marginBottom: 24,
	},
	textBold: {
		fontWeight: '500'
	}
});