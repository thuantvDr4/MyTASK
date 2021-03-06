
import {name as appName} from './../../../../app.json';
// LIB
import React, { Component } from 'react';
import { Text, View, Dimensions, TouchableOpacity, Platform, Alert, PermissionsAndroid, Image} from 'react-native';
import FusedLocation from 'react-native-fused-location';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
import SwitchSelector from 'react-native-switch-selector';
import isEqual from 'lodash/isEqual';
import {connect} from "react-redux";
import {strings} from 'locales/i18n';

// LIB CUSTOM
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import NavigationService from 'app-libs/helpers/NavigationService';

// ACTION
import { actions } from '..';
const { loadMap, showPointGroup, changePointGroup,
		changeTypeBookport, regionBookport,
		updateInfoRegistration, saveLatLngDevice, clearContractTemp } = actions;

// API
import * as api from "../api";

// CONSTANT
const LATITUDE_DELTA = 0.01; const LONGITUDE_DELTA = 0.01;
const defaultProps = {
	enableHack: false,
	geolocationOptions: { enableHighAccuracy: true, timeout: 40000, maximumAge: 1000 },
};
const options = [
	{ label: strings('sale_new.bookport_map.address'), value: 1},
	{ label: strings('sale_new.bookport_map.location'), value: 0},
];

// STYLE
import styles from '../BookPort.styles';


class BookPortAction extends React.PureComponent {

	mounted = false;
	latlngDevice = null;

	constructor(props){
		super(props);

		this.state = {
			loadingVisible: false,
			paramBack: this.props.navigation.getParam('extraServiceEditPort', ''),
			svType: this.props.navigation.getParam('svType', '2')
		};
		
		// load map
		this._handleSwitchBtn = this._handleSwitchBtn.bind(this);
		this._handleGpsRegion = this._handleGpsRegion.bind(this);
		this._handleAddressRegion = this._handleAddressRegion.bind(this);

		//show tap diem
		this._handleGetPointGroup = this._handleGetPointGroup.bind(this);
		this._handleShowPointGroup = this._handleShowPointGroup.bind(this);
		this._getLatlngDevice = this._getLatlngDevice.bind(this);
		this._handleBookPort = this._handleBookPort.bind(this);

		//show notify
		this._handleAutoBookportSuccess = this._handleAutoBookportSuccess.bind(this);
		// this._handleAutoBookportFail = this._handleAutoBookportFail.bind(this);

		//
		this._clearAllDataPointGroup = this._clearAllDataPointGroup.bind(this);
		this._error = this._error.bind(this);
		this._errorMsg = this._errorMsg.bind(this);
		this._loading = this._loading.bind(this);
	}

