// LIB
import React, { Component } from 'react';
import {KeyboardAvoidingView, View, Text, ScrollView, StyleSheet, Platform} from 'react-native';
import {strings} from 'locales/i18n';

// REDUX
import {connect} from 'react-redux';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import PickerMultiSearchInput from 'app-libs/components/input/PickerMultiSearchInput';
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import TextInput from 'app-libs/components/input/TextInput';
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


/**
 * Man hinh chon loai hinh dich vu cua tao phieu dang ky
 *
 * @author DaiDP
 * @since Aug, 2018
 * @description extends ThuanDD3, 2018 - 2020
 */
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

        // Check Equip
        // if (this.state.showE) {
        //     if (data.Device == null || data.Device.List.length === 0) {
        //         this.refs['deviceType'].setValid(false);

        //         errorList.push({
        //             name: 'deviceType',
        //             msg: strings('dl.customer_info.service_type.err.Device')
        //         });
        //     }
        //     else {
        //         this.refs['deviceType'].setValid(true);
        //     }
        // }


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

    _renderEquipment() {
        const { data } = this.state;
        const showE = this.state.showE;

        return (!showE ? null :
            <View style={[styles.container]}>
                <View style={[styles.seperator2]}></View>

                <Text style={[moduleStyle.headline, ols.cl444, ols.fs14, ols.fw500, ols.clBlue]}>
                    {strings('customer_info.service_type.device')}
                </Text>

                <FormDeviceList
                    ref={'deviceType'}
                    label = {strings('customer_info.service_type.form.listDevice_label')}
                    placeholder = {strings('customer_info.service_type.form.listDevice_placeholder')}
                    filterText = {strings('customer_info.service_type.form.listDevice_filterText')}
                    unitLabel = {strings('customer_info.service_type.form.listDevice_unitPrice')}
                    amountLabel = {strings('customer_info.service_type.form.listDevice_amount')}
                    getOptionData = {api.loadDeviceList}
                    params = {{
                        LocationId: this.props.LocationId,
                        MonthOfPrepaid: data.Promotion ? data.Promotion.MonthOfPrepaid : null,
                        LocalType: data.LocalType ? data.LocalType.Id : null
                    }}
                    allowRefresh={false}
                    value = {data.Device}
                    onChange = {(selectedItem) => this.changePickerValue('Device', selectedItem)}
                />
            </View>
        )
    }

    _renderIP() {
        const { data } = this.state;
        const showI = this.state.showI;

        return (!showI ? null :
            <View style={[styles.container, ols.mgt05]}>
                <View style={[styles.seperator2]}></View>

                <Text style={[moduleStyle.headline, ols.cl444, ols.fs14, ols.fw500, ols.clBlue]}>
                    {strings('customer_info.service_type.ipAdd')}
                </Text>

                <FormIpList
                    ref="IPType"
                    labelIp = {strings('customer_info.service_type.form.listIP_IPlabel')}
                    placeholderIp = {strings('customer_info.service_type.form.listIP_IPplaceholder')}
                    filterTextIp = {strings('customer_info.service_type.form.listIP_IPfilterText')}
                    optionDataIp = {api.loadIPList}

                    labelMo = {strings('customer_info.service_type.form.listIP_Monthlabel')}
                    placeholderMo = {strings('customer_info.service_type.form.listIP_Monthplaceholder')}
                    filterTextMo = {strings('customer_info.service_type.form.listIP_MonthfilterText')}
                    optionDataMo = {api.loadMonthList}

                    priceLabel = {strings('customer_info.service_type.form.listIP_pricelabel')}
                    allowRefresh={false}
                    value = {data.StaticIP}
                    onChange = {(selectedItem) => this.changePickerValue('StaticIP', selectedItem)}
                />

            </View>
        )
    }

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
                            {
                                // SERVICES TYPE
                            }
                            <View style={[styles.container, ols.mgt15, ]}>
                                <PickerMultiSearchInput
                                    ref="ServiceType"
                                    label = {strings('customer_info.service_type.form.serviceType_label')}
                                    placeholder = {strings('customer_info.service_type.form.serviceType_placeholder')}
                                    filterText = {strings('customer_info.service_type.form.serviceType_filterText')}
                                    getOptionData = {api.loadServiceType}
                                    params = {{RegType: 1}}
                                    allowRefresh={false}
                                    value = {data.ServiceType}
                                    onChange = {(selectedItem) => this.changePickerValue('ServiceType', selectedItem)}
                                />
                            </View>

                            <View style={[styles.seperator2]}></View>

                            {
                                // INTERNET
                            }
                            <View style={[styles.container]}>
                                <Text style={[moduleStyle.headline, ols.cl444, ols.fs14, ols.fw500, ols.clBlue]}>
                                    {strings('customer_info.service_type.internet')}
                                </Text>
                                <PickerSearchInput
                                    ref="LocalType"
                                    label = {strings('customer_info.service_type.form.localType_label')}
                                    placeholder = {strings('customer_info.service_type.form.localType_placeholder')}
                                    filterText = {strings('customer_info.service_type.form.localType_filterText')}
                                    getOptionData = {api.loadLocalTypeList}
                                    params = {{Username: this.props.Username, Kind: this.props.networkType}}
                                    allowRefresh={false}
                                    value = {data.LocalType}
                                    onChange = {this.changeLocalType.bind(this)}
                                />

                                {
                                    // PREPAID PROMOTION
                                }
                                <Text style={[moduleStyle.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>{strings('customer_info.service_type.promotion')}</Text>
                                <PickerCLKMInput
                                    ref="Promotion"
                                    label = {strings('customer_info.service_type.form.promotion_label')}
                                    placeholder = {strings('customer_info.service_type.form.promotion_placeholder')}
                                    filterText = {strings('customer_info.service_type.form.promotion_filterText')}
                                    seletedText = {strings('customer_info.service_type.form.promotion_seletedText')}
                                    getOptionData = {api.loadPromotionList}
                                    params = {{Username: this.props.Username, LocationID: this.props.LocationId, LocalTypeID: data.LocalType ? data.LocalType.Id : null}}
                                    allowRefresh={false}
                                    value = {data.Promotion}
                                    onChange = {(selectedItem) => this.changePickerValue('Promotion', selectedItem)}
                                />
                                <PickerSearchInput
                                    ref="ConnectionFee"
                                    label = {strings('customer_info.service_type.form.connectionFee_label')}
                                    placeholder = {strings('customer_info.service_type.form.connectionFee_placeholder')}
                                    filterText = {strings('customer_info.service_type.form.connectionFee_filterText')}
                                    getOptionData = {api.loadConnectionFeeList}
                                    params = {{LocationId: this.props.LocationId}}
                                    allowRefresh={false}
                                    value = {data.ConnectionFee}
                                    onChange = {(selectedItem) => this.changePickerValue('ConnectionFee', selectedItem)}
                                />

                                {
                                    // BOOKPORT
                                    //     <Text style={[moduleStyle.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>{strings('customer_info.service_type.bookport')}</Text>
                                    // <TextInput
                                    //     label="POP"
                                    //     editable={false}
                                    //     textInputStyle={{fontSize: 12,}}
                                    //     value={data.GroupPoints}
                                    // />
                                }


                                {
                                    // PAYMENT
                                }
                                <Text style={[moduleStyle.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>{strings('customer_info.service_type.paymentMethodPerMonth')}</Text>
                                <PickerSearchInput
                                    ref="PaymentMethodPerMonth"
                                    label = {strings('customer_info.service_type.form.paymentMethodPerMonth_label')}
                                    placeholder = {strings('customer_info.service_type.form.paymentMethodPerMonth_placeholder')}
                                    filterText = {strings('customer_info.service_type.form.paymentMethodPerMonth_filterText')}
                                    getOptionData = {api.loadPaymentMethodPerMonthList}
                                    params = {{Username: this.props.Username}}
                                    allowRefresh={false}
                                    value = {data.PaymentMethodPerMonth}
                                    onChange = {(selectedItem) => this.changePickerValue('PaymentMethodPerMonth', selectedItem)}
                                />
                            </View>

                            {
                                // EQUIPMENTS
                                this._renderEquipment()
                            }


                            {
                                // IP
                                this._renderIP()
                            }
                        </View>

                        <View style={{marginTop: 10}}>
                            <View style={styles.buttonContainer}>
                                <ButtonElement
                                    title={strings('customer_info.service_type.form.btnNext')}
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


const styles = StyleSheet.create({
    scrollContainer: {

    },
    container: {
        paddingHorizontal: 24
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
    }
});
