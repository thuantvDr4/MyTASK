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

// STYLE
import ols from "../../../styles/Ola-style";
import styles from "../DetailCustomer.styles";
import moduleStyle from "../../extra-service/styles";


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

        this.state = {
            loadingVisible: false,
            objDetailCus: null,
            RegId: this.props.navigation.getParam("RegID", "0"),
            RegCode: this.props.navigation.getParam("RegCode", "0")
        };
        this.props.navigation.setParams({visible: false});
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => {
            const {navigation} = this.props;
            const myData = {
                RegID: navigation.getParam("RegID", "0"),
                RegCode: navigation.getParam("RegCode", "0")
            };

            // this._handleLoadInfoCus(myData);
            // this.props.showTabBar(false);
        });
    }

    componentWillUnmount() {
        this.props.showTabBar(true);
    }

    /**
     * Refresh data khi navigation back. Fix truong hop upload anh roi quay troi lai
     */
    loadData() {
        this._loading(false);
        const myData = {
            RegID: this.state.RegId,
            RegCode: this.state.RegCode
        };

        this._handleLoadInfoCus(myData);
    }

    _handleLoadInfoCus(myData) {
        this._loading(true);

        api.GetRegistrationDetail(myData, (success, result, msg) => {

            if (success) {
                this.setState({
                    loadingVisible: false,
                    objDetailCus: result[0],
                    RegId: myData.RegID,
                    RegCode: myData.RegCode
                });
            } else {
                this._loading(false);
                this._errorMsg(msg.message);
            }
        });
    }


    /*
    * _handleUpdateInfo
    * */
    _handleUpdateInfo = () => {
        NavigationService.navigate("OpenSafe_Info", {});
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
        * createContract
        * */
    confirmPayment = () => {
        // Validate du lieu
        const en = strings('dl.contract.invoice_detail.confirm_pay');
        const km = strings('dl.contract.invoice_detail.confirm_pay_km');
        const _contractNo = 'NO_999999999'

        // Hien thong bao xac nhan
        this.refs['popup_confirm'].getWrappedInstance().show(en + `${_contractNo}` + '?\n\n' + km + `${_contractNo}` + '?');
    }


    /*
    * RENDER-RETURN
    *
    * */
    render() {
        const {objDetailCus} = this.state;

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
                                        value={objDetailCus ? objDetailCus.FullName : '140'}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.receipt_detail.package")}
                                        value={objDetailCus ? objDetailCus.RegCode : '20'}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.receipt_detail.vat")}
                                        value={objDetailCus ? objDetailCus.Phone1 : '10%'}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.receipt_detail.total")}
                                        value={objDetailCus ? objDetailCus.Phone1 : '176'}
                                    />
                                </View>
                            </View>
                            {/*...PICKER..*/}
                            <View style={{height: 10}}/>
                            {/*....*/}
                            <Text style={[styles.titleLeft, {fontSize: 14, fontWeight: '700'}]}>
                                {strings('open_safe.receipt_detail.payment')}
                            </Text>
                            {/*.....*/}
                            <View style={{marginTop:10}}>
                                <PickerInputDynamic
                                    ref="PaymentMethod"
                                    prompt={strings('open_safe.receipt_detail.payment_method')}
                                    label={strings('open_safe.receipt_detail.payment_method')}
                                    getOptionData={()=>{}}
                                    onBeforeLoad={() => this.showLoading(true)}
                                    onAfterLoad={() => this.showLoading(false)}
                                    defaultValue={{Name: "Choose payment method"}}
                                    onValueChange={(selectedItem) => console.log('PaymentMethod', selectedItem)}
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
                    actionCallback={()=>console.log('Call back confirm')}
                />
                {/*.....*/}
            </View>
        );
    }
}

export default connect(
    state => {
        return {};
    },
    {pushDataInfoRegistration, showTabBar}
)(ReceiptDetail);
