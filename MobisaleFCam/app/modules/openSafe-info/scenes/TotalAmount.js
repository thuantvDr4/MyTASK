/**
 * Todo: Màn hình tổng tiền
 * codeBy thuantv
 * date: 20/04/2021
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
import ModalPicker from '../../../libs/components/ModalPicker';
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
import {makeDataDevice_OS} from "../helpers/mixData";


const VAT = [
    {id: 0, Name :'0', value: 0},
    {id: 10, Name :'10', value: 10},
]
/*
*
* */
class TotalAmount extends Component {

    constructor(props) {
        super(props);

        this.vatRef =  React.createRef();

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
            this._getVAT();
        });
    }


    /**
     * GET API VAT
     * @param
     * @private
     */
    _getVAT =()=> {
        this._loading(true);
        // goi API generation
        api.GetVatList({}, (success, result, msg) => {
            //
            this._loading(false);
            //
            if (success) {
                this.setState({
                    ...this.state,
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiVAT: result,
                    },
                });
            }
            else {
                this._error(msg);
            }
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
        if (nextProps.FormData !== this.state.data) {

            newState.data.Total = nextProps.FormData.Total;
            newState.data.PackageTotal = nextProps.FormData.PackageTotal;
            newState.data.DeviceTotal = nextProps.FormData.DeviceTotal;
        }
        this.setState(newState);
    }

    /**
     * SELECT CHANGE TYPE
     * @param
     * @private
     */
    _onChangeSel =(value, kind)=> {

        switch (kind) {
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
    isValidData =()=> {
        const { data } = this.state;
        let errorList = [];

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
    _calcTotalAmount =()=> {
        // show loading
        this._loading(true);
        //
        const { data } = this.state
        const { AllData, Username } = this.props;

        const formData = {
            "VAT": data.VAT,
            "ListOSDevice": AllData.ListOSDevice,
            "ListOSPackage": AllData.ListOSPackage,
            "Total": data.Total,
        };

        // Xu ly cap nhat gia tien
        api.caclRegistrationTotal(formData, (isSuccess, rData, msg) => {
            //
            setTimeout( () => {
                // hide loading
                this._loading(false)
                //
                if (isSuccess) {
                    const postData = {
                        ...this.props.AllData,
                        Total:      rData.Total,
                        VAT:        data.VAT,
                    }
                    // dispatch redux store
                    this.props.updateInfoRegistration(postData, () => { });
                } else {
                    this._error(msg);
                }
                //
            }, 500);
        });
    }





    /**
     * SUBMIT
     * @param
     * @private
     */
    _onSubmit =()=> {
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
        RegistrationObj.VAT             = data.VAT;
        RegistrationObj.Total           = data.Total;
        RegistrationObj.KhmerName       = data.KhmerName; //KhmerName
        RegistrationObj.LocalType       = 302; // cho homeSafe
        RegistrationObj.LocalTypeName   = "Homesafe";

        //
        const postData = {
            ...AllData,
            ...RegistrationObj
        }

        // dispatch redux
        this.props.updateInfoRegistration(postData, () => {

            // Chuyen trang

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
    _createInfoCustomer =(data, dataTemp)=> {
        //
        this._loading(true);
        // goi API: TAO KH
        api.createInfoCustomer(data, (success, result, msg) => {
            this._loading(false);

            // set lai disableButton
            this.setState({...this.state, disableButton: false});

            if (success) {
                this.props.submitCreateTTKH(dataTemp);
                //
                const data ={
                    RegID : result[0].RegID, RegCode : result[0].RegCode
                }
                this._gotoNextScreen(data)
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


    /*
    * _gotoNextScreen
    * */
    _gotoNextScreen =(data)=>{
        // NavigationService.navigate('openSafe_DetailCustomer', data);
        // fix cho Case backHandler không được remove
        NavigationService.navigateBackHome('OpenSafe_service', data);
    }



    /**
     * Show Loi
     * @param err
     * @private
     */
    _error (err) {
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
    _loading (isShow) {
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }

    render() {
        // console.log('this.state.data--------', this.state.data);
        // console.log(this.state.AllData);
        const objVAT = Object.values(this.state.dataAPI.apiVAT);

        const { PackageTotal, DeviceTotal, Total, KhmerName } = this.state.data

        const priPa = parseInt(PackageTotal);
        const priD = parseInt(DeviceTotal);

        const tempTotal = !Total ?  priD + priPa : Total;

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
                                    disabled={true}
                                    label = {strings('customer_info.total.form.gifts_label')}
                                    placeholder = {strings('customer_info.total.form.gifts_placeholder')}
                                    filterText = {strings('customer_info.total.form.gifts_headertitle')}
                                    getOptionData = {api.loadGiftList}
                                    allowRefresh={false}
                                    value={this.state.data.ListGift}
                                    onChange={(e) => console.log(e, 'gifts')}
                                    key="picker1"
                                />
                            </View>

                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>{strings('open_safe.total.total_ser')}</Text>
                            {/*..Equipment..*/}
                            <InputO
                                ref="Equipment"
                                editable={false}
                                label={strings('open_safe.total.form.equip_placeholder')}
                                style={[styles.textInput, ols.fw500, {paddingLeft: 100,}]}
                                placeholder={''}
                                textAlign={'right'}
                                autoCapitalize={'none'}
                                returnKeyType={'done'}
                                autoCorrect={false}
                                value={''+DeviceTotal}
                            />

                            {/*..package..*/}
                            <InputO
                                ref="Package"
                                editable={false}
                                label={strings('open_safe.total.form.package_placeholder')}
                                style={[styles.textInput, ols.fw500, {paddingLeft: 100,}]}
                                placeholder={''}
                                textAlign={'right'}
                                autoCapitalize={'none'}
                                returnKeyType={'done'}
                                autoCorrect={false}
                                value={''+PackageTotal}
                            />

                            {/*....VAT..*/}
                            <View style={styles.container}>
                                <ModalPicker
                                    ref="vatType"
                                    label={strings('customer_info.total.form.vat_label')}
                                    options={objVAT}  //VAT
                                    placeholder={(this.state.data.VAT !== 0 && !this.state.data.VAT) ? strings('customer_info.total.form.vat_placeholder') : (this.state.data.VAT + '%')}
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
                                        maxLength={100}
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
                                onSubmit={this._onSubmit}
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

    const stateSL = state.saleNewReducer.openSafeObj;

    const FormData = {
        // ListGift: mapTotalType(stateSL.ListGift),
        VAT: stateSL.VAT,
        Total: stateSL.Total,
        KhmerName: stateSL.KhmerName,
        DeviceTotal: stateSL.DeviceTotal,
        PackageTotal: stateSL.PackageTotal
    }

    return {
        Username: state.authReducer.userInfo.UserName,
        FormData: FormData,
        AllData: stateSL,
    };
}

export default connect(mapStateToProps, {submitCreateTTKH, updateInfoRegistration})(TotalAmount);
