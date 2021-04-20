import React, {Component} from "react";
import {KeyboardAvoidingView, View, Text, ScrollView, Platform} from "react-native";
import {strings} from "locales/i18n";

// API
import * as api from "../api";

// REDUX
import {connect} from "react-redux";

// REDUX ACTION
import {actions} from "..";

const {nextStep, updateInfoExtraServiceForm, resetNavigationData} = actions;

// LIB CUSTOM
import InputO from "app-libs/components/input/InputO";
import PopupWarning from "app-libs/components/PopupWarning";
import TechLoading from "app-libs/components/TechLoading";
import NavigationService from "app-libs/helpers/NavigationService";

// HELPER
import {removeAllchar_type_02} from "app-libs/helpers/regex";

// STYLE
import styles from "../../customer-info/styles";
import cusInfStyle from "../styles";
import ols from "../../../styles/Ola-style";

// COMPONENT
import ButtonCreateInfo from "../../customer-info/components/ButtonCreateInfo";

class TotalAmountExtra extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataTemp: {
                step: 3
            },
            data: null,
            loadingVisible: false
        };
    }

    componentDidMount() {
        //
        this.props.navigation.addListener("willBlur", () => {
            // update dữ liệu của màn hình hiện tại lên store nếu không focus
            // this.props.updateInfoExtraServiceForm(this.state.data);
        });

        //
        this.props.navigation.addListener("willFocus", () => {

            // Tính tổng tiền
            setTimeout(() => {
                this.setState({
                    data: this.props.formData

                }, () => {

                    if (this.props.formData.ListServiceType[0].Id !== 5) {
                        // Tính tiền euipment hoặc IP
                        this._calcTotal(this.props.formData);

                    } else {
                        // Tính tổng tiền Internet Upgrade
                        this._calcINU_Total(this.props.formData);
                    }
                });

            }, 300);


        });
    }

    /**
     * Get total amount contract equipment & IP
     */
    _calcTotal = (formData) => {

        if (formData) {

            const myData = {
                LocationId: formData.LocationId,
                ListDevice: formData.ListDevice.ListEquipment,
                ListStaticIP: formData.ListStaticIP,
                Total: 0,
                Vat: 0,
            };

            //
            this._loading(true);

            //
            api.getRegistrationContractTotal(myData, (success, result, msg) => {

                //
                this._loading(false);

                if (success) {
                    if (result && result.length > 0) {

                        setTimeout(() => {
                            this.setState({
                                data: {
                                    Total: result[0].Total,
                                    DeviceTotal: result[0].DeviceTotal,
                                    StaticIPTotal: result[0].StaticIPTotal,
                                }
                            });
                        }, 50);

                        // Update Store global
                        // this.props.updateInfoExtraServiceForm(dataUpdate);
                    }

                } else {
                    // set lại là null cho total để tránh tạo hợp đồng sai amount nếu api get toltal lỗi
                    this.setState({
                        data: {
                            Total: null,
                            DeviceTotal: null,
                            StaticIPTotal: null
                        }
                    });

                    //
                    this._error(msg);
                }
            });
        }
    }

    /**
     * Get total amount contract internet upgrade
     */
    _calcINU_Total = (golbalData) => {
        //
        this._loading(true);

        //
        const {formData} = this.props;

        const myData = {
            LocalType: formData.LocalType,
            PromotionId: formData.PromotionId,
            MonthOfPrepaid: formData.MonthOfPrepaid,
            ListDevice: formData.ListDevice.ListEquipment,
            ConnectionFee: formData.ConnectionFee,
            LocationId: formData.LocationId,
            VAT: formData.VAT,
            Total: formData.Total,
            InternetTotal: formData.InternetTotal,
            DeviceTotal: formData.DeviceTotal,
            DepositFee: formData.DepositFee,
            OldMoney: formData.InternetUpgrade.OldMonthMoney
        };

        // Gọi api tính tổng tiền Internet Upgrade
        api.calcRegistrationContractUpgradeTotal(myData, (success, result, msg) => {

            //
            this._loading(false);

            //
            if (success) {

                this.setState({
                    data: {
                        Total: result.Total,
                        InternetTotal: result.InternetTotal,
                        DeviceTotal: result.DeviceTotal,
                        DepositFee: result.DepositFee,
                        ConnectionFee: result.ConnectionFee,
                        InternetUpgrade: {
                            ...formData.InternetUpgrade,
                            OldMonthMoney: result.OldMoney
                        },
                        VAT: formData.VAT,
                    }
                }, () => {
                    // Update Store global
                    // this.props.updateInfoExtraServiceForm(this.state.data);

                    // Tự động sửa format old month money
                    this._convertMoney('OldMonthMoney');
                });


            } else {
                // set lại là null cho total để tránh tạo hợp đồng sai amount nếu api get toltal lỗi
                this.setState({
                    data: {
                        ...this.state.data,
                        Total: null,
                        InternetTotal: null,
                        DeviceTotal: null,
                        DepositFee: null,
                        InternetUpgrade: {
                            ...formData.InternetUpgrade,
                            OldMonthMoney: 0
                        }
                    }
                });

                //
                this._error(msg);
            }
        });
    }

    /**
     *
     * @param {*} key
     */
    _convertMoney(key) {
        let {data} = this.state;
        let {OldMonthMoney} = data.InternetUpgrade

        if (key === 'OldMonthMoney' && OldMonthMoney !== '') {

            // trim all char, ',' v.v..
            let amount = removeAllchar_type_02(OldMonthMoney);
            let amountConvert;

            // more than '.',
            // ex: 100.000.000 false
            // ex: 100,000.000 true
            if (amount.split('.').length - 1 <= 1) {
                // convert money
                amountConvert = this._formatMoney(amount);

            } else {
                // error type money
                this._error({message: strings('dl.extra_service_info.service_type.err.OldMonthMoneyWrong')});

                // set value
                amountConvert = 0;
            }
            // set value
            data.InternetUpgrade[key] = amountConvert;

        }

        // set value "string", don't forget to convert to float
        this.setState(data);
        return;
    }

    /**
     *
     * @param {*} amount
     * @param {*} decimalCount
     * @param {*} decimal
     * @param {*} thousands
     */
    _formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
            if (amount == 0) {
                return amount.toString();
            }

            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = amount < 0 ? "-" : "";

            let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            return negativeSign
                + (j ? i.substr(0, j) + thousands : '')
                + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands)
                + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");

        } catch (e) {
            console.log(e);
            this._error({message: strings('dl.extra_service_info.service_type.err.OldMonthMoneyWrong')});
        }
    };

    /**
     * Validate form cusinfo
     */
    _isValidData = () => {
        const {data} = this.state;
        const {formData} = this.props;

        let errorList = [];

        // check Equipment total
        if (data && data.DeviceTotal != null) {
            this.refs["DeviceTotal"].setValid(true);
        } else {
            this.refs["DeviceTotal"].setValid(false);
            errorList.push({
                name: "DeviceTotal",
                msg: strings("dl.extra_service_info.total.err.EquipmentAmount")
            });
        }

        // Services Type
        if (formData.ListServiceType[0].Id !== 5) {

            // check Ip Total
            if (data && data.StaticIPTotal != null) {
                this.refs["IpTotal"].setValid(true);
            } else {
                this.refs["IpTotal"].setValid(false);
                errorList.push({
                    name: "IpTotal",
                    msg: strings("dl.extra_service_info.total.err.IpAmount")
                });
            }

        } else {

            // check Internet Total
            if (data && data.InternetTotal != null) {
                this.refs["InternetTotal"].setValid(true);
            } else {
                this.refs["InternetTotal"].setValid(false);
                errorList.push({
                    name: "InternetTotal",
                    msg: strings("dl.extra_service_info.total.err.InternetTotal")
                });
            }

            // check Old month Money
            if (data && data.InternetUpgrade && data.InternetUpgrade.OldMonthMoney != null) {
                this.refs["OldMonthMoney"].setValid(true);
            } else {
                this.refs["OldMonthMoney"].setValid(false);
                errorList.push({
                    name: "OldMonthMoney",
                    msg: strings("dl.extra_service_info.total.err.OldMonthMoney")
                });
            }

            // check Connection Fee
            if (data && data.ConnectionFee != null) {
                this.refs["ConnectionFee"].setValid(true);
            } else {
                this.refs["ConnectionFee"].setValid(false);
                errorList.push({
                    name: "ConnectionFee",
                    msg: strings("dl.extra_service_info.total.err.ConnectionFee")
                });
            }

            // check Vat
            if (data && data.VAT != null) {
                this.refs["VAT"].setValid(true);
            } else {
                this.refs["VAT"].setValid(false);
                errorList.push({
                    name: "VAT",
                    msg: strings("dl.extra_service_info.total.err.VAT")
                });
            }
        }


        // check Total
        if (data.Total != null) {
            this.refs["Total"].setValid(true);
        } else {
            this.refs["Total"].setValid(false);
            errorList.push({
                name: "Total",
                msg: strings("dl.extra_service_info.total.err.TotalAmount")
            });
        }

        // error list
        if (errorList.length == 0) {
            return true;
        }

        this.refs["popup"].getWrappedInstance().show(errorList[0].msg);
        return false;
    };

    /**
     * Submit
     */
    _onSubmit = () => {
        // validate
        if (!this._isValidData()) {
            return;
        }

        //
        const {formData} = this.props;
        const {data} = this.state;

        // convert money one more float
        if (formData.ListServiceType[0].Id === 5) {
            data.InternetUpgrade = {
                ...data.InternetUpgrade,
                OldMonthMoney: parseFloat(removeAllchar_type_02(data.InternetUpgrade.OldMonthMoney))
            }
        }

        //
        const myData = {
            data: {
                ...formData,
                ...data
            },
            url: formData.ListServiceType[0].Id !== 5
                ? '/RegistrationContract/UpdateRegistrationContract'						// Bán thêm: Equipment & IP
                : '/RegistrationContract/UpdateRegistrationContract_InternetUpgrade',		// Bán thêm: Internet Upgrade
        };

        //
        this._loading(true);
        //
        api.updateRegistrationContract(myData, (success, result, msg) => {

            //
            this._loading(false);

            //
            if (success) {
                if (result && result.length > 0) {
                    const res = result[0];

                    // update thêm RegId và RegCode lên store
                    this.props.updateInfoExtraServiceForm({
                        ...myData.data,
                        RegId: res.RegID,
                        RegCode: res.RegCode
                    });

                    // reset lại các thông số trên store để hiển thị trên tabar tương ứng nếu bấm update
                    this.props.resetNavigationData();

                    // navigate tới màn hình chi tiết phiếu bán thêm
                    setTimeout(() => {
                        // svType
                        // 1: Bán thêm: Equipment & IP
                        // 2: Bán thêm: Internet Upgrade
                        this.props.navigation.push("ExtraServiceCTDetail", {
                            RegID: res.RegID,
                            RegCode: res.RegCode,
                            svType: formData.ListServiceType[0].Id !== 5 ? 1 : 2
                        });
                    });
                }
            } else {
                this._error(msg);
            }
        });
    };

    /**
     * show Loi
     * @param err
     * @private
     */
    _error(err) {
        this._loading(false);
        this.refs["popup"].getWrappedInstance().show(err.message);
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

    /**
     *
     */
    render() {
        const {data} = this.state;
        const {formData} = this.props;

        return (
            <KeyboardAvoidingView
                keyboardVerticalOffset={Platform.select({ios: 150, android: 0})}
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={[styles.container, cusInfStyle.container]}
            >
                <ScrollView
                    keyboardDismissMode={"on-drag"}
                    contentContainerStyle={[
                        ols.wrapper_scrollview,
                        cusInfStyle.cus_scrollview
                    ]}
                >
                    <View style={[ols.inner_scrollview, ols.bgw, cusInfStyle.inner_scrollview]}>
                        <View>
                            {/*
								//-- Total amount
							*/}
                            <Text style={[styles.headline, ols.mgt15, ols.cl444, ols.fs14, ols.fw500]}>
                                {strings("extra_service.extra_service_info.total_of_cost.total_amount.block_title")}
                            </Text>

                            {
                                // render
                                formData.ListServiceType[0].Id !== 5
                                    ?
                                    // Equipment & IP
                                    <View>
                                        <View style={styles.container}>
                                            <InputO
                                                ref="DeviceTotal"
                                                label={strings("extra_service.extra_service_info.total_of_cost.total_amount.lb_equi")}
                                                placeholder={""}
                                                style={[styles.textInput, ols.fw500, ols.txtR]}
                                                placeholderTextColor="#444444"
                                                textAlign={"right"}
                                                autoCapitalize={"none"}
                                                returnKeyType={"done"}
                                                autoCorrect={false}
                                                editable={false}
                                                value={data && data["DeviceTotal"] ? `${data["DeviceTotal"]}` : '0'}
                                            />
                                        </View>
                                        <View style={styles.container}>
                                            <InputO
                                                ref="IpTotal"
                                                label={strings("extra_service.extra_service_info.total_of_cost.total_amount.lb_ip")}
                                                placeholder={""}
                                                style={[styles.textInput, ols.fw500, ols.txtR]}
                                                placeholderTextColor="#444444"
                                                textAlign={"right"}
                                                autoCapitalize={"none"}
                                                returnKeyType={"done"}
                                                autoCorrect={false}
                                                editable={false}
                                                value={data && data["StaticIPTotal"] ? `${data["StaticIPTotal"]}` : '0'}
                                            />
                                        </View>
                                    </View>
                                    :
                                    // Internet upgrade
                                    <View>
                                        <View style={styles.container}>
                                            <InputO
                                                ref="InternetTotal"
                                                label={strings("extra_service.extra_service_info.total_of_cost.total_amount.lb_internet")}
                                                placeholder={""}
                                                style={[styles.textInput, ols.fw500, ols.txtR]}
                                                placeholderTextColor="#444444"
                                                textAlign={"right"}
                                                autoCapitalize={"none"}
                                                returnKeyType={"done"}
                                                autoCorrect={false}
                                                editable={false}
                                                value={data && data["InternetTotal"] ? `${data["InternetTotal"]}` : '0'}
                                            />
                                        </View>
                                        <View style={styles.container}>
                                            <InputO
                                                ref="OldMonthMoney"
                                                label={strings("extra_service.extra_service_info.total_of_cost.total_amount.lb_oldMoney")}
                                                placeholder={""}
                                                style={[styles.textInput, ols.fw500, ols.txtR]}
                                                placeholderTextColor="#444444"
                                                textAlign={"right"}
                                                autoCapitalize={"none"}
                                                returnKeyType={"done"}
                                                autoCorrect={false}
                                                editable={false}
                                                value={data && data["InternetUpgrade"] ? `${data["InternetUpgrade"]["OldMonthMoney"]}` : '0'}
                                            />
                                        </View>
                                        <View style={styles.container}>
                                            <InputO
                                                ref="DeviceTotal"
                                                label={strings("extra_service.extra_service_info.total_of_cost.total_amount.lb_equi")}
                                                placeholder={""}
                                                style={[styles.textInput, ols.fw500, ols.txtR]}
                                                placeholderTextColor="#444444"
                                                textAlign={"right"}
                                                autoCapitalize={"none"}
                                                returnKeyType={"done"}
                                                autoCorrect={false}
                                                editable={false}
                                                value={data && data["DeviceTotal"] ? `${data["DeviceTotal"]}` : '0'}
                                            />
                                        </View>
                                        <View style={styles.container}>
                                            <InputO
                                                ref="ConnectionFee"
                                                label={strings("extra_service.extra_service_info.total_of_cost.total_amount.lb_confee")}
                                                placeholder={""}
                                                style={[styles.textInput, ols.fw500, ols.txtR]}
                                                placeholderTextColor="#444444"
                                                textAlign={"right"}
                                                autoCapitalize={"none"}
                                                returnKeyType={"done"}
                                                autoCorrect={false}
                                                editable={false}
                                                value={data && data["ConnectionFee"] ? `${data["ConnectionFee"]}` : '0'}
                                            />
                                        </View>
                                        <View style={styles.container}>
                                            <InputO
                                                ref="VAT"
                                                label={strings("extra_service.extra_service_info.total_of_cost.total_amount.lb_vat")}
                                                placeholder={""}
                                                style={[styles.textInput, ols.fw500, ols.txtR]}
                                                placeholderTextColor="#444444"
                                                textAlign={"right"}
                                                autoCapitalize={"none"}
                                                returnKeyType={"done"}
                                                autoCorrect={false}
                                                editable={false}
                                                value={data && data["VAT"] ? `${data["VAT"]}` : '0'}
                                            />
                                        </View>
                                    </View>
                            }

                            <View style={styles.container}>
                                <InputO
                                    ref="Total"
                                    label={strings("extra_service.extra_service_info.total_of_cost.total_amount.lb_total")}
                                    placeholder={""}
                                    style={[styles.textInput, ols.fw500, ols.txtR]}
                                    placeholderTextColor="#444444"
                                    textAlign={"right"}
                                    autoCapitalize={"none"}
                                    returnKeyType={"done"}
                                    autoCorrect={false}
                                    editable={false}
                                    value={data && data["Total"] ? `${data["Total"]}` : '0'}
                                />
                            </View>
                        </View>

                        {/*
							//-- next button
						*/}
                        <View>
                            <ButtonCreateInfo
                                label={
                                    !formData.RegCode
                                        ? strings("customer_info.customer_info.form.btnCreate_label")
                                        : strings("customer_info.customer_info.form.btnUpdate_label")
                                }
                                style={{marginBottom: 24}}
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
    const extraServiceState = state.extraServiceInfoReducer;

    return {
        formData: extraServiceState && extraServiceState.formData
    };
}

export default connect(mapStateToProps, {nextStep, updateInfoExtraServiceForm, resetNavigationData})(TotalAmountExtra);
