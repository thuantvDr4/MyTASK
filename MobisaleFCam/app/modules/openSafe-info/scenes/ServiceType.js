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
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PickerCLKMInput from 'app-libs/components/input/PickerCLKMInput';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
// COMPONENT
import FormDeviceList from '../components/FormDeviceList';
import FormIpList from '../components/FormIpList';
import mapServiceType from '../helpers/mapServiceType';
// API
import * as api from '../api';
// ACTION
import {actions as customerInfo} from '../';
const {nextStep, updateInfoRegistration} = customerInfo;

// STYLE
import moduleStyle from '../styles';
import ols from '../../../styles/Ola-style';
// CONSTANTS
import {INTERNET_ID} from '../../../config/constants';
import InputO from "../components/InputO";

const DIVICES = [
    {ID:'1', Name: 'Equipment 1', Price: 50, Number:1, ChangeNumber: 1},
    {ID:'2', Name: 'Equipment 2', Price: 50, Number:1, ChangeNumber: 1},
    {ID:'3', Name: 'Equipment 3', Price: 50, Number:1, ChangeNumber: 1},
    {ID:'4', Name: 'Equipment 4', Price: 50, Number:1, ChangeNumber: 1},
]

const DATA = {
    List: DIVICES,
    DeviceTotal: 200
}

