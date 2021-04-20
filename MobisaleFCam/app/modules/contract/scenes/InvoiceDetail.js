// LIB
import React from 'react';
import {connect} from 'react-redux';
import {View, ScrollView, Text, StyleSheet, Platform, KeyboardAvoidingView} from 'react-native';
import {strings} from 'locales/i18n';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PickerInputDynamic from 'app-libs/components/input/PickerInputDynamic';
import TechLoading from 'app-libs/components/TechLoading';
import PopupWarning from 'app-libs/components/PopupWarning';
import PopupAction from 'app-libs/components/PopupAction';

// API
import * as api from '../api';

// COMPONENT
import RowInfoLarge from '../components/RowInfoLarge';

// STYLE
import moduleStyle from '../styles';
import ols from '../../../styles/Ola-style';

class InvoiceDetail extends React.Component
{
    static navigationOptions = {
        title: strings('contract.invoice_detail.title'),
        headerRight: <View/>
    }

    constructor(props) {
        super(props);

        this.state = {
            loadingVisible: false,
            params: this.props.navigation.state.params,
            // params: {Contract:"PPFI20153",ObjID:2210263},
            info: {},
            data: {
                PaymentMethod: {}
            }
        }
    }

    /**
     * Khi render man hinh lan dau tien. Goi API lay thong tin chi tiet
     */
    componentDidMount() {
        // load detail
        this.showLoading(true);
        api.getContractDetail(this.state.params, this.loadDetailSuccess.bind(this));
    }

    /**
     * 
     * @param {*} callback 
     */
    loadPaymentMethod(callback) {
        callback(this.state.listPaymentMethod);
    }


    /**
     * Callback khi load detail contract thanh cong. Hien thi du lieu ra view
     * 
     * @param boolean isSucess 
     * @param object data 
     * @param object msg 
     */
    loadDetailSuccess(isSucess, data, msg) {

        if (isSucess) {
            // thay doi state de load du lieu ra
            this.setState({
                info: data
            });

            // load payment method
            api.getPaymentMethodList({
                // Nếu là bán mới truyền PaymentType=1, nếu là bán thêm truyền PaymentType=2
                PaymentType: 1   
            },(data) => {
                this.showLoading(false);

                this.setState({
                    listPaymentMethod: data
                });
            });
            return;
        }

        // Hien thi thong bao loi
        this.showLoading(false);
        this.refs['popup'].getWrappedInstance().show(msg.message);
    }

    /**
     * An/Hien loading
     * 
     * @param boolean isShow 
     */
    showLoading(isShow) {
        this.setState({
            loadingVisible: isShow
        });
    }

    /**
     * Ham goi khi nhan nut xac nhan thanh toan
     */
    onSubmit() {
        // Validate du lieu
        if (! this.isValidData()) {
            return;
        }

        const en = strings('dl.contract.invoice_detail.confirm_pay');
        const km = strings('dl.contract.invoice_detail.confirm_pay_km');

        // Hien thong bao xac nhan
        this.refs['popup_confirm'].getWrappedInstance().show(en + this.state.info.Contract + '?\n\n' + km + this.state.info.Contract + '?');
    }

