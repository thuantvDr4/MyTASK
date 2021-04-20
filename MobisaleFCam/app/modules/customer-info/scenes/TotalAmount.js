/**
 * Màn hình tổng tiền
 * @uthor ThuanDinh
 * @since Aug, 2018
 */

//  LIB
import React, { Component } from 'react';
import { KeyboardAvoidingView, View, Image, Text, ScrollView, Platform } from 'react-native';
import { strings } from 'locales/i18n';

// TIME
import moment from 'moment';

// API
import * as api from '../api';

// REDUX
import { connect } from 'react-redux';

// ACTION
import { actions as customerInfo } from '../';
const { submitCreateTTKH } = customerInfo;
const { updateInfoRegistration } = customerInfo;

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import ModalPicker from 'app-libs/components/ModalPicker';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';

// COMPONENT
import ButtonCreateInfo from '../components/ButtonCreateInfo';

// HELPER
import mapTotalType from '../helpers/mapTotalType';

// STYLE
import styles from '../styles';
import ols from '../../../styles/Ola-style';
import InputO from "../components/InputO";


class TotalAmount extends Component {

    constructor(props) {
        super(props);

        this.state = {
            dataTemp: {
                step: 3,
            },
            data: this.props.FormData,
            dataAPI: {
                apiDeposit: [],
                apiVAT: [],
            },
            loadingVisible: false,
            disableButton : false,
        };

    }


    /**
     * MOUNT Process API
     */
    componentDidMount() {


        // MOUNT DATA AGAIN
        this.props.navigation.addListener('willFocus', () => {

            // GET API
            this._getDeposit();

            // this.setState({
            //     ...this.state,
            //     data: {
            //         ...this.props.FormData,
            //         ListGift: this.state.data.ListGift ? this.props.FormData.ListGift : this.state.data.ListGift,
            //         DepositFee: this.state.data.DepositFee != 0 && !this.state.data.DepositFee ? this.props.FormData.DepositFee : this.state.data.DepositFee,
            //         VAT: this.state.data.VAT != 0 && !this.state.data.VAT ? this.props.FormData.VAT : this.state.data.VAT,
            //         // Total: this.state.data.Total === this.props.FormData.Total ? this.props.FormData.Total : this.state.data.Total,
            //     },
            //     AllData: this.props.AllData,
            // });
        });
    }

    /**
     * MOUNT Received Props
     */
    componentWillReceiveProps(nextProps) {

        let newState = this.state;

        // console.log("------------------");
        // console.log("------------------ nextProps", nextProps.FormData);
        // console.log("------------------ state", this.state.data);
        // console.log("------------------");

        // Data if change because merge to contructor not update
        if (nextProps.FormData != this.state.data) {

            newState.data.Total = nextProps.FormData.Total;
            newState.data.InternetTotal = nextProps.FormData.InternetTotal,
            newState.data.DeviceTotal = nextProps.FormData.DeviceTotal,
            newState.data.StaticIPTotal = nextProps.FormData.StaticIPTotal,
            newState.data.ConnectionFee = nextProps.FormData.ConnectionFee
        }

        this.setState(newState);
    }

    /**
     * SELECT CHANGE TYPE
     * @param
     * @private
     */
    _onChangeSel(value, kind) {

        switch (kind) {
            case 'gifts':

                // Nếu bỏ không chọn quà
                if (value.Code < 0) {
                    value = null;
                }

                this.setState({
                    ...this.state,
                    data: {
                        ...this.state.data,
                        ListGift: value,
                    }
                }, () => {
                    this._calcTotalAmount();
                });

                break;

            case 'depo':
                this.setState({
                    ...this.state,
                    data: {
                        ...this.state.data,
                        DepositFee: parseInt(value.Name),
                    }
                }, () => {
                    this._calcTotalAmount();
                });

                break;

            case 'vat':
                this.setState({
                    ...this.state,
                    data: {
                        ...this.state.data,
                        VAT: parseInt(value.Name),
                        KhmerName: parseInt(value.Name) > 0? this.state.data.KhmerName : ''
                    }
                }, () => {
                    this._calcTotalAmount();
                });
                break;

            default:
                break;
        }
    }

    /*
    * _onChangeText
    * */
     _onChangeText =(key, value)=>{
         //
         this.setState({
             ...this.state,
             data: {
                 ...this.state.data,
                 [key]: value,
             }
         }, () => {
            // console.log('----state.data =', this.state.data)
         });
    }




