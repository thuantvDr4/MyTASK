// LIB
import React, {Component} from "react";
import {Text, ScrollView, View, TouchableOpacity} from "react-native";

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
import SearchPickerCLKMItem from "app-libs/components/SearchPickerCLKMItem";
import TechLoading from "app-libs/components/TechLoading";
import PopupWarning from "app-libs/components/PopupWarning";
import TextInfo from "app-libs/components/input/TextInfo";
import NavigationService from "app-libs/helpers/NavigationService";
// import RowInfo from '../components/RowInfo';

// STYLE
import ols from "../../../styles/Ola-style";
import styles from "../DetailCustomer.styles";

class DetailCustomersInfo extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings("list_customer_info.detail.title"),
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

        this._handleUpdateBookport = this._handleUpdateBookport.bind(this);
        this._handleUpdateInfo = this._handleUpdateInfo.bind(this);
        // this._naviToViewDownloadImg = this._naviToViewDownloadImg.bind(this);
        this._error = this._error.bind(this);
        this._errorMsg = this._errorMsg.bind(this);
        this._loading = this._loading.bind(this);
        this.props.navigation.setParams({visible: false});
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => {
            const {navigation} = this.props;
            const myData = {
                RegID: navigation.getParam("RegID", "0"),
                RegCode: navigation.getParam("RegCode", "0")
            };

            this._handleLoadInfoCus(myData);
            this.props.showTabBar(false);
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

    _handleUpdateBookport() {
        this._loading(true);
        const myData = {
            RegID: this.state.objDetailCus.RegId,
            RegCode: this.state.objDetailCus.RegCode
        };

        const {navigation} = this.props;

        api.GetRegistrationByID(myData, (success, result, msg) => {
            if (success) {
                let objResult = result[0];
                objResult.FullAddress = objResult.Address;

                this.props.showTabBar(true);

                this.props.pushDataInfoRegistration(objResult).then(() => {
                    this._loading(false);
                    setTimeout(() => {
                        NavigationService.navigate("BookPort", {lciDetailCustomer: true});
                    }, 500);
                });
            } else {
                this._errorMsg(msg.message);
            }
        });
    }

    _handleUpdateInfo() {
        this._loading(true);
        const myData = {
            RegID: this.state.objDetailCus.RegId,
            RegCode: this.state.objDetailCus.RegCode
        };

        const {navigation} = this.props;

        api.GetRegistrationByID(myData, (success, result, msg) => {
            if (success) {
                let objResult = result[0];
                objResult.FullAddress = objResult.Address;

                this.props.showTabBar(true);

                this.props.pushDataInfoRegistration(objResult).then(() => {
                    this._loading(false);
                    setTimeout(() => {
                        NavigationService.navigate("CustomerInfo", {
                            lciDetailCustomer: true,
                            titleNav: strings("customer_info.titleNavigation.update")
                        });
                    }, 500);
                });
            } else {
                this._errorMsg(msg.message);
            }
        });
    }

    /**
     * Get token and pass to view image
     */
    _naviToViewDownloadImg() {
        // goi API generation Token
        this._loading(true);
        api.getSystemApiToken({}, (success, result, msg) => {
            this._loading(false);

            if (success) {
                NavigationService.navigate("lciViewCustomerImage", {
                    listImage: this.state.objDetailCus.ImageInfo,
                    dataSystemApiToken: result[0].Token
                });
            } else {
                this._error(msg);
            }
        });

        // NavigationService.navigate('lciViewCustomerImage', {listImage: this.state.objDetailCus.ImageInfo});
    }

    /**
     * show Loi
     * @param err
     * @private
     */
    _error(err) {
        this._loading(false);
        if (!err.message) return;
        this.refs["popup"].getWrappedInstance().show(err.message);
    }

    _errorMsg(err) {
        this._loading(false);
        if (!err) return;
        this.refs["popup"].getWrappedInstance().show(err.toString());
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

    viewContract() {
        const {objDetailCus} = this.state;

        if (!objDetailCus) {
            return;
        }

        // Chua bookport
        if (objDetailCus.IsBookPort === 0) {
            this.refs["popup"]
                .getWrappedInstance()
                .show(strings("dl.list_customer_info.detail.notiPop"));
            return;
        }

        // chua cap nhat hinh anh
        if (!objDetailCus.IsUpdateImage) {
            this.refs["popup"]
                .getWrappedInstance()
                .show(strings("dl.list_customer_info.detail.noti"));
            return;
        }

        // goi API generation Token
        this._loading(true);
        api.getSystemApiToken({}, (success, result, msg) => {
            this._loading(false);

            if (success) {
                NavigationService.navigate("Contract", {
                    RegID: this.state.RegId,
                    RegCode: this.state.RegCode,
                    dataSystemApiToken: result[0].Token
                });
            } else {
                this._error(msg);
            }
        });

        // NavigationService.navigate('Contract', {RegID : this.state.RegId, RegCode : this.state.RegCode});
    }

    render() {
        const {objDetailCus} = this.state;

        console.log(objDetailCus);

        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardDismissMode={"on-drag"}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview, {justifyContent: "space-between", backgroundColor: "#F8F9FB"}]}>
                        <View>
                            {/*
                                // ---- POP info
                            */}
                            <View style={styles.bookportContainer}>
                                <View style={styles.titleBox}>
                                    <Text style={styles.titleLeft}>
                                        {strings("list_customer_info.detail.info_point_group")}
                                    </Text>
                                    <TouchableOpacity onPress={this._handleUpdateBookport}>
                                        <Text style={styles.titleRight}>
                                            {strings("list_customer_info.detail.update")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.innerbookport}>
                                    <TextInfo
                                        styleWrapper={{...styles.wrapperOne, alignItems: "center"}}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.pop")}
                                        value={objDetailCus ? objDetailCus.GroupPoints : null}
                                    />
                                </View>
                            </View>

                            {/*
                                // ---- Customer infomation
                            */}
                            <View style={styles.topContainer}>
                                <View style={styles.titleBox}>
                                    <Text style={styles.titleLeft}>
                                        {strings("list_customer_info.detail.customer_information")}
                                    </Text>
                                    <TouchableOpacity onPress={this._handleUpdateInfo}>
                                        <Text style={styles.titleRight}>
                                            {strings("list_customer_info.detail.update")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inner}>
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.Status")}
                                        value={objDetailCus ? objDetailCus.RegStatus : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.fullname")}
                                        value={objDetailCus ? objDetailCus.FullName : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.Reg_Code")}
                                        value={objDetailCus ? objDetailCus.RegCode : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.phone")}
                                        value={objDetailCus ? objDetailCus.Phone1 : null}
                                    />

                                    <TextInfo
                                        styleWrapper={{...styles.wrapperOne}}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.address")}
                                        value={objDetailCus ? objDetailCus.Address : null}
                                    />

                                    <View style={styles.lineMid}/>

                                    <View style={styles.wrapperOne}>
                                        <Text style={styles.styleLabel}>
                                            {strings("list_customer_info.detail.Profile_image")}
                                        </Text>
                                        <View style={{flexDirection: "row"}}>
                                            <TouchableOpacity
                                                onPress={() => {
                                                    NavigationService.navigate("lciUploadCustomerImage", {
                                                        RegID: objDetailCus.RegId,
                                                        RegCode: objDetailCus.RegCode,
                                                        refreshData: this.loadData.bind(this)
                                                    });
                                                }}
                                            >
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: "500",
                                                    marginRight: 20,
                                                    color: objDetailCus && objDetailCus.IsUpdateImage ? "#0B76FF" : "#f00"
                                                }}>
                                                    {strings("list_customer_info.detail.upload")}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                onPress={objDetailCus && objDetailCus.IsUpdateImage ? this._naviToViewDownloadImg.bind(this) : () => {
                                                }}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: "500",
                                                    color: objDetailCus && objDetailCus.IsUpdateImage ? "#0B76FF" : "#9a9a9a"
                                                }}>
                                                    {strings("list_customer_info.detail.detail")}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/*
                                // ---- Detail payment
                            */}
                            <View style={styles.midContainer}>
                                <View style={styles.titleBox}>
                                    <Text style={styles.titleLeft}>
                                        {strings("list_customer_info.detail.detail_payment")}
                                    </Text>
                                </View>

                                <View style={styles.innerMid}>
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.Internet")}
                                        value={objDetailCus ? objDetailCus.InternetTotal : null}
                                    />

                                    {
                                        objDetailCus
                                        && objDetailCus.ListDevice
                                        && objDetailCus.ListDevice.length > 0
                                            ?
                                            <View style={styles.lineMid}/>
                                            : null
                                    }

                                    {
                                        objDetailCus
                                            ? objDetailCus.ListDevice.map(
                                            (itemDevice, index) => (
                                                <TextInfo
                                                    key={index}
                                                    styleWrapper={styles.wrapperOne}
                                                    styleLabel={{...styles.styleLabel, flex: 1}}
                                                    styleValue={{...styles.styleValue, flex: 1}}
                                                    label={itemDevice.Name}
                                                    value={itemDevice.TotalPrice}
                                                />
                                            )
                                            )
                                            : null
                                    }

                                    {
                                        objDetailCus
                                        && objDetailCus.ListStaticIP
                                        && objDetailCus.ListStaticIP.length > 0
                                            ?
                                            <View>
                                                <View style={styles.lineMid}/>
                                                <TextInfo
                                                    styleWrapper={styles.wrapperOne}
                                                    styleLabel={styles.styleLabel}
                                                    styleValue={styles.styleValue}
                                                    label={strings("list_customer_info.detail.IpAddress")}
                                                    value={
                                                        objDetailCus.ListStaticIP[0].Total
                                                            ? objDetailCus.ListStaticIP[0].Total
                                                            : 0
                                                    }
                                                />
                                            </View>
                                            : null
                                    }

                                    {/** line */}
                                    <View style={styles.lineMid}/>

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.Conection_fee")}
                                        value={objDetailCus ? objDetailCus.ConnectionFee : null}
                                    />
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.Deposit")}
                                        value={objDetailCus ? objDetailCus.DepositFee : null}
                                    />
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("list_customer_info.detail.Vat")}
                                        value={objDetailCus ? objDetailCus.VAT : null}
                                    />
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={{...styles.styleLabel, flex: 1}}
                                        styleValue={{...styles.styleValue, flex: 1}}
                                        label={strings("list_customer_info.detail.payment_type")}
                                        value={objDetailCus ? objDetailCus.PaymentMethodPerMonthName : null}
                                    />
                                </View>

                                <TextInfo
                                    styleWrapper={styles.wrapperTotal}
                                    styleLabel={styles.styleLabelTotal}
                                    styleValue={styles.styleValueTotal}
                                    label={strings("list_customer_info.detail.Total_amount")}
                                    value={objDetailCus ? objDetailCus.Total : null}
                                />
                            </View>

                            {/*
								// ---- Prepaid promotion
							*/}
                            {
                                objDetailCus && objDetailCus.PromotionName &&

                                <View style={[styles.botContainer]}>
                                    <View style={[styles.titleBox]}>
                                        <Text style={styles.titleLeft}>
                                            {strings("list_customer_info.detail.Prepaid_promotion")}
                                        </Text>
                                    </View>

                                    <SearchPickerCLKMItem
                                        Name={objDetailCus ? objDetailCus.PromotionName : null}
                                        Description={objDetailCus ? objDetailCus.PromotionDescription : null}
                                        style={{backgroundColor: "#FFF", marginBottom: 0}}
                                    />
                                </View>
                            }

                            {/*
								// ---- Gift
							*/}
                            {
                                !objDetailCus || objDetailCus.ListGift.length > 0 &&

                                <View>
                                    <View style={[styles.titleBox]}>
                                        <Text style={styles.titleLeft}>
                                            {strings("list_customer_info.detail.gift")}
                                        </Text>
                                    </View>

                                    <View style={[{
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        borderWidth: 1,
                                        borderColor: '#0b76ff',
                                        borderRadius: 5,
                                        marginBottom: 12,
                                    }]}>
                                        <Text style={[{
                                            textAlign: 'center',
                                            paddingHorizontal: 10,
                                            paddingVertical: 10,
                                            color: '#0b76ff',
                                            fontSize: 16,
                                            marginVertical: 5,
                                            fontWeight: 'bold'
                                        }]}>
                                            {objDetailCus ? objDetailCus.ListGift[0].Name : null}
                                        </Text>
                                    </View>
                                </View>
                            }
                        </View>

                        {
                            // BUTTON
                        }
                        <View>
                            <View style={{marginBottom: 24}}>
                                <TouchableOpacity
                                    style={styles.btnContainer}
                                    onPress={this.viewContract.bind(this)}
                                >
                                    <Text style={styles.btnText}>
                                        {strings("list_customer_info.detail.view_contract")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
            </View>
        );
    }
}

export default connect(
    state => {
        return {};
    },
    {pushDataInfoRegistration, showTabBar}
)(DetailCustomersInfo);
