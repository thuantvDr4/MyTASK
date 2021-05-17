/*
* Screen: RECEIPT DETAIL
* code by: thuantv
* date: 23/04/2021
*
* */
import React, {Component} from "react";
import {Text, ScrollView, View, TouchableOpacity, KeyboardAvoidingView} from "react-native";

// LANGUAGE
import {strings} from "locales/i18n";

// REDUX
import {connect} from "react-redux";

// ACTION
import {actions as a, constants as c} from "../";

const {pushDataInfoRegistration, showTabBar} = a;

// API
import * as api from "../api";
import {HeaderBackButton} from "react-navigation";

// LIB CUSTOM
import TechLoading from 'app-libs/components/TechLoading';
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';
import TextInfo from "app-libs/components/input/TextInfo";
import NavigationService from "app-libs/helpers/NavigationService";
import PickerInputDynamic from 'app-libs/components/input/PickerInputDynamic';
import ModalPicker from '../../../libs/components/ModalPicker';

// STYLE
import ols from "../../../styles/Ola-style";
import styles from "../DetailCustomer.styles";
import moduleStyle from "../../extra-service/styles";


const VAT = [
    {id: 0, Name :'0', value: 0},
    {id: 10, Name :'10', value: 10},
]


/*
*
* CLASS
* */
class ReceiptDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings("open_safe.receipt_detail.header_title"),
            headerLeft: (
                <HeaderBackButton
                    onPress={() => {
                        navigation.goBack();
                    }}
                    tintColor="#fff"
                />
            ),
            // headerLeft: <HeaderBackButton onPress={() => {navigation.navigate('TabListCustomerInfo')}} tintColor="#fff"/>,
            headerRight: <View/>,
            headerBackTitle: null
        };
    };

    constructor(props) {
        super(props);

        // params ={"ObjId":11231,"Contract":"PPHJ20019"}
        const PARAMS = this.props.navigation.state.params;
        console.log('PARAMS---', PARAMS)

        this.state = {
            loadingVisible: false,
            objDetailContract: PARAMS,
            RegId: this.props.navigation.getParam("RegID", "0"),
            RegCode: this.props.navigation.getParam("RegCode", "0"),
            //
            listPaymentMethod: [],
            paymentMethod: null
        };
        this.props.navigation.setParams({visible: false});
    }


    /*
    * componentDidMount
    * */
    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => {
            const {navigation} = this.props;

            this._getPaymentMethodList();

            this.props.showTabBar(false);
        });
    }

    /*
    * componentWillUnmount
    * */
    componentWillUnmount() {
        this.props.showTabBar(true);
    }



    /**
     * show Loi
     * @param err
     * @private
     */
    _error = (err) => {
        this._loading(false);
        if (!err.message) return;
        this.refs["popup"].getWrappedInstance().show(err.message);
    }

    _errorMsg = (err) => {
        this._loading(false);
        if (!err) return;
        this.refs["popup"].getWrappedInstance().show(err.toString());
    }

    /**
     * Loading
     * @param isShow
     * @private
     */
    _loading = (isShow) => {
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }


    /*
    * FOR------> FUNCTIONS
    *
    * */


    /*
    * _getPaymentMethodList
    * */
    _getPaymentMethodList = ()=> {
        this._loading(true);
        //
        const data ={
            // Nếu là bán mới truyền PaymentType=1, nếu là bán thêm truyền PaymentType=2
            PaymentType: 1
        }
        //
        api.getPaymentMethodList(data, (success, result, msg) => {
            if (success) {
                this._loading(false);
                //
                this.setState({
                    listPaymentMethod: result
                })
                //
            } else {
                this._loading(false);
                this._errorMsg(msg.message);
            }
        });
    }



    /*
    * _onChangeValue
    * */
    _onChangeValue =(value)=>{
        this.setState({
            paymentMethod: value
        })
    }



    /*
        * createContract
        * */
    confirmPayment = () => {
        //
        const {paymentMethod, objDetailContract} = this.state;
        // Validate du lieu
        const en = strings('dl.open_safe.receipt_detail.confirm_pay');
        const km = strings('dl.open_safe.receipt_detail.confirm_pay_km');
        const _contractNo = objDetailContract&&objDetailContract.Contract
        //check  valid
        if(!paymentMethod){
            this._errorMsg(strings('dl.open_safe.receipt_detail.PaymentMethod'));
            return;
        }

        // Hien thong bao xac nhan
        this.refs['popup_confirm'].getWrappedInstance().show(en + `${_contractNo}` + '?\n\n' + km + `${_contractNo}` + '?');
    }


    /*
    * submitPayment
    * */
    submitPayment =()=>{
        const {paymentMethod, objDetailContract} = this.state;
        const data = {
            "ObjID":objDetailContract.ObjId,
            "PaymentMethod":paymentMethod.Id
        };
        //
        this._loading(true);
        //
        api.updateOSPayment(data, (success, result, msg) => {
            //console.log('API--result--', result)
            if (success) {
                this._loading(false);
                //
                const payload = {
                    Contract: objDetailContract.Contract,
                    ObjId: objDetailContract.ObjId
                }
                NavigationService.navigate('openSafe_DetailContract', payload);
                //
            } else {
                this._loading(false);
                this._errorMsg(msg.message);
            }
        });
    }



    /*
    * RENDER-RETURN
    *
    * */
    render() {
        const {objDetailContract} = this.state;
        console.log('STATE---', objDetailContract)
        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardDismissMode={"on-drag"}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview, {justifyContent: "space-between", backgroundColor: "#FFFFFF"}]}>
                        <View>
                            {/*
                                // ---- Customer infomation
                            */}
                            <View style={styles.topContainer}>
                                <View style={styles.titleBox}>
                                    <Text style={[styles.titleLeft, {fontSize: 14, fontWeight: '700'}]}>
                                        {strings("open_safe.receipt_detail.detail_payment")}
                                    </Text>
                                </View>

                                <View style={[styles.inner, {borderWidth: 0}]}>
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.receipt_detail.equipment")}
                                        value={objDetailContract ? objDetailContract.DeviceTotal : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.receipt_detail.package")}
                                        value={objDetailContract ? objDetailContract.PackageTotal : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.receipt_detail.vat")}
                                        value={objDetailContract ? `${objDetailContract.VAT}%` : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.receipt_detail.total")}
                                        value={objDetailContract ? objDetailContract.Total : null}
                                    />
                                </View>
                            </View>
                            {/*...PICKER..*/}
                            <View style={{height: 10}}/>
                            {/*....*/}
                            <Text style={[styles.titleLeft, {fontSize: 14, fontWeight: '700'}]}>
                                {strings('open_safe.receipt_detail.payment')}
                            </Text>

                            {/*...METHOD-PAYMENT..*/}
                            <View style={{marginTop:10}}>
                                <ModalPicker
                                    ref="PaymentMethod"
                                    label={strings('open_safe.receipt_detail.payment_method')}
                                    options={this.state.listPaymentMethod}  //VAT
                                    placeholder={strings('open_safe.receipt_detail.choose_payment_method')}
                                    headerTitle={strings('open_safe.receipt_detail.payment_method')}
                                    getLabel={item => (item.Name)}
                                    defaultValue = {null }
                                    onValueChange={value => {
                                        this._onChangeValue(value)
                                    }}
                                    defVal={ '' }
                                />
                            </View>

                        </View>

                        {/*...BUTTON...*/}
                        <View>
                            <View style={{marginBottom: 24}}>
                                <TouchableOpacity
                                    style={styles.btnContainer}
                                    onPress={this.confirmPayment}
                                >
                                    <Text style={styles.btnText}>
                                        {strings("open_safe.receipt_detail.confirm")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/*.....*/}
                    </View>
                </ScrollView>
                {/*...POP-UP...*/}
                <TechLoading visible={this.state.loadingVisible}/>
                <PopupWarning ref="popup"/>
                <PopupAction
                    ref="popup_confirm"
                    actionCallback={this.submitPayment}
                />
                {/*.....*/}
            </View>
        );
    }
}


/*
*
* */
const mapStateToProps = state => {
    const userInfo = state.authReducer.userInfo;
    console.log('USER---', userInfo)

    return {
        userInfo
    }
}

const mapDispatchToProps = dispatch => {
    return {
        pushDataInfoRegistration, showTabBar
    }
}


/*
*
* */
export default connect(mapStateToProps, mapDispatchToProps)(ReceiptDetail);

