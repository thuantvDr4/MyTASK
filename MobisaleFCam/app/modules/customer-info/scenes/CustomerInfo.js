/**
 * Màn hình tao phieu thông tin khách hàng
 * @author ThuanDinh
 * @since Aug, 2018
 */

//  LIB
import React from 'react';
import { View, ScrollView, Image, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { strings } from 'locales/i18n';
import { connect } from 'react-redux';

// API
import * as api from '../api';

// CONSTANT
import {KEYBOARD_NUMBER} from '../constants';

// REDUX ACTION
import { actions as customerInfo } from '../';
const { nextStep, updateInfoRegistration } = customerInfo;

// LIB CUSTOM
import { convertPhone, convertWhiteSpace } from "app-libs/helpers/regex";
import NavigationService from 'app-libs/helpers/NavigationService';
import ModalPicker from '../../../libs/components/ModalPicker';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';

// COMPONENT
import FormPersonalInfo from '../components/FormPersonalInfo';
import FormBussinessInfo from '../components/FormBussinessInfo';
import InputO from '../components/InputO';
import InputN from '../components/InputN';
import ButtonNext from '../components/ButtonNext';

// GLOBAL STYLE
import styles from '../styles';
import ols from '../../../styles/Ola-style';


class CustomerInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dataTemp: {
                changeForm: true,
                step: 1,
                nextScreen: 'ciServiceType'
            },
            data: {
                ...this.props.FormData,
            },
            dataAPI: {
                apiNationaly: '',
                apiCustomerType: '',
            },
            loadingVisible: false
        };

        // this._getNationly = this._getNationly.bind(this);
        // this._getCustomerType = this._getCustomerType.bind(this);
        // this._setPopupWarning = this._setPopupWarning.bind(this);
        // this.showPopup = this.showPopup.bind(this);
    }

    /**
     * MOUNT Process API
     */
    componentDidMount() {
        // LOAD API FIRST
        this.props.navigation.addListener('willFocus', () => {
            // GET API
            this._getNationly();
        });
    }

    /**
     * TEXT CHANGE
     * @param
     * @private
     */
    _onChange(key, text) {
        let state = this.state;
        state.data[key] = text;
        this.setState(state);

        if (convertWhiteSpace(text) !== "") {
            this._liveCheck(key, text);
        }
    }

    _convertPhone(key) {
        // console.log(key);
        // console.log(this.state.data);

        let state = this.state;
        let { Phone1, Phone2 } = state.data

        if (key === 'Phone1' && Phone1 !== '') {
            state.data[key] = convertPhone(Phone1);
        }

        if (key === 'Phone2' && Phone2 !== '') {
            state.data[key] = convertPhone(Phone2);
        }

        this.setState(state);
        return;
    }

    /**
     * PASS FUNC TO CHILD
     * @param
     * @private
     */
    _onChangeFromChild = (key, text) => {
        let state = this.state;
        state.data[key] = text;
        this.setState(state);
    }

    /**
     * SELECT CHANGE TYPE
     * @param
     * @private
     */
    _onChangeSel(value, kind) {
        switch (kind) {

            case 'lkh':
                if (this.state.data.CusTypeDetail != value.Id) {
                    this.setState({
                        data: {
                            ...this.state.data,
                            CusTypeDetail: value.Id,
                            CusTypeDetailName: value.Name,
                            FullName: "",
                            Representive: "",
                            TaxCode: "",
                            Birthday: "",
                            Passport: "",
                        },
                        dataTemp: {
                            ...this.state.dataTemp,
                            changeForm: (value.Id != 12 ? false : true),
                        },
                    });
                }
                break;

            case 'qt':
                this.setState({
                    data: {
                        ...this.state.data,
                        Nationality: value.Value ? value.Value : this.state.data.Nationality,
                        NationalityName: value.Name ? value.Name : this.state.data.NationalityName,
                    },
                });
                break;

            default:
                break;
        }
    }



    /**
     * edit-address
     * @param
     * @private
     */
    _editInstallAddress =()=> {
        NavigationService.navigate('BookportAddress', {serviceType: "Internet"});
    }


    /**
     * GO TO STEP 2
     * @param data
     * @param dataTemp: Step Page
     * @private
     */
    _onNextStep() {
        const {data, dataTemp} = this.state;
        if (! this.isValidData()) {
            return;
        }

        this._loading(true);

        // Chuyen trang
        this.props.updateInfoRegistration(data, () => {
            // Chuyen trang
            setTimeout(() => {
                this._loading(false);
                this.props.nextStep(dataTemp);
                NavigationService.navigate('ciServiceType');
            }, 0);
        });
    }

    /**
     * VALIDATE FORM
     */
    isValidData() {
        const { data } = this.state;
        let errorList = [];

        // Check loai khach hang
        if (data.CusTypeDetail == null) {
            this.refs['CusTypeDetailType'].setValid(false);

            errorList.push({
                name: 'CusTypeDetailType',
                msg: strings('dl.customer_info.customer_info.err.Custype')
            });
        } else {
            this.refs['CusTypeDetailType'].setValid(true);
        }

        // Check Theo form
        if (data.CusTypeDetail == 12) {
            // Check ca nhan
            if (data.FullName == "" || ( convertWhiteSpace(data.FullName) === "")) {
                this.refs['formPersonalType'].setValidForm();

                errorList.push({
                    name: 'FullNameType',
                    msg: strings('dl.customer_info.customer_info.err.FullnameType')
                });
            } else {
                this.refs['formPersonalType'].setValidForm();
            }

            // Check Ngày Sinh
            if (data.Birthday == "") {
                this.refs['formPersonalType'].setValidForm();

                errorList.push({
                    name: 'BirthdayType',
                    msg: strings('dl.customer_info.customer_info.err.BirthdayType')
                });
            } else {
                this.refs['formPersonalType'].setValidForm();
            }

            // Check CMND
            if (data.Passport == "" || ( convertWhiteSpace(data.Passport) === "") ) {
                this.refs['formPersonalType'].setValidForm();

                errorList.push({
                    name: 'PassportType',
                    msg: strings('dl.customer_info.customer_info.err.PassportType')
                });
            } else {
                this.refs['formPersonalType'].setValidForm();
            }
        } else {
            // Check ten doanh nghiep
            if (data.FullName == "" || ( convertWhiteSpace(data.FullName) === "")) {
                this.refs['formBusinessType'].setValidForm();

                errorList.push({
                    name: 'FullNameType',
                    msg: strings('dl.customer_info.customer_info.err.BusinessNameType')
                });
            } else {
                this.refs['formBusinessType'].setValidForm();
            }

            // Check dai dien doanh nghiep
            if (data.Representive == "" || ( convertWhiteSpace(data.Representive) === "")) {
                this.refs['formBusinessType'].setValidForm();

                errorList.push({
                    name: 'RepresentiveType',
                    msg: strings('dl.customer_info.customer_info.err.DelegateNameType')
                });
            } else {
                this.refs['formBusinessType'].setValidForm();
            }

            // Check mst
            if (data.TaxCode == "" || ( convertWhiteSpace( data.TaxCode) === "")) {
                this.refs['formBusinessType'].setValidForm();

                errorList.push({
                    name: 'TaxCodeType',
                    msg: strings('dl.customer_info.customer_info.err.TaxCodeType')
                });
            } else {
                this.refs['formBusinessType'].setValidForm();
            }

            // Check ngay thanh lap
            if (data.Birthday == "") {
                this.refs['formBusinessType'].setValidForm();

                errorList.push({
                    name: 'BirthdayType',
                    msg: strings('dl.customer_info.customer_info.err.AniversaryType')
                });
            } else {
                this.refs['formBusinessType'].setValidForm();
            }
        }

        // Check quoc tich
        if (data.Nationality == null) {
            this.refs['NationlyType'].setValid(false);

            errorList.push({
                name: 'NationlyType',
                msg: strings('dl.customer_info.customer_info.err.NationlityType')
            });
        } else {
            this.refs['NationlyType'].setValid(true);
        }

        // Phone 1
        if (data.Phone1 == "" || (convertWhiteSpace(data.Phone1) === "")) {
            this.refs['Phone1Type'].setValid(false);

            errorList.push({
                name: 'Phone1Type',
                msg: strings('dl.customer_info.customer_info.err.Phone1Type')
            });
        } else {
            this.refs['Phone1Type'].setValid(true);
        }

        // Contact 1
        if (data.Contact1 == "" || (convertWhiteSpace(data.Contact1) === "")) {
            this.refs['Contact1Type'].setValid(false);

            errorList.push({
                name: 'Contact1Type',
                msg: strings('dl.customer_info.customer_info.err.Contact1Type')
            });
        } else {
            this.refs['Contact1Type'].setValid(true);
        }

        // Phone 2 cho Business
        if (data.CusTypeDetail != 12) {
            // Phone 2
            if (data.Phone2 == "" || (convertWhiteSpace(data.Phone2) === "")) {
                this.refs['Phone2Type'].setValid(false);

                errorList.push({
                    name: 'Phone2Type',
                    msg: strings('dl.customer_info.customer_info.err.Phone2Type')
                });
            } else {
                this.refs['Phone2Type'].setValid(true);
            }
        }

        // Email
        if (data.Email != "") {
            let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ ;

            if (reg.test(data.Email) === false) {
                    this.refs['EmailType'].setValid(false);

                    errorList.push({
                        name: 'EmailType',
                        msg: strings('dl.customer_info.customer_info.err.EmailType')
                    });
                }
            else {
                this.refs['EmailType'].setValid(true);
            }
        } else {
            this.refs['EmailType'].setValid(true);
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    /**
     * LIVE VALIDATE FORM
     */
    _liveCheck(key, text) {
        const data = this.state.data;

        switch (key) {
            case 'FullName':
                if (data.CusTypeDetail == 12) {
                    this.refs['formPersonalType']._liveCheck(key);
                } else {
                    this.refs['formBusinessType']._liveCheck(key);
                }
                break;

            case 'Passport':
                this.refs['formPersonalType']._liveCheck(key);
                break;

            case 'Representive':
                this.refs['formBusinessType']._liveCheck(key);
                break;

            case 'TaxCode':
                this.refs['formBusinessType']._liveCheck(key);
                break;

            case 'Phone1':
                this.refs['Phone1Type'].setValid(true);
                break;

            case 'Contact1':
                this.refs['Contact1Type'].setValid(true);
                break;

            case 'Phone2':
                this.refs['Phone2Type'].setValid(true);
                break;

            case 'Email':
                if (data.Email != "") {
                    this.refs['EmailType'].setValid(true);
                }
                break;

            default:
                break;
        }
    }

    /**
     * GET API LOAI KHACH HANG
     * @param
     * @private
     */
    _getCustomerType() {

        // goi API generation
        api.GetCustomerType({}, (success, result, msg) => {

            if (success) {

                this.setState({
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiCustomerType: result,
                    },
                    data: {
                        ...this.state.data,
                        CusTypeDetail: !this.props.FormDataUpdated.CusTypeDetail ? result[0].Id : this.props.FormDataUpdated.CusTypeDetail,
                        CusTypeDetailName: result[0].Name,
                    },
                    loadingVisible: false
                });

            } else {
                this._error(msg);
            }
        });
    }

    /**
     * GET API QUOC TICH
     * @param
     * @private
     */
    _getNationly() {
        this._loading(true);

        // goi API generation
        api.GetNationalityList({}, (success, result, msg) => {

            if (success) {

                this.setState({
                    dataAPI: {
                        ...this.state.dataAPI,
                        apiNationaly: result,
                    }
                });

                // GET API
                this._getCustomerType();

            } else {
                this._error(msg);
            }
        });
    }

    /**
     * show Loi
     * @param err
     * @private
     */
    _error(err) {
        this._loading(false);
        alert(JSON.stringify(err));
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
        const FormDataUpdated = this.props.FormDataUpdated;
        const opjTypeCus = Object.values(this.state.dataAPI.apiCustomerType);
        const opjNationCus = Object.values(this.state.dataAPI.apiNationaly);
        // const opjTypeCus1 = [{ id: 1, kind: "Personal" }, { id: 2, kind: "Business" }];

        // console.log(this.state.data);
        // console.log(FormDataUpdated);

        var renderForm = (this.state.dataTemp.changeForm && this.state.data.CusTypeDetail != 10) ?
            <FormPersonalInfo
                ref="formPersonalType"
                data={this.state.data}
                onChangeText={this._onChange.bind(this)}
                onChangeFromChild = {this._onChangeFromChild.bind(this)}
            /> :
            <FormBussinessInfo
                ref="formBusinessType"
                data={this.state.data}
                onChangeText={this._onChange.bind(this)}
                onChangeFromChild = {this._onChangeFromChild.bind(this)}
            />;

        return (

                <KeyboardAvoidingView
                    keyboardVerticalOffset={Platform.select({ios: 150, android: 0})}
                    behavior= {(Platform.OS === 'ios')? "padding" : null}
                    style={[styles.container]}
                >
                    <ScrollView
                        keyboardDismissMode={'on-drag'}
                        contentContainerStyle={[ols.wrapper_scrollview]}
                    >
                        <View style={[ols.inner_scrollview, ols.bgw]} >

                            {/*
                            //-- Port Info
                            */}
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('customer_info.service_type.bookport')}
                            </Text>
                            <View style={styles.container}>
                                <InputO
                                    ref=""
                                    label={'POP'}
                                    style={[styles.textInput, ols.fw500, ols.txtR]}
                                    placeholder={strings('customer_info.customer_info.form.cus_ID_placeholder')}
                                    placeholderTextColor='#444444'
                                    textAlign={'right'}
                                    autoCapitalize={'none'}
                                    returnKeyType={'done'}
                                    autoCorrect={false}
                                    editable={false}
                                    value={this.state.data['GroupPoints']}
                                />
                            </View>


                            {/*
                            //-- Customer Info
                            */}
                            <Text style={[styles.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('customer_info.customer_info.cus_info')}
                            </Text>
                            <View style={styles.container}>
                                <ModalPicker
                                    ref="CusTypeDetailType"
                                    label={strings('customer_info.customer_info.form.cus_info_type_label')}
                                    options={opjTypeCus}
                                    placeholder={!FormDataUpdated.CusTypeDetailName ? strings('customer_info.customer_info.form.cus_info_type_default') : FormDataUpdated.CusTypeDetailName }
                                    headerTitle={strings('customer_info.customer_info.form.cus_info_type_headertitle')}
                                    getLabel={item => item.Name}
                                    onValueChange={value => {
                                        this._onChangeSel(value, 'lkh');
                                    }}
                                />
                            </View>

                            {renderForm}

                            <View styles={styles.container}>
                                <ModalPicker
                                    ref="NationlyType"
                                    label={strings('customer_info.customer_info.form.cus_per_label')}
                                    options={opjNationCus}
                                    placeholder={ !FormDataUpdated.NationalityName ? strings('customer_info.customer_info.form.cus_per_placeholder') : FormDataUpdated.NationalityName }
                                    headerTitle={strings('customer_info.customer_info.form.cus_per_headertitle')}
                                    getLabel={item => item.Name}
                                    defaultValue = { !FormDataUpdated.NationalityName ? this.state.data.NationalityName : FormDataUpdated.NationalityName }
                                    onValueChange={value => {
                                        this._onChangeSel(value, 'qt');
                                    }}
                                />
                            </View>


                            {/*
                            //-- thông tin liên lạc
                            */}
                            <Text style={[styles.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>{strings('customer_info.customer_info.con_info')}</Text>
                            <View style={styles.rows}>
                                <View style={styles.cols}>
                                    <InputN
                                        ref="Phone1Type"
                                        style={[styles.textInput, ols.fw500]}
                                        placeholder={strings('customer_info.customer_info.form.con_phone_placeholder')}
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        keyboardType={KEYBOARD_NUMBER}
                                        onChangeText={(text) => this._onChange('Phone1', text)}
                                        onBlur={() => this._convertPhone('Phone1')}
                                        value={this.state.data['Phone1']}
                                    />
                                </View>
                                <View style={styles.cols}>
                                    <InputO
                                        ref="Contact1Type"
                                        style={[styles.textInput, ols.fw500]}
                                        placeholder={strings('customer_info.customer_info.form.con_name_placeholder')}
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        onChangeText={(text) => this._onChange('Contact1', text)}
                                        value={this.state.data['Contact1']}
                                    />
                                </View>
                            </View>

                            <View style={styles.rows}>
                                <View style={styles.cols}>
                                    <InputN
                                        ref="Phone2Type"
                                        style={[styles.textInput, ols.fw500]}
                                        placeholder={strings('customer_info.customer_info.form.con_phone_other_placeholder')}
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        keyboardType={KEYBOARD_NUMBER}
                                        onChangeText={(text) => this._onChange('Phone2', text)}
                                        onBlur={() => this._convertPhone('Phone2')}
                                        value={this.state.data['Phone2']}
                                    />
                                </View>

                                <View style={styles.cols}>
                                    <InputO
                                        ref="Contact2Type"
                                        style={[styles.textInput, ols.fw500]}
                                        placeholder={strings('customer_info.customer_info.form.con_name_other_placeholder')}
                                        autoCapitalize={'none'}
                                        returnKeyType={'done'}
                                        autoCorrect={false}
                                        onChangeText={(text) => this._onChange('Contact2', text)}
                                        value={this.state.data['Contact2']}
                                    />
                                </View>
                            </View>

                            {/*..Email..*/}
                            <View style={styles.container}>
                                <InputO
                                    ref="EmailType"
                                    label="Email"
                                    style={[styles.textInput, ols.fw500, ols.txtR]}
                                    placeholder={strings('customer_info.customer_info.form.con_mail_placeholder')}
                                    placeholderTextColor='#444444'
                                    textAlign={'right'}
                                    autoCapitalize={'none'}
                                    returnKeyType={'done'}
                                    autoCorrect={false}
                                    onChangeText={(text) => this._onChange('Email', text)}
                                    value={this.state.data['Email']}
                                />
                            </View>

                            {/*...Telegram..*/}
                            <View style={styles.container}>
                                <InputO
                                    ref="Telegram"
                                    label= {strings('customer_info.customer_info.form.telegram_label')}
                                    style={[styles.textInput, ols.fw500, ols.txtR]}
                                    placeholder={strings('customer_info.customer_info.form.telegram_placeholder')}
                                    placeholderTextColor='#444444'
                                    textAlign={'right'}
                                    keyboardType={KEYBOARD_NUMBER}
                                    autoCapitalize={'none'}
                                    returnKeyType={'done'}
                                    autoCorrect={false}
                                    onChangeText={(text) => this._onChange('Telegram', text)}
                                    value={this.state.data['Telegram']}
                                />
                            </View>

                            {/*
                            //-- thông tin địa chỉ
                            */}
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <Text style={[styles.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>{strings('customer_info.customer_info.add_info')}</Text>
                                {!FormDataUpdated.RegCode ?
                                    <TouchableOpacity
                                        style={{ }}
                                        onPress={ this._editInstallAddress }>
                                        <Text style={[ols.fs12, ols.mgt05, ols.fs14, ols.fw500, ols.clBlueDark, {  }]}>{'Edit Address'}</Text>
                                    </TouchableOpacity>
                                    : <View></View>
                                }
                            </View>

                            <View style={[styles.field, { minHeight: 54, justifyContent: 'space-between', flex: 1, flexDirection: 'row', paddingHorizontal: 12 }]}>
                                <Text style={[ ols.fs12, { top: 10, left: 12, width: '40%', color: '#A9A9A9' }]}>
                                    {strings('customer_info.customer_info.form.add_placeholder')}
                                </Text>
                                <View style={[{width: '60%'}]}>
                                    <Text style={[ols.fs12, ols.fw500, ols.cl444, { paddingTop: 10, paddingBottom: 10, textAlign: 'right' }]}>{this.state.data.Address}</Text>
                                </View>
                            </View>

                            <View style={styles.container}>
                                <InputO
                                    ref="NoteAddressType"
                                    label={strings('customer_info.customer_info.form.note_label')}
                                    style={[styles.textInput, ols.fw500, ols.txtR, {paddingLeft: 100,}]}
                                    placeholder={strings('customer_info.customer_info.form.note_placeholder')}
                                    maxLength={1000}
                                    placeholderTextColor='#444444'
                                    textAlign={'right'}
                                    autoCapitalize={'none'}
                                    returnKeyType={'done'}
                                    autoCorrect={false}
                                    onChangeText={(text) => this._onChange('NoteAddress', text)}
                                    value={this.state.data['NoteAddress']}
                                />
                            </View>

                            {/*
                                //-- next button
                            */}
                            <View style={[ ols.pdt10, {marginBottom: 24}]}>
                                <ButtonNext
                                    label={strings('customer_info.customer_info.form.btnNext_label')}
                                    onNextTab={() => this._onNextStep()} />
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
    // GET STATE FROM SALENEW
    const stateSL = state.saleNewReducer.RegistrationObj;

    const FormData = {
        GroupPoints: stateSL.GroupPoints,
        CusTypeDetail: stateSL.CusTypeDetail,
        CusTypeDetailName: stateSL.CusTypeDetailName,
        FullName: stateSL.FullName,
        Representive: stateSL.Representive,
        TaxCode: stateSL.TaxCode,
        Birthday: stateSL.Birthday,
        Passport: stateSL.Passport,
        Nationality: stateSL.Nationality,
        NationalityName: stateSL.NationalityName,
        Phone1: stateSL.Phone1,
        Contact1: stateSL.Contact1,
        Phone2: stateSL.Phone2,
        Contact2: stateSL.Contact2,
        Email: stateSL.Email,
        Address: stateSL.Address,
        NoteAddress: stateSL.NoteAddress,
        Telegram : stateSL.Telegram
    }

    return {
        FormData: FormData,
        FormDataUpdated: stateSL
    };
}

export default connect(mapStateToProps, {nextStep, updateInfoRegistration})(CustomerInfo);
