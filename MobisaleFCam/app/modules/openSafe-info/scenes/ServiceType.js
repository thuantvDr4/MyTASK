/**
 * Man hinh chon loai hinh dich vu cua tao phieu dang ky
 *
 * @author DaiDP
 * @since Aug, 2018
 * @description extends ThuanDD3, 2018 - 2020
 */

// LIB
import React, { Component } from 'react';
import {KeyboardAvoidingView, View, Text, ScrollView, StyleSheet, Platform} from 'react-native';
import {strings} from 'locales/i18n';

// REDUX
import {connect} from 'react-redux';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
// COMPONENT
import FormDeviceList from '../components/FormDeviceList';
import mapServiceType from '../helpers/mapServiceType';
import {makeDataDevice_OS} from "../helpers/mixData";
// API
import * as api from '../api';
// ACTION
import {actions as customerInfo} from '../';
const {nextStep, updateInfoRegistration} = customerInfo;

// STYLE
import moduleStyle from '../styles';
import ols from '../../../styles/Ola-style';
// CONSTANTS
import InputO from "../components/InputO";


/*
* CLASS
* */
class ServiceType extends Component
{
    constructor(props) {
        super(props);

        this.state = {
            tabnav: {
                step: 2,
                nextScreen: 'ciAmount'
            },
            data: this.props.FormData,
            loadingVisible: false
        };
    }

    /*
    * Check valid
    * */
    isValidData =()=> {
        const {data} = this.state;
        let errorList = [];

        // Check deviceType
        if (data.Device.List.length === 0) {
            this.refs['deviceType'].setValid(false);

            errorList.push({
                name: 'deviceType',
                msg: strings('dl.open_safe.customer_info.service_type.equipment')
            });
        }
        else {
            this.refs['deviceType'].setValid(true);
        }

        // check Package-type
        if (data.Package.List.length === 0) {
            this.refs['packageType'].setValid(false);

            errorList.push({
                name: 'packageType',
                msg: strings('dl.open_safe.customer_info.service_type.package')
            });
        }
        else {
            this.refs['packageType'].setValid(true);
        }

        //
        if (errorList.length === 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }


    /*
    * changePickerValue
    * */
    changePickerValue =(name, selectItem)=>{
        //
        const data = this.state.data;
        //
        data[name] = selectItem;

        //
        setTimeout(() => {
            this.setState({
                data: data,
            });
        }, 50);
    }


    /*
 * changePickerValue
 * */
    changePickerValue_2 =(name, selectItem)=>{
        //
        console.log('...no goi cai nay chưa', selectItem)

    }


    /*
    * submitData
    * */
    submitData =(dataAmount)=> {
        // Xu ly data submit
        const { data, tabnav } = this.state;
        let RegistrationObj = {};

        RegistrationObj.SaleId              = this.props.SaleId;

        RegistrationObj.ListOSDevice        = makeDataDevice_OS(data.Device.List);
        RegistrationObj.DeviceTotal         = data.Device.DeviceTotal;

        RegistrationObj.ListOSPackage          = makeDataDevice_OS(data.Package.List);
        RegistrationObj.PackageTotal         = data.Package.DeviceTotal;

        RegistrationObj.Total               = dataAmount.Total;

        // dispatch redux
        this.props.updateInfoRegistration(RegistrationObj, () => {
            // Chuyen trang
            setTimeout(() => {
                this._loading(false);
                this.props.nextStep(tabnav);
                //goto
                NavigationService.navigate('openSafe_ciAmount');
            }, 0);
        });
    }


    /*
    *
    * Handle nut-NEXT
    * */
    _onNextStep =()=> {
        if (! this.isValidData() ) {
            return;
        }

        this._loading(true);
        //this.submitData(0)

        // Xu ly data submit
        const { data } = this.state;
        const { golbalData } = this.props;

        const formData = {
            "VAT": golbalData.VAT? golbalData.VAT : 0,
            "ListOSDevice": makeDataDevice_OS(data.Device.List),
            "ListOSPackage": makeDataDevice_OS(data.Package.List),
            "Total": golbalData.Total,
        };


        api.caclRegistrationTotal(formData, (isSuccess, data, msg) => {
            // Xu ly thanh cong
            if (isSuccess) {

                return this.submitData(data);
            }

            // Goi API loi
            this._loading(false);

            // display error
            this.refs['popup'].getWrappedInstance().show(msg.message);
        });
    }

    _loading =(isShow)=>
    {
        this.setState({
            loadingVisible: isShow
        });
    }

    /*
    * _renderEquipment
    * */
    _renderEquipment =()=> {
        const { data } = this.state;

        return (
            <View style={[styles.equipment_ctn]}>
                <Text style={[moduleStyle.headline, ols.cl444, ols.fs14, ols.fw500, ols.clBlue]}>
                    {strings('open_safe.service_type.device')}
                </Text>

                <FormDeviceList
                    ref={'deviceType'}
                    isMultiChoose={ true }
                    label = {strings('open_safe.service_type.form.listDevice_label')}
                    placeholder = {strings('open_safe.service_type.form.listDevice_placeholder')}
                    filterText = {strings('open_safe.service_type.form.listDevice_filterText')}
                    unitLabel = {strings('open_safe.service_type.form.listDevice_unitPrice')}
                    amountLabel = {strings('open_safe.service_type.form.listDevice_amount')}
                    getOptionData = {api.loadDeviceList}
                    params = {null}
                    allowRefresh={false}
                    value = {data.Device}
                    onChange = {(selectedItem) => this.changePickerValue('Device', selectedItem)}
                />
            </View>
        )
    }



    /*
* _renderPackages
* */
    _renderPackages =()=> {
        const { data } = this.state;

        return (
            <View style={[styles.equipment_ctn]}>
                <Text style={[moduleStyle.headline, ols.cl444, ols.fs14, ols.fw500, ols.clBlue]}>
                    {strings('open_safe.service_type.package')}
                </Text>

                <FormDeviceList
                    ref={'packageType'}
                    isMultiChoose = {false}
                    label = {strings('open_safe.service_type.form.listPackage_label')}
                    placeholder = {strings('open_safe.service_type.form.listPackage_placeholder')}
                    filterText = {strings('open_safe.service_type.form.listPackage_filterText')}
                    unitLabel = {strings('open_safe.service_type.form.listPackage_unitPrice')}
                    amountLabel = {strings('open_safe.service_type.form.listPackage_amount')}
                    getOptionData = {api.loadPackageList}
                    params = {null}
                    allowRefresh={false}
                    value = {data.Package}
                    onChange = {(selectedItem) => this.changePickerValue('Package', selectedItem)}
                />

            </View>
        )
    }


    /*
    * RENDER
    *
    * */
    render() {
        const { data } = this.state;

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ios: 70, android: 0})}
                behavior= {(Platform.OS === 'ios')? "padding" : null}
                style={[ols.container_keyboard]} >
                <ScrollView
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >

                    <View style={[ols.inner_scrollview, ols.bgw, {paddingHorizontal: 0, justifyContent: 'space-between'}]} >
                        <View>
                            {/*...Service-name...*/}
                            <View style={[styles.container, ols.mgt15, ]}>
                                <InputO
                                    ref="ServiceType"
                                    label = {strings('open_safe.service_type.form.serviceType_label')}
                                    style={[styles.textInput, ols.fw500, ols.txtR]}
                                    placeholder={''}
                                    placeholderTextColor='#444444'
                                    textAlign={'right'}
                                    autoCapitalize={'none'}
                                    returnKeyType={'done'}
                                    autoCorrect={false}
                                    value={'openSafe'}
                                    editable={false}
                                />
                            </View>

                            <View style={[styles.seperator2]}/>
                            {
                                // EQUIPMENTS
                                this._renderEquipment()
                            }

                            {// PACKAGES
                                this._renderPackages()
                            }

                        </View>

                        <View style={{marginTop: 10}}>
                            <View style={styles.buttonContainer}>
                                <ButtonElement
                                    title={strings('open_safe.service_type.form.btnNext')}
                                    onPress={this._onNextStep.bind(this)}
                                />
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </KeyboardAvoidingView>
        );
    }
}

