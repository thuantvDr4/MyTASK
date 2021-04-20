// LIB
import React, { Component } from 'react';
import {
    Text, View, TouchableOpacity, TouchableHighlight,
    Alert, Picker, KeyboardAvoidingView, ScrollView, Platform
} from 'react-native';
import FusedLocation from "react-native-fused-location";
import {strings} from 'locales/i18n';
import {connect} from "react-redux";
// ACTION
import {actions} from '../';
const { changeTypeBookport, updateInfoRegistration, saveLatLngDevice, clearContractTemp } = actions;
// API
import * as api from "../api";
// LIB CUSTOM
import HeaderBackButtonBookport from '../components/HeaderBackButtonBookport';
import NavigationService from 'app-libs/helpers/NavigationService';
import TechLoading from 'app-libs/components/TechLoading';
import TextInput from 'app-libs/components/input/TextInput';
import TextInputVund from 'app-libs/components/input/TextInputVund';
import ButtonBack from '../../../libs/components/ButtonBack.js';
import PopupWarning from 'app-libs/components/PopupWarning';

// CONST
const defaultProps = {
    enableHack: false,
    geolocationOptions: { enableHighAccuracy: true, timeout: 40000, maximumAge: 1000 },
};

// STYLE
import styles from '../BookPortSuccess.styles';

