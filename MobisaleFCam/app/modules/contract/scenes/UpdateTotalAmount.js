import React from 'react';
import { View, ScrollView, Text, StyleSheet, KeyboardAvoidingView, ActivityIndicator, Platform } from 'react-native';
import { connect } from 'react-redux';
import { strings } from 'locales/i18n';

import moduleStyle from '../styles';

// Component    
import PickerMultiSearchInput from 'app-libs/components/input/PickerMultiSearchInput';
import PickerSearchInput from 'app-libs/components/input/PickerSearchInput';
import ButtonElement from 'app-libs/components/input/ButtonElement';
import PickerCLKMInput from 'app-libs/components/input/PickerCLKMInput';
import FormDeviceList from '../components/FormDeviceList';
import TechLoading from 'app-libs/components/TechLoading';
import PopupWarning from 'app-libs/components/PopupWarning';
import mapUpdateTotalAmount from '../helpers/mapUpdateTotalAmount';
import ButtonBorder from '../components/ButtonBorder';
import InputO from 'app-libs/components/input/InputO';
// State Global
import * as api from '../api';

// Style
import ols from '../../../styles/Ola-style';

/**
 * Man hinh tinh tong tien
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
class UpdateTotalAmount extends React.Component {
    static navigationOptions = {
        title: strings('contract.update_total.title'),
        headerRight: <View />
    }

    constructor(props) {
        super(props);

        this.state = {
            data: null,
            loadingVisible: false,
            newPrice: {},
            isChangeFee: false // check thay doi phi dich vu
        };

    }

    /**
     * Load data detail khi man hinh dc render
     */
    componentDidMount() {
        const data = this.props.navigation.state.params;
        //const data = {RegID: 1031, RegCode: 'ZSRDG36007'};

        this.showLoading(true);
        api.getRegistrationById(data, this.loadDetailSuccess.bind(this));
    }

    /**
     * Fetch data khi load detail thanh cong
     * 
     * @param {*} isSucess 
     * @param {*} data 
     * @param {*} msg 
     */
    loadDetailSuccess(isSucess, data, msg) {
        this.showLoading(false);

        if (!isSucess) {
            this.refs['popup'].getWrappedInstance().show(msg.message);
            return;
        }

        const mapData = mapUpdateTotalAmount(data);

        this.setState({
            data: mapData,
            newPrice: {
                Total: data.Total,
                InternetTotal: data.InternetTotal,
                DeviceTotal: data.DeviceTotal,
                DepositFee: data.DepositFee,
                ConnectionFee: data.ConnectionFee
            }
        });
    }

    /**
     * Hien thi loading
     * 
     * @param {*} isShow 
     */
    showLoading(isShow) {
        this.setState({
            loadingVisible: isShow
        });
    }

    /**
     * Xu ly thay doi goi dich vu internet
     * 
     * @param {*} selectItem 
     */
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
                },
                isChangeFee: true
            }
        });
    }

    /**
     * Xu ly thay doi gia tri cac picker
     * 
     * @param {*} name 
     * @param {*} selectItem 
     */
    changePickerValue(name, selectItem) {
        const data = this.state.data;

        if (data[name] == selectItem) {
            return;
        }

        if (name === 'Promotion') {
            data['Device'] = {
                List: [],
                DeviceTotal: 0
            };
        }

        data[name] = selectItem;
        this.setState({
            data: data,
            isChangeFee: true
        });
    }

    /**
     * Tinh tong tien
     */
    calcTotalAmount() {
        if (!this.isValidData()) {
            return false;
        }

        this.showLoading(true);
        const { data } = this.state;
        const formData = {
            VAT: data.VAT.Id,
            LocationId: data.LocationId,
            LocalType: data.LocalType.Id,
            PromotionId: data.Promotion.Id,
            MonthOfPrepaid: data.Promotion.MonthOfPrepaid,
            InternetTotal: data.InternetTotal,
            DeviceTotal: data.Device.DeviceTotal,
            DepositFee: data.DepositFee.Id,
            ConnectionFee: data.ConnectionFee.Id,
            ListDevice: data.Device.List
        };

        api.caclRegistrationTotal(formData, (isSuccess, data, msg) => {
            this.showLoading(false);

            if (!isSuccess) {
                this.refs['popup'].getWrappedInstance().show(msg.message);
                return;
            }

            // Cap nhat gia tien moi
            this.setState({
                newPrice: data,
                isChangeFee: false
            });
        });
    }

    /**
     * Xu ly cap nhat tong tien
     */
    processUpdateAmount() {
        if (!this.isValidData()) {
            return false;
        }

        if (this.state.isChangeFee) {
            this.refs['popup'].getWrappedInstance().show(strings('dl.contract.update_total.err.no_calc_amount'));
            return;
        }

        // goi api cap nhat tong tien
        const { data, newPrice } = this.state;
        const formData = {
            ObjId: data.ObjId,
            Contract: data.Contract,
            VAT: data.VAT.Id,
            LocationId: data.LocationId,
            UserName: this.props.Username,
            LocalType: data.LocalType.Id,
            PromotionId: data.Promotion.Id,
            MonthOfPrepaid: data.Promotion.MonthOfPrepaid,
            Total: newPrice.Total,
            InternetTotal: newPrice.InternetTotal,
            DeviceTotal: newPrice.DeviceTotal,
            DepositFee: newPrice.DepositFee,
            ConnectionFee: newPrice.ConnectionFee,
            ListDevice: data.Device.List
        };

        api.updateRegistrationTotal(formData, (isSuccess, data, msg) => {
            // Xu ly thanh cong quay tro ve man hinh chi tiet hop dong
            if (isSuccess) {
                this.props.navigation.goBack();
                return;
            }

            // hien thong bao
            this.refs['popup'].getWrappedInstance().show(msg.message);
        });
    }

    /**
     * Validate du lieu
     */
    isValidData() {
        const { data } = this.state;
        let errorList = [];

        // Check Service Type
        if (data.ServiceType == null) {
            this.refs['ServiceType'].setValid(false);

            errorList.push({
                name: 'ServiceType',
                msg: strings('dl.contract.update_total.err.ServiceType')
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
                msg: strings('dl.contract.update_total.err.LocalType')
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
                msg: strings('dl.contract.update_total.err.Promotion')
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
                msg: strings('dl.contract.update_total.err.ConnectionFee')
            });
        }
        else {
            this.refs['ConnectionFee'].setValid(true);
        }

        // Check VAT
        if (data.VAT == null) {
            this.refs['VAT'].setValid(false);

            errorList.push({
                name: 'VAT',
                msg: strings('dl.contract.update_total.err.VAT')
            });
        }
        else {
            this.refs['VAT'].setValid(true);
        }

        // Check DepositFee
        if (data.DepositFee == null) {
            this.refs['DepositFee'].setValid(false);

            errorList.push({
                name: 'DepositFee',
                msg: strings('dl.contract.update_total.err.DepositFee')
            });
        }
        else {
            this.refs['DepositFee'].setValid(true);
        }

        if (errorList.length == 0) {
            return true;
        }

        this.refs['popup'].getWrappedInstance().show(errorList[0].msg);
        return false;
    }

    /**
     * Render man hinh
     */
    render() {
        // Loading cho load du lieu
        if (!this.state.data) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#ccc" />
                </View>
            );
        }

        // Luc load du lieu thanh cong
        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ ios: 70, android: 0 })}
                behavior={(Platform.OS === 'ios') ? "padding" : null}
                style={[ols.container_keyboard]} >

                <ScrollView
                    keyboardDismissMode={'on-drag'}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >

                    <View style={[ols.inner_scrollview, ols.bgw, { paddingHorizontal: 0 }]} >

                        {
                            // SERVICES TYPE
                        }
                        <View style={[styles.container, ols.mgt15,]}>
                            <PickerMultiSearchInput
                                ref="ServiceType"
                                label={strings('contract.update_total.form.serviceType_label')}
                                placeholder={strings('contract.update_total.form.serviceType_placeholder')}
                                filterText={strings('contract.update_total.form.serviceType_filterText')}
                                getOptionData={api.loadServiceType}
                                params={{ Username: this.props.Username }}
                                allowRefresh={false}
                                value={this.state.data.ServiceType}
                                onChange={(selectedItem) => this.changePickerValue('ServiceType', selectedItem)}
                            />
                        </View>

                        <View style={[styles.seperator2]}></View>

                        {
                            // INTERNET
                        }
                        <View style={[styles.container]}>
                            <Text style={[ols.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('contract.contract_detail.contract_no')}
                            </Text>
                            <InputO
                                ref="txtSubject"
                                style={[styles.textInput, ols.fw500]}
                                label={strings('contract.contract_detail.contract_no')}
                                placeholder=''
                                placeholderTextColor='#444444'
                                textAlign={'right'}
                                autoCapitalize={'none'}
                                returnKeyType={'default'}
                                autoCorrect={false}
                                value={this.state.data.Contract}
                                editable={false}
                            />

                            <Text style={[ols.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('contract.update_total.internet')}
                            </Text>
                            <PickerSearchInput
                                ref="LocalType"
                                label={strings('contract.update_total.form.localType_label')}
                                placeholder={strings('contract.update_total.form.localType_placeholder')}
                                filterText={strings('contract.update_total.form.localType_filterText')}
                                getOptionData={api.loadLocalTypeList}
                                params={{ Username: this.props.Username, Kind: this.state.data.Kind }}
                                allowRefresh={false}
                                value={this.state.data.LocalType}
                                onChange={this.changeLocalType.bind(this)}
                            />

                            {
                                // PREPAID PROMOTION
                            }
                            <Text style={[ols.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('contract.update_total.promotion')}
                            </Text>
                            <PickerCLKMInput
                                ref="Promotion"
                                label={strings('contract.update_total.form.promotion_label')}
                                placeholder={strings('contract.update_total.form.promotion_placeholder')}
                                filterText={strings('contract.update_total.form.promotion_filterText')}
                                seletedText={strings('contract.update_total.form.promotion_seletedText')}
                                getOptionData={api.loadPromotionList}
                                params={{ Username: this.props.Username, LocationID: this.state.data.LocationId, LocalTypeID: this.state.data.LocalType ? this.state.data.LocalType.Id : null }}
                                allowRefresh={false}
                                value={this.state.data.Promotion}
                                onChange={(selectedItem) => this.changePickerValue('Promotion', selectedItem)}
                            />

                            <PickerSearchInput
                                ref="ConnectionFee"
                                label={strings('contract.update_total.form.connectionFee_label')}
                                placeholder={strings('contract.update_total.form.connectionFee_placeholder')}
                                filterText={strings('contract.update_total.form.connectionFee_filterText')}
                                getOptionData={api.loadConnectionFeeList}
                                params={{ LocationId: this.state.data.LocationId }}
                                allowRefresh={false}
                                value={this.state.data.ConnectionFee}
                                onChange={(selectedItem) => this.changePickerValue('ConnectionFee', selectedItem)}
                            />
                        </View>

                        <View style={styles.container}>
                            <Text style={[ols.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('contract.update_total.device')}
                            </Text>
                            <FormDeviceList
                                label={strings('contract.update_total.form.listDevice_label')}
                                placeholder={strings('contract.update_total.form.listDevice_placeholder')}
                                filterText={strings('contract.update_total.form.listDevice_filterText')}
                                unitLabel={strings('contract.update_total.form.listDevice_unitPrice')}
                                amountLabel={strings('contract.update_total.form.listDevice_amount')}
                                getOptionData={api.loadDeviceList}
                                params={{ LocationId: this.state.data.LocationId, MonthOfPrepaid: this.state.data.Promotion ? this.state.data.Promotion.MonthOfPrepaid : null, LocalType: this.state.data.LocalType ? this.state.data.LocalType.Id : null }}
                                allowRefresh={false}
                                value={this.state.data.Device}
                                onChange={(selectedItem) => this.changePickerValue('Device', selectedItem)}
                            />

                            <Text style={[ols.headline, ols.mgt05, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings('contract.update_total.other_fee')}
                            </Text>
                            <PickerSearchInput
                                ref="VAT"
                                label={strings('contract.update_total.form.vat_label')}
                                placeholder={strings('contract.update_total.form.vat_placeholder')}
                                filterText={strings('contract.update_total.form.vat_filterText')}
                                getOptionData={api.getVatList}
                                allowRefresh={false}
                                value={this.state.data.VAT}
                                onChange={(selectedItem) => this.changePickerValue('VAT', selectedItem)}
                            />

                            <PickerSearchInput
                                ref="DepositFee"
                                label={strings('contract.update_total.form.deposit_label')}
                                placeholder={strings('contract.update_total.form.deposit_placeholder')}
                                filterText={strings('contract.update_total.form.deposit_filterText')}
                                getOptionData={api.getDepositList}
                                params={{ LocationId: this.state.data.LocationId }}
                                allowRefresh={false}
                                value={this.state.data.DepositFee}
                                onChange={(selectedItem) => this.changePickerValue('DepositFee', selectedItem)}
                            />

                            <ButtonBorder
                                style={{ marginTop: 10 }}
                                title={strings('contract.update_total.btnCalcAmount')}
                                onPress={this.calcTotalAmount.bind(this)}
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                                <View style={styles.boxTotal}>
                                    <Text style={styles.boxTotalLabel}>{strings('contract.update_total.new_total')}</Text>
                                    <Text style={styles.boxTotalValue}>{this.state.newPrice.Total}</Text>
                                </View>

                                <View style={styles.boxTotal}>
                                    <Text style={styles.boxTotalLabel}>{strings('contract.update_total.current_total')}</Text>
                                    <Text style={styles.boxTotalValue}>{this.state.data.Total}</Text>
                                </View>
                            </View>

                            <View style={styles.boxCL}>
                                <Text style={styles.boxCLLabel}>{strings('contract.update_total.difference')}</Text>
                                <Text style={styles.boxCLValue}>{(this.state.newPrice.Total - this.state.data.Total).toFixed(2)}</Text>
                            </View>
                        </View>

                        <View style={styles.buttonContainer}>
                            <ButtonElement
                                title={strings('contract.update_total.btnUpdate')}
                                onPress={this.processUpdateAmount.bind(this)}
                            />
                        </View>
                    </View>
                </ScrollView>

                <PopupWarning ref="popup" />
                <TechLoading visible={this.state.loadingVisible} />
            </KeyboardAvoidingView >
        );
    }
}

export default connect((state) => {
    return {
        SaleId: state.authReducer.userInfo.SaleId,
        Username: state.authReducer.userInfo.UserName
    }
}, null)(UpdateTotalAmount);


const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24
    },
    buttonContainer: {
        paddingHorizontal: 24,
        marginVertical: 24,
    },
    seperator: {
        // borderTopColor: '#c2d0e2',
        // borderTopWidth: 2,
        // paddingTop: 15,
        // marginTop: 15
    },
    seperator2: {
        borderTopColor: '#C2D0E2', borderTopWidth: 1,
        marginTop: 5, marginBottom: 10,
    },
    boxTotal: {
        backgroundColor: 'rgba(158, 201, 255, 0.3)',
        borderRadius: 6,
        width: '47%',
        paddingHorizontal: 12,
        paddingVertical: 10
    },
    boxTotalLabel: {
        color: '#323232',
        fontSize: 14,
    },
    boxTotalValue: {
        color: '#0b76ff',
        fontSize: 24,
        fontWeight: '500'
    },

    boxCL: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'rgba(158, 201, 255, 0.3)',
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginTop: 12
    },
    boxCLLabel: {
        color: '#323232',
        fontSize: 16,
    },
    boxCLValue: {
        color: '#ff5050',
        fontSize: 24,
        fontWeight: '500'
    },
    textInput: {
        height: 36,
        paddingRight: 12,
        fontSize: 12,
        borderColor: 'transparent',
        borderWidth: 0.5,
        color: 'rgba(0, 0, 0, 0.38)',
    }
});