    /**
     * VALIDATE FORM
     */
    isValidData() {
        const { data } = this.state;
        let errorList = [];

        // Check DepositFee
        if (data.DepositFee == null) {
            this.refs['DepositFeeType'].setValid(false);

            errorList.push({
                name: 'DepositFeeType',
                msg: strings('dl.customer_info.total.err.DepositFeeType')
            });
        } else {
            this.refs['DepositFeeType'].setValid(true);
        }
        // Check VAT
        if (data.VAT === null) {
            this.refs['vatType'].setValid(false);

            errorList.push({
                name: 'vatType',
                msg: strings('dl.customer_info.total.err.VatType')
            });
        } else {
            this.refs['vatType'].setValid(true);
        }

        // Check Khmer-Name
        if (  data.VAT !== null && data.VAT > 0 &&
            ( data.KhmerName === null || data.KhmerName === '' || (data.KhmerName.trim() === ""))
        ) {
            // this.refs['KhmerNameType'].setValid(false);
            errorList.push({
                name: 'KhmerNameType',
                msg: strings('dl.customer_info.total.err.KhmerNameType')
            });
        } else {
            // this.refs['KhmerNameType'].setValid(true);
        }

        if (errorList.length === 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    /**
     * TINH TONG TIEN
     * @param
     * @private
     */
    _calcTotalAmount() {

        const { data } = this.state
        const { AllData, Username } = this.props;

        const formData = {
            UserName:       Username,

            LocalType:      AllData.LocalType,
            PromotionId:    AllData.PromotionId,
            MonthOfPrepaid: AllData.MonthOfPrepaid,
            ListDevice:     AllData.ListDevice,
            ConnectionFee:  AllData.ConnectionFee,
            LocationId:     AllData.LocationId,
            ObjId:          AllData.ObjId,
            Contract:       AllData.Contract,
            ListStaticIP:   AllData.ListStaticIP,

            DepositFee:     data.DepositFee,
            VAT:            data.VAT,

            Total:          data.Total,
            InternetTotal:  data.InternetTotal,
            DeviceTotal:    data.DeviceTotal,
            StaticIPTotal:  data.StaticIPTotal,
        };

        // show loading
        this._loading(true);

        // Xu ly cap nhat gia tien
        api.caclRegistrationTotal(formData, (isSuccess, rData, msg) => {

            // hide loading
            setTimeout( () => {
                this._loading(false);

                if (isSuccess) {

                    const postData = {
                        ...this.props.AllData,
                        Total:      rData.Total,
                        ListGift:   data.ListGift ? [data.ListGift] : [],
                        DepositFee: data.DepositFee,
                        VAT:        data.VAT
                    }

                    // dispatch redux store
                    this.props.updateInfoRegistration(postData, () => {});

                } else {
                    this._error(msg);
                }
            }, 300);
        });
    }

    /**
     * GET API DATCOC
     * @param
     * @private
     */
    _getDeposit() {
        this._loading(true);

        // goi API generation
        api.GetDepositList({}, (success, result, msg) => {
            // this._loading(false);
            if (success) {
                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiDeposit: result,
                    }
                });

                // GET API
                this._getVAT();
            }
            else {
                this._error(msg);
            }
        });
    }

    /**
     * GET API VAT
     * @param
     * @private
     */
    _getVAT() {
        // this._loading(true);

        // goi API generation
        api.GetVatList({}, (success, result, msg) => {
            // this._loading(false);

            if (success) {
                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiVAT: result,
                    },
                    loadingVisible: false
                });
            }
            else {
                this._error(msg);
            }
        });
    }

    /**
     * SUBMIT
     * @param
     * @private
     */
    _onSubmit() {
        //
        if (! this.isValidData()) {
            return;
        }

        //
        this._loading(true);
        //
        const { AllData } = this.props;
        const { data, dataTemp } = this.state;
        let RegistrationObj = {};

        RegistrationObj.InternetTotal   = AllData.InternetTotal;
        RegistrationObj.DeviceTotal     = AllData.DeviceTotal;
        RegistrationObj.StaticIPTotal   = AllData.StaticIPTotal;
        RegistrationObj.ConnectionFee   = AllData.ConnectionFee;

        RegistrationObj.ListGift        = data.ListGift ? [data.ListGift] : [];
        RegistrationObj.DepositFee      = data.DepositFee;
        RegistrationObj.VAT             = data.VAT;
        RegistrationObj.Total           = data.Total
        RegistrationObj.KhmerName       = data.KhmerName //KhmerName

        //
        const postData = {
            ...AllData,
            ...RegistrationObj
        }

        // dispatch redux
        this.props.updateInfoRegistration(postData, () => {

            // Chuyen trang
            // setTimeout(() => {
            //     this._loading(false);
            //     // Create PDK or UPDATE
            //     this._createInfoCustomer(postData, dataTemp);
            // }, 50);

            //
            // this._loading(false);

            // thuantv-edit: 22/10/2020
            this.setState({...this.state, disableButton: true},
                ()=>this._createInfoCustomer(postData, dataTemp)
            );

        });
    }

    /**
     * PUSH API TAO THONG TIN KHACH HANG
     * @param
     * @private
     */
    _createInfoCustomer(data, dataTemp) {

        this._loading(true);

        // goi API generation
        api.createInfoCustomer(data, (success, result, msg) => {
            this._loading(false);

            // set lai disableButton
            this.setState({...this.state, disableButton: false});

            if (success) {
                this.props.submitCreateTTKH(dataTemp);
                NavigationService.navigate('lciDetailCustomer', {RegID : result[0].RegID, RegCode : result[0].RegCode});
            }
            else {
                setTimeout(() => {
                    // this._error(msg.message);
                    this.refs['popup'].getWrappedInstance().show(msg.message);
                }, 50);
                // this._error(msg);
            }
        });
    }

    /**
     * Show Loi
     * @param err
     * @private
     */
    _error(err) {
        this._loading(false);
        // alert(JSON.stringify(err));
        // alert(err);
        this.refs['popup'].getWrappedInstance().show(err);
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
        // console.log('this.state.data--------', this.state.data);
        // console.log(this.state.AllData);

        const objDeposit = Object.values(this.state.dataAPI.apiDeposit);
        const objVAT = Object.values(this.state.dataAPI.apiVAT);
        // const objDeposit = [{id: 1, kind:"500.000đ"}, {id: 2, kind:"1.200.000đ"}];

        const { InternetTotal, DeviceTotal, StaticIPTotal, ConnectionFee, Total } = this.state.data

        const priI = parseInt(InternetTotal);
        const priD = parseInt(DeviceTotal);
        const priC = parseInt(ConnectionFee);
        const priS = parseInt(StaticIPTotal);
        const tempTotal = !Total ? priI + priD + priC + priS : Total;

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ios: 70, android: 0})}
                behavior= {(Platform.OS === 'ios')? "padding" : null}
                style={[ols.container_keyboard]} >
                <ScrollView
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview, ols.bgw, {justifyContent: 'space-between'}]}>

                        {/*
                            //-- Tổng tiền dịch vụ
                        */}
                        <View>
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('customer_info.total.gifts')}</Text>
                            <View style={styles.container}>
                                <PickerSearchInput
                                    label = {strings('customer_info.total.form.gifts_label')}
                                    placeholder = {strings('customer_info.total.form.gifts_placeholder')}
                                    filterText = {strings('customer_info.total.form.gifts_headertitle')}
                                    getOptionData = {api.loadGiftList}
                                    allowRefresh={false}
                                    value={this.state.data.ListGift}
                                    onChange={(e) => this._onChangeSel(e, 'gifts')}
                                    key="picker1"
                                />
                            </View>

                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('customer_info.total.total_ser')}</Text>
                            <View style={[styles.field]}>
                                <Text style={[styles.plfake, ols.fs12, { top: 18 }]}>{strings('customer_info.total.form.internet_placeholder')}</Text>
                                <View style={[{paddingRight: 12}]}>
                                    <Text style={[ols.fs12, { minHeight: 38, paddingTop: 10, paddingBottom: 10, alignSelf: 'flex-end' }]}>{this.state.data.InternetTotal}</Text>
                                </View>
                            </View>

                            <View style={[styles.field]}>
                                <Text style={[styles.plfake, ols.fs12, { top: 18 }]}>{strings('customer_info.total.form.equip_placeholder')}</Text>
                                <View style={[{paddingRight: 12}]}>
                                    <Text style={[ols.fs12, { minHeight: 38, paddingTop: 10, paddingBottom: 10, alignSelf: 'flex-end' }]}>{this.state.data.DeviceTotal}</Text>
                                </View>
                            </View>

                            <View style={[styles.field]}>
                                <Text style={[styles.plfake, ols.fs12, { top: 18 }]}>{strings('customer_info.total.form.staticip_placeholder')}</Text>
                                <View style={[{paddingRight: 12}]}>
                                    <Text style={[ols.fs12, { minHeight: 38, paddingTop: 10, paddingBottom: 10, alignSelf: 'flex-end' }]}>{this.state.data.StaticIPTotal}</Text>
                                </View>
                            </View>

                            <View style={[styles.field]}>
                                <Text style={[styles.plfake, ols.fs12, { top: 18 }]}>{strings('customer_info.total.form.connectionfee_placeholder')}</Text>
                                <View style={[{paddingRight: 12}]}>
                                    <Text style={[ols.fs12, { minHeight: 38, paddingTop: 10, paddingBottom: 10, alignSelf: 'flex-end' }]}>{this.state.data.ConnectionFee}</Text>
                                </View>
                            </View>

                            <View style={styles.container}>
                                <ModalPicker
                                    ref="DepositFeeType"
                                    label={strings('customer_info.total.form.depositefee_label')}
                                    options={objDeposit}
                                    placeholder={(this.state.data.DepositFee != 0 && !this.state.data.DepositFee) ? strings('customer_info.total.form.depositefee_placeholder') : this.state.data.DepositFee }
                                    headerTitle={strings('customer_info.total.form.depositefee_headertitle')}
                                    getLabel={item => item.Name}
                                    // defaultValue = { this.state.data.DepositFee }
                                    onValueChange={value => {
                                        this._onChangeSel(value, 'depo');
                                    }}
                                    defVal={ this.state.data.DepositFee }
                                />
                            </View>
                            {/*....VAT..*/}
                            <View style={styles.container}>
                                <ModalPicker
                                    ref="vatType"
                                    label={strings('customer_info.total.form.vat_label')}
                                    options={objVAT}
                                    placeholder={(this.state.data.VAT != 0 && !this.state.data.VAT) ? strings('customer_info.total.form.vat_placeholder') : (this.state.data.VAT + '%')}
                                    headerTitle={strings('customer_info.total.form.vat_headertitle')}
                                    getLabel={item => (item.Name + '%')}
                                    // defaultValue = { this.state.data.VAT }
                                    onValueChange={value => {
                                        this._onChangeSel(value, 'vat');
                                    }}
                                    defVal={ this.state.data.VAT }
                                />
                            </View>

                            {/*....KhmerName...*/}
                            { (this.state.data.VAT > 0) &&
                                <View>
                                    <InputO
                                        ref="KhmerNameType"
                                        label={strings('customer_info.total.form.khmerName_label')}
                                        style={[styles.textInput, ols.fw500, {paddingLeft: 100,}]}
                                        placeholder={strings('customer_info.total.form.khmerName_placeholder')}
                                        placeholderTextColor='#444444'
                                        textAlign={'right'}
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        onChangeText={(text) => this._onChangeText('KhmerName', text)}
                                        value={this.state.data.KhmerName}
                                    />
                                </View>
                            }
                            {/*...Total..*/}
                            <View style={[styles.field]}>
                                <Text style={[styles.plfake, ols.fs12, { top: 18 }]}>{strings('customer_info.total.form.total_placeholder')}</Text>
                                <View style={[{paddingRight: 12}]}>
                                    <Text style={[ols.fs12, { minHeight: 38, paddingTop: 10, paddingBottom: 10, alignSelf: 'flex-end' }]}>{!Total ? tempTotal : Total }</Text>
                                </View>
                            </View>
                        </View>

                        {/*
                            //-- next button
                        */}
                        <View>
                            <ButtonCreateInfo
                                disabled={this.state.disableButton}  // tranh double click
                                label={!this.props.AllData.RegCode ?
                                    strings('customer_info.customer_info.form.btnCreate_label') :
                                    strings('customer_info.customer_info.form.btnUpdate_label')}
                                style={{marginBottom: 24, }}
                                onSubmit={() => this._onSubmit()}
                            />
                        </View>
                    </View>
                </ScrollView>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </KeyboardAvoidingView>
        );
    }
}


function mapStateToProps(state) {
    // console.log('--------- all state ', state.saleNewReducer.RegistrationObj);

    const stateSL = state.saleNewReducer.RegistrationObj;
    console.log('----RegistrationObj ', stateSL)

    const FormData = {
        InternetTotal: stateSL.InternetTotal,
        DeviceTotal: stateSL.DeviceTotal,
        StaticIPTotal: stateSL.StaticIPTotal,
        ConnectionFee: stateSL.ConnectionFee,
        DepositFee: stateSL.DepositFee,
        ListGift: mapTotalType(stateSL.ListGift),
        VAT: stateSL.VAT,
        Total: stateSL.Total,
        KhmerName: stateSL.KhmerName,
    }

    return {
        Username: state.authReducer.userInfo.UserName,
        FormData: FormData,
        AllData: stateSL,
    };
}

export default connect(mapStateToProps, {submitCreateTTKH, updateInfoRegistration})(TotalAmount);