const PACKAGE = [
    {ID:'1', Name: 'Safe 1', Price: 50, Number:1, ChangeNumber: 0},
    {ID:'2', Name: 'Safe 2', Price: 50, Number:1, ChangeNumber: 0},
]
const DATA_2 = {
    List: PACKAGE,
    DeviceTotal: 200
}

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
            showE: false,
            showI: false,
            loadingVisible: false
        };

    }

    isValidData() {
        const {data} = this.state;
        let errorList = [];

        // Check Service Type
        if (data.ServiceType == null) {
            this.refs['ServiceType'].setValid(false);

            errorList.push({
                name: 'ServiceType',
                msg: strings('dl.customer_info.service_type.err.ServiceType')
            });
        }
        else {
            this.refs['ServiceType'].setValid(true);
        }

        // Check Local Type
        if (data.LocalType == null) {
            this.refs['LocalType'].setValid(false);

            errorList.push({
                name: 'LocalType',
                msg: strings('dl.customer_info.service_type.err.LocalType')
            });
        }
        else {
            this.refs['LocalType'].setValid(true);
        }

        // Check CLKM
        if (data.Promotion == null) {
            this.refs['Promotion'].setValid(false);

            errorList.push({
                name: 'Promotion',
                msg: strings('dl.customer_info.service_type.err.Promotion')
            });
        }
        else {
            this.refs['Promotion'].setValid(true);
        }

        // Check Connection fee
        if (data.ConnectionFee == null) {
            this.refs['ConnectionFee'].setValid(false);

            errorList.push({
                name: 'ConnectionFee',
                msg: strings('dl.customer_info.service_type.err.ConnectionFee')
            });
        }
        else {
            this.refs['ConnectionFee'].setValid(true);
        }

        // Check Payment Method Per Month
        if (data.PaymentMethodPerMonth == null) {
            this.refs['PaymentMethodPerMonth'].setValid(false);

            errorList.push({
                name: 'PaymentMethodPerMonth',
                msg: strings('dl.customer_info.service_type.err.PaymentMethodPerMonth')
            });
        }
        else {
            this.refs['PaymentMethodPerMonth'].setValid(true);
        }


        // Check IP
        if (this.state.showI) {
            if (data.StaticIP == null || data.StaticIP.ListStaticIP == null || data.StaticIP.ListStaticIP.length === 0) {
                this.refs['IPType'].setValid(false);

                errorList.push({
                    name: 'IPType',
                    msg: strings('dl.customer_info.service_type.err.IpAdd')
                });
            }
            else {
                this.refs['IPType'].setValid(true);
            }
        }



        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    changeLocalType(selectItem) {

        if (selectItem == this.state.data.LocalType) {
            return;
        }

        this.setState({
            data: {
                ...this.state.data,
                LocalType: selectItem,
                Promotion: null,
                Device: {
                    List: [],
                    DeviceTotal: 0
                }
            }
        });
    }

    changePickerValue(name, selectItem) {

        const data = this.state.data;

        // Luon chọn INTERNET
        if (name === 'ServiceType' && selectItem && selectItem.findIndex(item => item.Id === INTERNET_ID.Id) < 0) {
            selectItem.unshift(INTERNET_ID);
        }

        if (name === 'ServiceType' && selectItem) {
            this.setState({
                ...this.state,
                showE: selectItem.find(item => item.Id === 2) !== undefined ? true : false,
                showI: selectItem.find(item => item.Id === 3) !== undefined ? true : false,
                data: {
                    ...data,
                    StaticIP: selectItem.find(item => item.Id === 3) !== undefined
                        ? data.StaticIP
                        : {
                            ListIP: null,
                            ListMonth: { Value: 1, Name: '1M' },
                            Total: null,
                            ListStaticIP: []
                        },
                    Device: selectItem.find(item => item.Id === 2) !== undefined
                        ? data.Device
                        : {
                            DeviceTotal: null,
                            List: []
                        }
                }
            })
        }

        //
        if (data[name] == selectItem) {
            return;
        }

        //
        if (name === 'Promotion') {
            data['Device'] = {
                List: [],
                DeviceTotal: 0
            };
        }

        //
        data[name] = selectItem;

        //
        setTimeout(() => {
            this.setState({
                data: data,
            });
        }, 50);
    }

    submitData(dataAmount) {

        // Xu ly data submit
        const { data, tabnav } = this.state;
        let RegistrationObj = {};

        RegistrationObj.SaleId              = this.props.SaleId;
        RegistrationObj.ListServiceType     = data.ServiceType;

        RegistrationObj.LocalType           = data.LocalType.Id;
        RegistrationObj.LocalTypeName       = data.LocalType.Name;

        RegistrationObj.PromotionId         = data.Promotion.Id;
        RegistrationObj.PromotionName       = data.Promotion.Name;
        RegistrationObj.PromotionDescription= data.Promotion.Description;
        RegistrationObj.MonthOfPrepaid      = data.Promotion.MonthOfPrepaid;

        RegistrationObj.ConnectionFee       = data.ConnectionFee.Id;

        RegistrationObj.PaymentMethodPerMonth     = data.PaymentMethodPerMonth.Id;
        RegistrationObj.PaymentMethodPerMonthName = data.PaymentMethodPerMonth.Name;

        RegistrationObj.ListDevice          = data.Device.List;
        RegistrationObj.ListStaticIP        = data.StaticIP.ListStaticIP;

        RegistrationObj.DeviceTotal         = dataAmount.DeviceTotal;
        RegistrationObj.Total               = dataAmount.Total;
        RegistrationObj.InternetTotal       = dataAmount.InternetTotal;
        RegistrationObj.StaticIPTotal       = dataAmount.StaticIPTotal;

        // dispatch redux
        this.props.updateInfoRegistration(RegistrationObj, () => {
            // Chuyen trang
            setTimeout(() => {
                this._loading(false);
                this.props.nextStep(tabnav);
                NavigationService.navigate('ciAmount');
            }, 0);
        });
    }

    _onNextStep() {
        if (! this.isValidData()) {
            return;
        }

        this._loading(true);
        //this.submitData(0)

        // Xu ly data submit
        const { data } = this.state;
        const { golbalData } = this.props;

        const formData = {
            LocationId:         this.props.LocationId,
            UserName:           this.props.Username,

            LocalType:          data.LocalType.Id,
            PromotionId:        data.Promotion.Id,
            MonthOfPrepaid:     data.Promotion.MonthOfPrepaid,
            ListDevice:         data.Device.List,
            ConnectionFee:      data.ConnectionFee.Id,
            ListStaticIP:       data.StaticIP.ListStaticIP,

            ObjId:              golbalData.ObjId,
            Contract:           golbalData.Contract,
            VAT:                golbalData.VAT,
            Total:              golbalData.Total,
            InternetTotal:      golbalData.InternetTotal,
            DeviceTotal:        golbalData.DeviceTotal,
            DepositFee:         golbalData.DepositFee
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

    _loading(isShow)
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
                    label = {strings('open_safe.service_type.form.listDevice_label')}
                    placeholder = {strings('open_safe.service_type.form.listDevice_placeholder')}
                    filterText = {strings('open_safe.service_type.form.listDevice_filterText')}
                    unitLabel = {strings('open_safe.service_type.form.listDevice_unitPrice')}
                    amountLabel = {strings('open_safe.service_type.form.listDevice_amount')}
                    getOptionData = {api.loadDeviceList}
                    params = {{
                        LocationId: this.props.LocationId,
                        MonthOfPrepaid: data.Promotion ? data.Promotion.MonthOfPrepaid : null,
                        LocalType: data.LocalType ? data.LocalType.Id : null
                    }}
                    allowRefresh={false}
                    value = {DATA}
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
                    ref={'deviceType'}
                    label = {strings('open_safe.service_type.form.listPackage_label')}
                    placeholder = {strings('open_safe.service_type.form.listPackage_placeholder')}
                    filterText = {strings('open_safe.service_type.form.listPackage_filterText')}
                    unitLabel = {strings('open_safe.service_type.form.listPackage_unitPrice')}
                    amountLabel = {strings('open_safe.service_type.form.listPackage_amount')}
                    getOptionData = {api.loadDeviceList}
                    params = {{
                        LocationId: this.props.LocationId,
                        MonthOfPrepaid: data.Promotion ? data.Promotion.MonthOfPrepaid : null,
                        LocalType: data.LocalType ? data.LocalType.Id : null
                    }}
                    allowRefresh={false}
                    value = {DATA_2}
                    onChange = {(selectedItem) => this.changePickerValue('Device', selectedItem)}
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
    const RegistrationObj = state.saleNewReducer.RegistrationObj;

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