export default connect((state) => {
    const RegistrationObj = state.saleNewReducer.openSafeObj;

    console.log('openSafe-->reducer--serviceType-->', RegistrationObj);

    return {
        SaleId: state.authReducer.userInfo.SaleId,
        Username: state.authReducer.userInfo.UserName,
        LocationId: RegistrationObj.LocationId,
        FormData: mapServiceType(RegistrationObj),
        golbalData: {
            ObjId: RegistrationObj.ObjId,
            Contract: RegistrationObj.Contract,
            VAT: RegistrationObj.VAT,
            Total: RegistrationObj.Total,
            InternetTotal: RegistrationObj.InternetTotal,
            DeviceTotal: RegistrationObj.DeviceTotal,
            DepositFee: RegistrationObj.DepositFee
        },
        networkType: state.saleNewReducer.objBookport.networkType
    }

}, {nextStep, updateInfoRegistration})(ServiceType);


/*
* Styles
* */
const styles = StyleSheet.create({
    scrollContainer: {

    },
    container: {
        paddingHorizontal: 24,
        paddingTop: 25
    },
    equipment_ctn:{
        paddingHorizontal: 24,
        paddingTop: 12
    },
    buttonContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    seperator: {
        borderTopColor: '#C2D0E2', borderTopWidth: 2,
        marginTop: 5, marginBottom: 10,
    },
    seperator2: {
        borderTopColor: '#C2D0E2', borderTopWidth: 1,
        marginTop: 5, marginBottom: 10,
    },
    textInput: {
        height: 40,
        paddingRight: 12,
        paddingLeft: 12,
        fontSize: 12,
        borderColor: 'transparent',
        borderWidth: 0,
        color: '#444444',
    },
});