class BookPortCab extends React.PureComponent {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('sale_new.bookport_cab.book_port'),
            // headerLeft: <ButtonBack navigation={navigation} />,
            headerLeft: <HeaderBackButtonBookport navigation={navigation} />
        };
    };

    constructor(props) {
        super(props);

        this.state = {
            Indoor : null,
            OutDoor : null,
            loadingVisible : false,
        };

        this._handleChangeCabIndoor = this._handleChangeCabIndoor.bind(this);
        this._handleChangeCabOutdoor = this._handleChangeCabOutdoor.bind(this);
        this._handleSubmit = this._handleSubmit.bind(this);

        this._handleBookportSuccess = this._handleBookportSuccess.bind(this);
        this._handleManualBookportFail = this._handleManualBookportFail.bind(this);
        this._getLatlngDevice = this._getLatlngDevice.bind(this);
        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this._loading = this._loading.bind(this);
    }

    componentDidMount() {
        this.setState({
            ...this.state,
            Indoor : this.props.RegistrationObj.Indoor.toString(),
            OutDoor : this.props.RegistrationObj.OutDoor.toString()
        });
    }

    /**
     * Change text
     * @private
     */
    _handleChangeCabIndoor(text) {

        this.setState({
            ...this.state,
            Indoor : text
        });
    }

    /**
     * Change text
     * @private
     */
    _handleChangeCabOutdoor(text) {

        this.setState({
            ...this.state,
            OutDoor : text
        });
    }

    /**
     * valid data
     * @private
     */
    _isValidData() {

        const data = this.state;
        let errorList = [];

        // Check INDOOR
        if (! data.Indoor) {
            this.refs['indoor_m'].setValid(false);

            errorList.push({
                name: 'indoor_m',
                msg: strings('dl.sale_new.bookport_cab.err.indoor')
            });
        }
        else {
            this.refs['indoor_m'].setValid(true);
        }

        // Check OUTDOOR
        if (! data.OutDoor) {
            this.refs['outdoor_m'].setValid(false);

            errorList.push({
                name: 'outdoor_m',
                msg: strings('dl.sale_new.bookport_cab.err.outdoor')
            });
        }
        else {
            this.refs['outdoor_m'].setValid(true);
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
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
            FusedLocation.getFusedLocation().then((position) => {

                const latlngDevice = position.latitude + ',' + position.longitude;
                FusedLocation.stopLocationUpdates();
                this.props.saveLatLngDevice(latlngDevice);

                // SUBMIT
                this._handleSubmit(latlngDevice);
            });

        } else {

            navigator.geolocation.getCurrentPosition((position) => {

                const latlngDevice = position.coords.latitude + ',' + position.coords.longitude;
                this.props.saveLatLngDevice(latlngDevice);

                // SUBMIT
                this._handleSubmit(latlngDevice);
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
     * Submit bookport
     * @private
     */
    _handleSubmit(latlngDevice) {

        if (! this._isValidData()) {
            return;
        }

        //show loading
        this._loading(true);

        try {
            const infoBookport = {
                Username : this.props.Username,
                LocationId: this.props.RegistrationObj.LocationId,
                WardId : this.props.RegistrationObj.WardId,
                DeviceName : this.props.objBookport.infoPointGroup.deviceName,
                LengthSurvey_OutDoor : parseFloat(this.state.OutDoor),
                LengthSurvey_InDoor : parseFloat(this.state.Indoor),
                typeOfNetworkInfrastructure : this.props.objBookport.networkType,
                BookportIdentityID: this.props.RegistrationObj.BookportIdentityId,
                RegCode : this.props.RegistrationObj.RegCode,
                ContractTemp : this.props.RegistrationObj.ContractTemp ,
                isRecovery : this.props.RegistrationObj.ContractTemp ? 1:0,
                Latlng : "" + this.props.objBookport.regionBookport.latitude + ',' + this.props.objBookport.regionBookport.longitude,
                latitude : "" + this.props.objBookport.regionBookport.latitude,
                longitude : "" + this.props.objBookport.regionBookport.longitude,
            };

            if (this.props.RegistrationObj.RegId) {

                infoBookport.LatlngDevice = latlngDevice;
            }

            //console.log(infoBookport)
            api.manualBookport(infoBookport, (success, result, error)=>{
                if (success) {
                    this._handleBookportSuccess(result);
                } else {
                    this.props.clearContractTemp();
                    this._handleManualBookportFail(error)
                }
            });
        }
        catch (err){
            this._errorMsg(msg.message);
        }

    }

    /**
     * XU ly khi bookport thanh cong
     * @private
     */
    _handleBookportSuccess(result) {

        this._loading(true);
        
        // neu ton tai RegId => dang cap nhat => chuyen qua man hinh chi tiet TTKH
        if (this.props.RegistrationObj.RegId) {

            NavigationService.navigate('lciDetailCustomer', {
                RegID : this.props.RegistrationObj.RegId,
                RegCode : this.props.RegistrationObj.RegCode
            });
        } else {

            const infoBookportSuccess = {
                ContractTemp : result[0].BookPortManual.ContractTemp,
                ODCCableType : result[0].BookPortManual.ODCCableType,
                BookportIdentityID : result[0].BookportIdentityID,
                GroupPoints : result[0].BookPortManual.Name,
                Latlng : "" + this.props.objBookport.regionBookport.latitude + ',' + this.props.objBookport.regionBookport.longitude,
                Lat : "" + this.props.objBookport.regionBookport.latitude,
                Lng : "" + this.props.objBookport.regionBookport.longitude,
                // LatlngDevice : this.props.objBookport.regionGps,
                LatlngDevice : this.props.RegistrationObj.LatlngDevice,
                Indoor : this.state.Indoor,
                OutDoor: this.state.OutDoor
            };

            this.props.updateInfoRegistration(infoBookportSuccess, () => {

                setTimeout(() => {
                    this._loading(false);
                    NavigationService.navigate('CustomerInfo');
                }, 2000);

            });
        }
    }

    /**
     * XU ly khi bookport manual khong thanh cong
     * @private
     */
    _handleManualBookportFail(error) {

        this._loading(false);

        setTimeout(() => {

            // BOOKPORT MANUAL FAIL
            if (error.Code === -107 || error.Code === -108) {

                Alert.alert(
                    strings('sale_new.bookport_map.notification'),
                    error.message,
                    [
                        {
                            text: strings('sale_new.bookport_map.agree'),
                        }
                    ],
                    { cancelable: false }
                )
                
            } else {
                // BOOKPORT MANUAL THANH CONG
                // 
                // -> NẾU CÓ REGCODE 
                // -> ( TRUONG HOP NAY LA SUA PORT LAI TU CAP NHAT PHIEU THONG TIN KHACH HANG )
                if (this.props.RegistrationObj.RegCode) {

                    Alert.alert(
                        strings('sale_new.bookport_map.notification'),
                        error.message,
                        [
                            {
                                text: strings('sale_new.bookport_map.book_port'),
                                onPress: () => {
                                    this.props.changeTypeBookport(0, 1);
                                    NavigationService.navigate('BookPort');
                                }
                            }
                        ],
                        { cancelable: false }
                    )
                } else {
                    // -> ( TRUONG HOP NAY LA BOOK PORT MOI )
                    Alert.alert(
                        strings('sale_new.bookport_map.notification'),
                        strings('dl.sale_new.bookport_map.manual_bookport_fail'),
                        
                        // KIEM TRA XEM BOOKPORT MOI HOAN TOAN HAY TU KHACH HANG TIEM NANG
                        this._checkPotential(this.props.RegistrationObj.PotentialObjID),
                        { cancelable: false }
                    )
                }
            }
        }, 100);
    }

    /**
     * Kiem tra xem bookport moi hay bookport tu khach hang tiem nang de show thong bao
     * @param PotentialObjID
     * @private
     */
    _checkPotential(PotentialObjID) {
        
        const noPo = [
            { 
                text: strings('sale_new.bookport_map.create_potential_customer'),
                onPress: () => NavigationService.navigateBackHome('pcAddCustomer', {bookportForward : true})
            }, { 
                text: strings('sale_new.bookport_map.book_port'),
                onPress: () => {
                    this.props.changeTypeBookport(0, 1);
                    NavigationService.navigate('BookPort');
                }
            }
        ];
        
        const withPo = [
            { 
                text: strings('sale_new.bookport_map.book_port'), 
                onPress: () => { 
                    this.props.changeTypeBookport(0, 1); 
                    NavigationService.navigate('BookPort');
                }
            }
        ];
        
        return !PotentialObjID ? noPo : withPo;
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
            <ScrollView contentContainerStyle={ styles.container } keyboardShouldPersistTaps="handled" scrollEnabled={false}>
                <View>
                    <View style={[styles.title, {marginTop: 0} ]}>
                        <Text style={styles.txtTitle}>{strings('sale_new.bookport_cab.info_point_group')}</Text>
                    </View>
                    {this.props.RegistrationObj.RegCode ?
                    <View style={styles.oneInfo}>
                        <Text style={styles.infoTitle}>{strings('sale_new.bookport_cab.customer_information')}</Text>
                        <Text style={styles.infoValue}>{this.props.RegistrationObj.RegCode ? this.props.RegistrationObj.RegCode : null}</Text>
                    </View>
                    : null}
                    <View style={styles.oneInfo}>
                        <Text style={styles.infoTitle}>{strings('sale_new.bookport_cab.point_group')}</Text>
                        <Text style={styles.infoValue}>{this.props.objBookport.infoPointGroup ? this.props.objBookport.infoPointGroup.deviceName : null}</Text>
                    </View>
                </View>
                
                <View style={styles.title}>
                    <Text style={styles.txtTitle}>{strings('sale_new.bookport_cab.cab_info')}</Text>
                </View>

                <KeyboardAvoidingView style={styles.bodyContainer} behavior="padding" enable>
                    <View style={styles.oneCab}>
                        <TextInputVund
                            keyboardType='numeric'
                            ref="indoor_m"
                            label = { strings('sale_new.bookport_cab.indoor_m') }
                            placeholder = { strings('sale_new.bookport_cab.length_indoor') }
                            onChangeText={this._handleChangeCabIndoor}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.state.Indoor ? this.state.Indoor : null}
                            textInputStyle={{width:'70%'}}
                        />
                        <TextInputVund
                            keyboardType='numeric'
                            ref="outdoor_m"
                            label = { strings('sale_new.bookport_cab.outdoor_m') }
                            placeholder = { strings('sale_new.bookport_cab.length_outdoor') }
                            onChangeText={this._handleChangeCabOutdoor}
                            underlineColorAndroid='rgba(0,0,0,0)'
                            value={this.state.OutDoor ? this.state.OutDoor : null}
                            textInputStyle={{width:'70%'}}
                        />
                    </View>
                </KeyboardAvoidingView>

                <View style={styles.footerBtnContainer}>
                    <TouchableOpacity style={styles.btnBookport} onPress={this._getLatlngDevice}>
                        <Text style={styles.txtBookport}>{ strings('sale_new.bookport_cab.next') }</Text>
                    </TouchableOpacity>
                </View>

                <TechLoading visible={this.state.loadingVisible}/>
                <PopupWarning ref="popup"/>
            </ScrollView>
        );
    }
}

BookPortCab.defaultProps = defaultProps;

export default connect((state) => {
    // console.log(state);
    return {
        objBookport: state.saleNewReducer.objBookport,
        RegistrationObj : state.saleNewReducer.RegistrationObj,
        userInfo: state.authReducer.userInfo,
        Username : state.authReducer.Username,
    };
}, { changeTypeBookport, updateInfoRegistration, saveLatLngDevice, clearContractTemp })(BookPortCab);