	componentDidMount() {
		// 
		this.mounted = true;

		// l???n ?????u ti??n render s??? l???y t???a ????? theo ?????a ch??? kh??ch h??ng
		if (Platform.OS === 'android') {

			PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				{
					'title': appName + ' LOCATION Permission',
					'message': appName + ' needs access to your LOCATION ' +
					'so you can take current position.'
				})
				.then(granted => {
					if (granted && this.mounted)
					{

						// check open GPS
						LocationServicesDialogBox.checkLocationServicesIsEnabled({
							message: "<h2 style='color: #0af13e'>Use Location ?</h2>This app wants to change your device settings:<br/><br/>Use GPS, Wi-Fi, and cell network for location<br/><br/><a href='#'>Learn more</a>",
							ok: "YES",
							cancel: "NO",
							enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
							showDialog: true, // false => Opens the Location access page directly
							openLocationServices: true, // false => Directly catch method is called if location services are turned off
							preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
							preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
							providerListener: false // true ==> Trigger locationProviderStatusChange listener when the location state changes
						}).then(()??? => {
							this._handleAddressRegion();
						}).catch((error) => {
							// console.log(error.message); // error.message => "disabled"
						});
					}
					else
					{
						this._errorMsg('????? x??c ?????nh v??? tr??, v??? tr?? c???a b???n cho ph??p ???ng d???ng trong C??i ?????t - ???ng d???ng - MobiSale - V??? tr??')
					}

			});

		} else {
			this._handleAddressRegion();
		}
	}

	componentWillUnmount() {
		this.mounted = false;
		FusedLocation.stopLocationUpdates();
		if (this.watchID) navigator.geolocation.clearWatch(this.watchID);
	}

	/**
	 * Detect xem nhan toa do theo dia chi hay toa do lan bookport truoc
	 * 
	 * @param {lat: *, lng: *} newGEO 
	 */
	getPreGEO(newGEO) {

		let preGEO = this.props.RegistrationObj.Latlng.split(',');

		if (this.props.RegistrationObj.ContractTemp == '' || preGEO.length !== 2) {
			return newGEO;
		}

		return {
			lat: parseFloat(preGEO[0]),
			lng: parseFloat(preGEO[1]),
		}
	}

	/**
	 * xy ly load toa do theo dia chi
	 * @private
	 */
	_handleAddressRegion() {
		const address = this.props.RegistrationObj.Address;
		
		if (this.props.objBookport.regionAddress) {
			
			const myPosition = {
				region : this.props.objBookport.regionAddress,
				regionAddress : this.props.objBookport.regionAddress,
				regionGps : this.props.objBookport.regionGps
			};
			this.props.loadMap(myPosition);
		
		} else {

			fetch("https://maps.google.com/maps/api/geocode/json?address=" + encodeURI(address) + "&key=AIzaSyBs8p0Hv4s0kf7BPqD361qRpArQkFJ1Djk")
			.then((response) => response.json())
			.then((responseJson) => {

				if (responseJson.status == 'OK') {

					const result    = responseJson.results[0];
					// lay toa do dia chi hoac toa do phieu TTKH
					const detectGEO = this.getPreGEO(result.geometry.location);
					
					const myPosition = {
						region : {
							latitude: detectGEO.lat,
							longitude: detectGEO.lng,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA,
						},
						regionAddress : {
							latitude: detectGEO.lat,
							longitude: detectGEO.lng,
							latitudeDelta: LATITUDE_DELTA,
							longitudeDelta: LONGITUDE_DELTA,
						},
						regionGps : this.props.objBookport.regionGps
					};

					// load lai map
					this.props.loadMap(myPosition);

				} else {

					const address = this.props.RegistrationObj.Address.replace(this.props.RegistrationObj.BillTo_Number,'');
					fetch("https://maps.google.com/maps/api/geocode/json?address=" + encodeURI(address) + "&key=AIzaSyBs8p0Hv4s0kf7BPqD361qRpArQkFJ1Djk")
					.then((response) => response.json())
					.then((responseJson) => {

						if(responseJson.status == 'OK') {
							const result    = responseJson.results[0];
							// lay toa do dia chi hoac toa do phieu TTKH
							const detectGEO = this.getPreGEO(result.geometry.location);
							const myPosition = {
								region : {
									latitude: detectGEO.lat,
									longitude: detectGEO.lng,
									latitudeDelta: LATITUDE_DELTA,
									longitudeDelta: LONGITUDE_DELTA,
								},
								regionAddress : {
									latitude: detectGEO.lat,
									longitude: detectGEO.lng,
									latitudeDelta: LATITUDE_DELTA,
									longitudeDelta: LONGITUDE_DELTA,
								},
								regionGps : this.props.objBookport.regionGps
							};

							// load lai map
							this.props.loadMap(myPosition);
						} else {
							this.refs['popup'].getWrappedInstance().show(strings('dl.sale_new.bookport_map.address_wrong'));
							return;
						}
					}).then(() => {
						// setTimeout(() => {
						//     alert("Error");
						// },100)
					}).done();
				}
			}).then(() => {
				// setTimeout(() => {
				//     alert("Error");
				// },100)
			}).done();
		}

	}

	/**
	 * xu ly load toa do theo GPS
	 * @private
	 */
	_handleGpsRegion() {
		try {
			if(this.props.objBookport.regionGps)
			{
				const myPosition = {
					region : this.props.objBookport.regionGps,
					regionGps : this.props.objBookport.regionGps,
					regionAddress : this.props.objBookport.regionAddress
				};
				this.props.loadMap(myPosition);
			}
			else
			{
				this._loading(true);
				if (Platform.OS === 'android') {
					// Keep getting updated location.
					FusedLocation.startLocationUpdates();

					FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);

					FusedLocation.getFusedLocation().then((position) => {
						const myPosition = {
							region : {
								latitude: position.latitude,
								longitude: position.longitude,
								latitudeDelta: LATITUDE_DELTA,
								longitudeDelta: LONGITUDE_DELTA,
							},
							regionGps : {
								latitude: position.latitude,
								longitude: position.longitude,
								latitudeDelta: LATITUDE_DELTA,
								longitudeDelta: LONGITUDE_DELTA,
							},
							regionAddress : this.props.objBookport.regionAddress
						};
						this.props.loadMap(myPosition);
						FusedLocation.stopLocationUpdates();
						this._loading(false);
					});
				}
				else {
					navigator.geolocation.getCurrentPosition(
						(position) => {
							const myPosition = {
								region : {
									latitude: position.coords.latitude,
									longitude: position.coords.longitude,
									latitudeDelta: LATITUDE_DELTA,
									longitudeDelta: LONGITUDE_DELTA,
								},
								regionGps : {
									latitude: position.coords.latitude,
									longitude: position.coords.longitude,
									latitudeDelta: LATITUDE_DELTA,
									longitudeDelta: LONGITUDE_DELTA,
								},
								regionAddress : this.props.objBookport.regionAddress
							};

							this.props.loadMap(myPosition);
							this._loading(false);

						},(error) => {
							this._loading(false);
							setTimeout(() => {
								this._errorMsg(strings('dl.sale_new.bookport_map.Error_detecting_your_location'));
							},100)
						},
						this.props.geolocationOptions
					);
				}

			}
		} catch(e) {
			this._loading(false);

			setTimeout(() => {
				alert(e.message || "");
			},100)

		}
	}

	/**
	 * xu ly load toa do theo GPS
	 * @private
	 */
	_getLatlngDevice() {

		if (Platform.OS === 'android') {

			// Keep getting updated location.
			FusedLocation.startLocationUpdates();
			FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
			FusedLocation.getFusedLocation()
			.then((position) => {

				const latlngDevice = position.latitude + ',' + position.longitude;
				FusedLocation.stopLocationUpdates();
				this.props.saveLatLngDevice(latlngDevice);

				// SUBMIT
				this._handleBookPort(latlngDevice);
			});
		
		} else {

			navigator.geolocation.getCurrentPosition( (position) => {
				
					const latlngDevice = position.coords.latitude + ',' + position.coords.longitude;
					this.props.saveLatLngDevice(latlngDevice);

					// SUBMIT
					this._handleBookPort(latlngDevice);
				},
				(error) => {
					this._loading(false);

					setTimeout(() => {
						this._errorMsg(strings('dl.sale_new.bookport_map.Error_detecting_your_location'));
					},100)
				},
				this.props.geolocationOptions
			);
		}
	}

	/**
	 * xy ly button chuyen dia chi va GPS
	 * @param value
	 * @private
	 */
	_handleSwitchBtn(value) {
		
		if(!this.props.objBookport.isMapReady) {
			
			this.refs['popup'].getWrappedInstance().show(strings('dl.sale_new.bookport_map.wait_map'));
			return;
		}
		// x??a t???t c??? t???p ??i???m hi???n c??
		// x??a h???t c??c marker hi???n c??
		// x??a h???t c??c ?????a ch??? ???? ch???n hi???n c??

		if (value === 1) {
			this._handleAddressRegion()
		} else {
			this._handleGpsRegion();
		}
	}

	/**
	 * lay danh sach tap diem
	 * @private
	 */
	_handleGetPointGroup() {

		if (!this.props.objBookport.isMapReady) {
			this.refs['popup'].getWrappedInstance().show(strings('dl.sale_new.bookport_map.wait_map'));
			return;
		}
		//show loading
		this._loading(true);

		// xoa tat ca tap diem hien tai
		this._clearAllDataPointGroup();
		// console.log(this.props.objBookport.regionBookport)
		
		const info = {
			Username : this.props.Username,
			LocationId: this.props.RegistrationObj.LocationId,
			WardId : this.props.RegistrationObj.WardId,
			latitude : "" + this.props.objBookport.regionBookport.latitude,
			longitude : "" + this.props.objBookport.regionBookport.longitude,
			typeOfNetworkInfrastructure : this.props.objBookport.networkType,
			BookportIdentityID : this.props.objBookport.BookportIdentityID,
		};

		api.getListGroupPoint(info, (success, result, error) => {
			this._loading(false);
			
			if (success) {
				this._handleShowPointGroup(result);

				// thay ?????i type bookport
				if (this.props.objBookport.typeBookport == 0){
					this.props.changeTypeBookport(0, 0);
				}
				
			} else {
				this._errorMsg(error.message);

				// thay ?????i type bookport
				if (this.props.objBookport.typeBookport == 0){
					this.props.changeTypeBookport(0, 0);
				}
			}
		});
	}

	/**
	 * hien thi danh sach tap diem
	 * @param result
	 * @private
	 */
	_handleShowPointGroup(result) {
		const myData = result[Object.keys(result)[0]]['ListOfPoints'];
		const pointGroup = [];

		Object.keys(myData).forEach(function(key) {
			const objPoint = myData[key];
			const arrLatLng = objPoint.latLng.split(",");

			const point = {
				key : key,
				region : {
					latitude: parseFloat(arrLatLng[0].trim()),
					longitude: parseFloat(arrLatLng[1].trim()),
				},
				latLng : objPoint.latLng,
				deviceName: objPoint.deviceName,
				lengthCable : objPoint.lengthCable,
				distance : objPoint.distance,
				portTotal : objPoint.portTotal,
				portFree : objPoint.portFree,
				address : objPoint.address,
			};

			// kiem tra so luong port de hien thi marker
			if (objPoint.portFree == 1) {
				point.iconMaker = require('../../../assets/images/bookport/ic_24Tap_diem_red.png');
			} else {
				point.iconMaker = require('../../../assets/images/bookport/ic_24Tap_diem_blue.png');
			}

			pointGroup.push(point);
		});
		// tien hanh show tap diem
		this.props.showPointGroup(pointGroup);
		this._loading(false);
	}

	/**
	 * Xu ly bookport
	 * @private
	 */
	_handleBookPort(latlngDevice) {
		
		if (!this.props.objBookport.isMapReady) {

			this.refs['popup'].getWrappedInstance().show(strings('dl.sale_new.bookport_map.wait_map'));
			return;
		}

		// AUTO BOOKPORT
		if (this.props.objBookport.typeBookport) {

			this._loading(true);

			// SET
			const infoBookport = {
				Username : this.props.Username,
				LocationId: this.props.RegistrationObj.LocationId,
				RegCode : this.props.RegistrationObj.RegCode,
				WardId : this.props.RegistrationObj.WardId,
				latitude : "" + this.props.objBookport.regionBookport.latitude,
				longitude : "" + this.props.objBookport.regionBookport.longitude,
				typeOfNetworkInfrastructure : this.props.objBookport.networkType,
				ContractTemp : this.props.RegistrationObj.ContractTemp,
				isRecovery : this.props.RegistrationObj.ContractTemp ? 1:0,
				BookportIdentityID: this.props.RegistrationObj.BookportIdentityId,
			};

			// SET
			if (this.props.RegistrationObj.RegCode) { infoBookport.LatlngDevice = latlngDevice }
			
			// CALL API BOOOK PORT AUTO
			api.autoBookport(infoBookport, (success, result, error) => {
				
				/**
				 * CreateKHTN = -150, ??????????????????         //t???o kh??ch h??ng ti???m n??ng
				 * APIBookPortNotFound = -151, ???????????????? //kh??ng t???n t???i ???????ng d???n API bookport
				 * APIGetPoinsManualNotFound = -152, ???? //kh??ng t???n t???i ???????ng d???n API l???y danh s??ch t???p ??i???m th??? c??ng
				 * APIGetPoinsAutoNotFound = -153, ???????? //kh??ng t???n t???i ???????ng d???n API l???y danh s??ch t???p ??i???m t??? ?????ng
				 * APIRecoveryPortNotFound = -154, ???????? //kh??ng t???n t???i ???????ng d???n API thu h???i port
				 * 
				 * 1. Bookport khi t???o m???i Phi???u Th??ng tin Kh??ch h??ng (b??n th??m)
				 * 2. Bookport khi s???a l???i t??? Phi???u Th??ng tin Kh??ch h??ng (b??n th??m) - s???a qua 3 b?????c info
				 * 3. Bookport khi s???a l???i t??? Phi???u Th??ng tin Kh??ch h??ng (b??n th??m) - s???a th???ng
				*/

				this._loading(false);

				if (success) {
					// BOOKPORT AUTO THANH CONG
					this._handleAutoBookportSuccess(result);

				} else {
					// BOOKPORT AUTO FAIL
					this.props.clearContractTemp();

					setTimeout(() => {
						// BOOKPORT AUTO FAIL -> CODE -150
						if (error.Code === -150) {

							// FAIL
							// -> N???U C?? REGCODE 
							// -> ( TRUONG HOP NAY LA SUA PORT LAI TU CAP NHAT PHIEU THONG TIN KHACH HANG)
							if (this.props.RegistrationObj.RegCode) {
								console.log('------ err 1');
								Alert.alert(
									strings('sale_new.bookport_map.notification'),
									strings('dl.sale_new.bookport_map.auto_bookport_fail'),
									[
										{
											text: strings('sale_new.bookport_map.agree'),
											onPress: () => {
												this.props.changeTypeBookport(0, 0);
											}
										}
									],
									{ cancelable: false }
								)
							} 
							// -> ( TRUONG HOP NAY LA BOOK PORT MOI)
							else {
								console.log('------ err 2');
								Alert.alert(
									strings('sale_new.bookport_map.notification'),
									strings('dl.sale_new.bookport_map.auto_bookport_fail'),
									
									// KIEM TRA XEM BOOKPORT MOI HOAN TOAN HAY TU KHACH HANG TIEM NANG
									// this._checkPotential(this.props.RegistrationObj.PotentialObjID),
									[
										{
											text: strings('sale_new.bookport_map.book_port'),
											onPress: () => {
												this.props.changeTypeBookport(0, 0);
											}
										}
									],
									{ cancelable: false }
								)
							}

						} 
						
						// NEW FIX SERVER (2019.09.05)
						else if (error.Code === 504) {
							console.log('------ err 3.0');

							if (this.props.RegistrationObj.RegCode) {
								console.log('------ err 3');
								Alert.alert(
									strings('sale_new.bookport_map.notification'),
									strings('dl.sale_new.bookport_map.auto_bookport_fail'),
									[
										{
											text: strings('sale_new.bookport_map.agree'),
											onPress: () => {
												this.props.changeTypeBookport(0, 0);
											}
										}
									],
									{ cancelable: false }
								)
							} 
							// -> ( TRUONG HOP NAY LA BOOK PORT MOI)
							else {
								console.log('------ err 4');
								Alert.alert(
									strings('sale_new.bookport_map.notification'),
									strings('dl.sale_new.bookport_map.auto_bookport_fail'),
									[
										{
											text: strings('sale_new.bookport_map.book_port'),
											onPress: () => {
												this.props.changeTypeBookport(0, 0);
											}
										}
									],
									{ cancelable: false }
								)
							}
						}

						// BOOKPORT AUTO FAIL -> CODE KHAC -150
						else {
							console.log('------ err 5');
							Alert.alert(
								strings('sale_new.bookport_map.notification'),
								strings('dl.sale_new.bookport_map.auto_bookport_fail'),
								[
									{
										text: strings('sale_new.bookport_map.agree'),
										onPress: () => {
											this.props.changeTypeBookport(0, 0);
										}
									}
								],
								{ cancelable: false }
							)
						}
					}, 100);
				}
			});
		} else {
			// BOOKPORT MANUAL
			NavigationService.navigate('ExSerBookportCab', { 
				extraServiceEditPort: this.state.paramBack,
				svType: this.state.svType
			});
		}
	}
	

	/**
	 * Xu ly Bookport auto thanh cong
	 * @param result
	 * @private
	 */
	_handleAutoBookportSuccess(result) {
		// 
		const { paramBack } = this.state;
		
		// 
		this._loading(false);
		console.log('---- success 1.0');

		// Ki???m tra xem ?????n t??? trang chi ti???t phi???u th??ng tin hay t??? trang Step 2
		if (paramBack === 'fromBtnEditPort') {
			console.log('---- success 1');
			// NavigationService.navigate('ExtraServiceCTDetail', {
			// 	RegID : this.props.RegistrationObj.RegId,
			// 	RegCode : this.props.RegistrationObj.RegCode
			// });
			NavigationService.navigateGoBack();

		} else {
			console.log('---- success 2');

			// 
			this._loading(true);

			// 
			const infoBookportSuccess = {
				ContractTemp : result[0].BookPortAuto.ContractTemp,
				ODCCableType : result[0].BookPortAuto.ODCCableType,
				BookportIdentityID : result[0].BookportIdentityID,
				GroupPoints : result[0].BookPortAuto.Name,
				Latlng : "" + this.props.objBookport.regionBookport.latitude + ',' + this.props.objBookport.regionBookport.longitude,
				Lat : "" + this.props.objBookport.regionBookport.latitude,
				Lng : "" + this.props.objBookport.regionBookport.longitude,
				LatlngDevice : this.props.RegistrationObj.LatlngDevice,
				Indoor : result[0].BookPortAuto.LengthSurvey_InDoor,
				OutDoor: result[0].BookPortAuto.LengthSurvey_OutDoor
			};

			// 
			this.props.updateInfoRegistration(infoBookportSuccess, () => {

				setTimeout(() => {	
					//
					this._loading(false);
					// 
					NavigationService.navigateGoBack();
				}, 500);

			});
		}
	}

	/**
	 * Xu ly bookport auto that bai
	 * @param 
	 * @private
	 */
	_handleAutoBookportFail() {

		this._loading(false);

		setTimeout(() => {
			if (this.props.RegistrationObj.RegCode) {
				Alert.alert(
					strings('sale_new.bookport_map.notification'),
					strings('dl.sale_new.bookport_map.manual_bookport_fail_update'),
					[
						{
							text: strings('sale_new.bookport_map.book_port'),
							onPress: () => {
								this.props.changeTypeBookport(0, 0);
							}
						}
					],
					{cancelable: false}
				);

			} else {
				Alert.alert(
					strings('sale_new.bookport_map.notification'),
					strings('dl.sale_new.bookport_map.auto_bookport_fail'),
					// this._checkPotential(this.props.RegistrationObj.PotentialObjID),
					[
						{
							text: strings('sale_new.bookport_map.book_port'),
							onPress: () => {
								this.props.changeTypeBookport(0, 0);
							}
						}
					],
					{cancelable: false}
				);
			}
		}, 100);
	}

	/**
	 * Xoa tap diem
	 * @param 
	 * @private
	 */
	_clearAllDataPointGroup() {
		this.props.showPointGroup(null)
		this.props.changePointGroup(null)
	}

	/**
	 * show Loi
	 * @param err
	 * @private
	 */
	_error(err) {
		this._loading(false);
		if (! err.message) return;
		this.refs['popup'].getWrappedInstance().show(err.message);
	}
	
	/**
	 * show Loi
	 * @param err
	 * @private
	 */
	_errorMsg(err) {
		this._loading(false);
		if (! err) return;
		this.refs['popup'].getWrappedInstance().show(err.toString());
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

	render() {
		return (
			<View style={styles.bottomContainer}>
				<View style={styles.viewBottomContainer}>

					<View style={styles.gpsContainer}>
						<View style={styles.oneGps}>
							<TouchableOpacity style={styles.btnPoint} onPress={this._handleGetPointGroup}>
								<Text style={styles.textPoint}>{strings('sale_new.bookport_map.point_group')}</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.oneGps}>
							<TouchableOpacity style={styles.btnGps} onPress={this._handleGpsRegion}>
								<Image style={{width:16, height:16}} source={require('../../../assets/images/bookport/ic_16Gps.png')}/>
							</TouchableOpacity>
						</View>
					</View>

					<View style={styles.toolContainer}>
						<View style={[styles.addressContainer]}>
							<View style={[styles.imgAddressContainer]}>
								<View style={styles.oneImage}>
									<Image style={{width:24, height:31}} source={require('../../../assets/images/bookport/ic_24Location_MBS.png')}/>
								</View>
								<View style={styles.oneImage}>
									<Image style={{width:24, height:24}} source={require('../../../assets/images/bookport/ic_16Tap_diem_blue.png')}/>
								</View>
							</View>
							<View style={styles.txtAddressContainer}>
								<View style={[styles.oneAddress, styles.borderBottomAddress]}>
									<Text style={styles.txtAddress}>
										{this.props.objBookport.typeBookport ? strings('sale_new.bookport_map.process_auto_bookport') : strings('sale_new.bookport_map.drag_to_bookport')}
										</Text>
								</View>
								<View style={styles.oneAddress}>
									<Text style={styles.txtAddress}>{this.props.objBookport.infoPointGroup ? this.props.objBookport.infoPointGroup.deviceName: null}</Text>
								</View>
							</View>
						</View>

						<View style={styles.btnToolContainer}>

							<View style={styles.btnToolLeft}>
								<SwitchSelector
									options={options}
									initial={0}
									onPress={this._handleSwitchBtn}
									textColor='#9EC9FF'
									buttonColor='#0B76FF'
									borderColor='#9EC9FF'
									hasPadding="true"
								/>
							</View>

							<View style={styles.btnToolRight}>
								{ this.props.objBookport.allowBookport 
									? 
										<TouchableOpacity
											style={styles.btnBookportActive}
											onPress={this._getLatlngDevice} 
										>
											<Text style={styles.txtBookportActive }>{strings('sale_new.bookport_map.book_port')}</Text>
										</TouchableOpacity> 
									: 
										<TouchableOpacity
											style={styles.btnBookport}
											disabled={true}
										>
											<Text style={styles.txtBookport}>{strings('sale_new.bookport_map.book_port')}</Text>
										</TouchableOpacity>
								}
							</View>
						</View>
					</View>
				</View>
				<PopupWarning ref="popup"/>
				<TechLoading visible={this.state.loadingVisible}/>
			</View>
		);
	}
}

BookPortAction.defaultProps = defaultProps;

export default connect(state => {
	return {
		Username : state.authReducer.Username,
		userInfo: state.authReducer.userInfo,
		objBookport: state.extraServiceInfoReducer.objBookport,
		RegistrationObj : state.extraServiceInfoReducer.formData,
	};
}, {
	loadMap, showPointGroup, changePointGroup, changeTypeBookport,
	regionBookport, updateInfoRegistration, saveLatLngDevice, clearContractTemp
})(BookPortAction);