    /**
     * Xu ly validate du lieu
     */
    isValidData() {
        const {data} = this.state;
        let errorList = [];

        // Check PaymentMethod
        if (! data.PaymentMethod.Id) {
            this.refs['PaymentMethod'].setValid(false);

            errorList.push({
                name: 'PaymentMethod',
                msg: strings('dl.contract.invoice_detail.err.PaymentMethod')
            });
        }
        else {
            this.refs['PaymentMethod'].setValid(true);
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    /**
     * Xu ly callback lai khi nhan nut confirm o popup xac nhan
     */
    paymentProcess() {
        this.showLoading(true);
        const data = this.state.data;
        
        // Khoi tao data goi API thanh toan
        const myData = {
            Username: this.props.Username,
            ObjID: this.state.info.ObjId,
            PaymentMethod: data.PaymentMethod.Id,
            RegCode: this.state.info.RegCode
        };
        
        api.updatePayment(myData, (isSuccess, data, msg) => {
            this.showLoading(false);

            // Thanh cong thi chuyen sang trang detail
            if (isSuccess) {
                // Thanh Toán qua WING === 3
                NavigationService.navigate(myData.PaymentMethod === 3 ? 'PaymentQrCode' : 'ContractDetail', this.state.params);
                return;
            }

            // Hien thi popup khi co loi xay ra
            this.refs['popup'].getWrappedInstance().show(msg.message);
        });
    }

    /**
     * Change data dung cho picker phuong thuc thanh toan
     * 
     * @param string name 
     * @param object selectItem 
     */
    changePickerValue(name, selectItem) {
        const data = this.state.data;

        if (data[name] == selectItem) {
            return;
        }

        data[name] = selectItem;
        
        this.setState({
            data: data
        });
    }

    /**
     * Render man hinh chinh
     */
    render() {
        const {info} = this.state;

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
                            <View style={[{paddingVertical: 15}]}>
                                <Text style={moduleStyle.textTitle}>{strings('contract.invoice_detail.service_info')}</Text>
                                <View>
                                    <RowInfoLarge
                                        label={strings('contract.invoice_detail.internet')}
                                        text={ info && info.InternetTotal ? info.InternetTotal : "0"}
                                    />

                                    <RowInfoLarge
                                        label={strings('contract.invoice_detail.device')}
                                        text={ info && info.DeviceTotal ? info.DeviceTotal: "0" }
                                    />

                                    <RowInfoLarge
                                        label={strings('contract.invoice_detail.ip')}
                                        text={
                                            info && 
                                            info.ListStaticIP && 
                                            info.ListStaticIP.length > 0 
                                            ?
                                                info.ListStaticIP[0].Total
                                            : "0" }
                                    />

                                    <RowInfoLarge
                                        label={strings('contract.invoice_detail.connection_fee')}
                                        text={info && info.ConnectionFee ? info.ConnectionFee : "0"}
                                    />

                                    <RowInfoLarge
                                        label={strings('contract.invoice_detail.deposit_fee')}
                                        text={info && info.DepositFee ? info.DepositFee : "0"}
                                    />

                                    <RowInfoLarge
                                        label={strings('contract.invoice_detail.vat')}
                                        text={info && info.VAT ? info.VAT : "0"}
                                    />

                                    <RowInfoLarge
                                        label={strings('contract.invoice_detail.total')}
                                        text={info && info.Total ? info.Total : "0"}
                                    />
                                </View>
                                
                                <Text style={[moduleStyle.textTitle, moduleStyle.boxSpace]}>{strings('contract.invoice_detail.payment')}</Text>
                                <View>
                                    <PickerInputDynamic
                                        ref="PaymentMethod"
                                        prompt={strings('contract.invoice_detail.payment_method')}
                                        defaultValue={{Name: "Choose payment method"}}
                                        label={strings('contract.invoice_detail.payment_method')}
                                        getOptionData={this.loadPaymentMethod.bind(this)}
                                        onBeforeLoad={() => this.showLoading(true)}
                                        onAfterLoad={() => this.showLoading(false)}
                                        onValueChange={(selectedItem) => this.changePickerValue('PaymentMethod', selectedItem)}
                                    />
                                </View>
                            </View>

                            <View>
                                <View style={styles.buttonContainer}>
                                    <ButtonElement 
                                        title={strings('contract.invoice_detail.btnConfirm')}
                                        onPress={this.onSubmit.bind(this)}
                                    />
                                </View>
                            </View>
                    </View>
                </ScrollView>

                <TechLoading visible={this.state.loadingVisible}/>
                <PopupWarning ref="popup"/>
                <PopupAction
                    ref="popup_confirm"
                    actionCallback={this.paymentProcess.bind(this)}
                />
            </KeyboardAvoidingView>         
        );
    }
}

export default connect((state) => {
    return {
        Username: state.authReducer.userInfo.UserName
    }
}, null)(InvoiceDetail);


const styles = StyleSheet.create({
    buttonContainer: {
        marginBottom: 24,
    },
    textBold: {
        fontWeight: '500'
    }
});