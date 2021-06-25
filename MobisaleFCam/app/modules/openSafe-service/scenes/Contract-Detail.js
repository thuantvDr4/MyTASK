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


/*
*
* CLASS
* */
class ContractDetail extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings("open_safe.detail_contract.header_title"),
            headerLeft: (
                <HeaderBackButton
                    onPress={() => {
                        NavigationService.navigate("TabListCustomerInfo");
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
        this.state = {
            loadingVisible: false,
            objDetailContract: null,
            params: PARAMS,
        };

    }


    /*
    * componentDidMount
    * */
    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => {
            //
            const {params} = this.state;
            //
            this._getContractDetail(params);

            //
            this.props.showTabBar(false);
        });
    }

    /*
    * componentWillUnmount
    * */
    componentWillUnmount() {
        this.props.showTabBar(true);
    }


    /*
    * _getContractDetail
    * */
    _getContractDetail(myData) {
        this._loading(true);
        //
        api.GetContractDetail(myData, (success, result, msg) => {
            console.log('API--result--', result)
            if (success) {
                this._loading(false);
                this.setState({
                    objDetailContract: result
                });
            } else {
                this._loading(false);
                this._errorMsg(msg.message);
            }
        });
    }


    /**
     * show Loi
     * @param err
     * @private
     */
    _error (err) {
        this._loading(false);
        if (!err.message) return;
        this.refs["popup"].getWrappedInstance().show(err.message);
    }

    _errorMsg (err) {
        this._loading(false);
        if (!err) return;
        this.refs["popup"].getWrappedInstance().show(err.toString());
    }

    /**
     * Loading
     * @param isShow
     * @private
     */
    _loading (isShow){
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }



    /*...FOR------> FUNCTIONS.....*/


    /*
    * _handlePayment
    * */
    _handlePayment = () => {
        NavigationService.navigate('openSafe_ReceiptDetail', this.state.objDetailContract);
    }



   /*.....FOR----> COMPONENTS....*/

    /*
    * RenderItemList
    * */
    RenderItemList = (data) => {
        return (
            <>
                {
                    data.map((item, index) => {
                        return (
                            <TextInfo
                                key={index}
                                styleWrapper={styles.wrapperOne}
                                styleLabel={{...styles.styleLabel, flex: 1}}
                                styleValue={{...styles.styleValue, flex: 1}}
                                label={item.Name}
                                value={item.Total}
                            />
                        )
                    })
                }
            </>
        )
    }


    /*
    * RenderEquipment
    * */
    RenderEquipment = () => {
        const {objDetailContract} = this.state;

        return (
            <View style={{paddingHorizontal: 12,}}>
                <TextInfo
                    styleWrapper={styles.wrapperOne}
                    styleLabel={[styles.styleLabel, {fontWeight: '700', color: '#030303'}]}
                    styleValue={styles.styleValue}
                    label={strings("open_safe.detail_contract.equipment")}
                    value={objDetailContract ? objDetailContract.DeviceTotal : null}
                />
                {/*..LIST-DEVICE..*/}
                {
                    objDetailContract
                    && objDetailContract.ListOSDevice
                    && objDetailContract.ListOSDevice.length > 0
                        ?
                        <>
                            <View style={styles.lineMid}/>
                            {this.RenderItemList(objDetailContract.ListOSDevice)}
                        </>
                        : null
                }

            </View>
        )
    }


    /*
* RenderPackages
* */
    RenderPackages = () => {
        const {objDetailContract} = this.state;

        return (
            <View style={{paddingHorizontal: 12,}}>
                <TextInfo
                    styleWrapper={styles.wrapperOne}
                    styleLabel={[styles.styleLabel, {fontWeight: '700', color: '#030303'}]}
                    styleValue={styles.styleValue}
                    label={strings("open_safe.detail_contract.package")}
                    value={objDetailContract ? objDetailContract.PackageTotal : null}
                />

                {/*..LIST-PACKAGES..*/}
                {
                    objDetailContract
                    && objDetailContract.ListOSPackage
                    && objDetailContract.ListOSPackage.length > 0
                        ?
                        <>
                            <View style={styles.lineMid}/>
                            {this.RenderItemList(objDetailContract.ListOSPackage)}
                        </>
                        : null
                }

            </View>
        )
    }


    /*
    * RENDER-RETURN
    *
    * */
    render() {
        const {objDetailContract} = this.state;
        const statusStyle = {
            ...styles.styleValue,
            color: (objDetailContract && objDetailContract.PaidStatus !== 0) ? 'green' : 'red',
        };

        return (
            <View style={styles.container}>
                <ScrollView
                    keyboardDismissMode={"on-drag"}
                    contentContainerStyle={[ols.wrapper_scrollview]}
                >
                    <View style={[ols.inner_scrollview, {justifyContent: "space-between", backgroundColor: "#F8F9FB"}]}>
                        <View>
                            {/*
                                // ---- Customer infomation
                            */}
                            <View style={styles.topContainer}>
                                <View style={styles.titleBox}>
                                    <Text style={styles.titleLeft}>
                                        {strings("open_safe.create_contract.cus_info")}
                                    </Text>
                                </View>

                                <View style={styles.inner}>
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={[statusStyle]}
                                        label={strings("open_safe.detail_contract.status")}
                                        value={objDetailContract ? objDetailContract.PaidStatusName : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.service_type")}
                                        value={'OpenSafe'}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.cus_name")}
                                        value={objDetailContract ? objDetailContract.FullName : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.contract_no")}
                                        value={objDetailContract ? objDetailContract.Contract : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.phone")}
                                        value={objDetailContract ? objDetailContract.Phone1 : null}
                                    />

                                    <TextInfo
                                        styleWrapper={{...styles.wrapperOne}}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.install_address")}
                                        value={objDetailContract ? objDetailContract.Address : null}
                                    />
                                </View>
                            </View>

                            {/*
                                // ---- Detail payment
                            */}
                            <View style={styles.midContainer}>
                                <View style={styles.titleBox}>
                                    <Text style={styles.titleLeft}>
                                        {strings("open_safe.detail_contract.detail_payment")}
                                    </Text>
                                </View>

                                {/** line */}
                                <View style={styles.innerMid}>
                                    {/*...renderEquipment....*/}
                                    {this.RenderEquipment()}

                                    {/** line */}
                                    <View style={[styles.lineMid, {borderTopColor: '#C2D0E2'}]}/>

                                    {/*...renderPackage.....*/}
                                    {this.RenderPackages()}

                                    {/** line */}
                                    <View style={[styles.lineMid, {borderTopColor: '#C2D0E2'}]}/>

                                    {/*...VAT..*/}
                                    <View style={{paddingHorizontal: 12}}>
                                        <TextInfo
                                            styleWrapper={styles.wrapperOne}
                                            styleLabel={styles.styleLabel}
                                            styleValue={styles.styleValue}
                                            label={strings("open_safe.detail_contract.vat")}
                                            value={objDetailContract ? objDetailContract.VAT : null}
                                        />
                                    </View>

                                </View>

                                <TextInfo
                                    styleWrapper={styles.wrapperTotal}
                                    styleLabel={styles.styleLabelTotal}
                                    styleValue={styles.styleValueTotal}
                                    label={strings("open_safe.detail_contract.total_amount")}
                                    value={objDetailContract ? objDetailContract.Total : null}
                                />
                            </View>

                        </View>

                        {/*....BUTTON-PAYMENT...*/}
                        {objDetailContract && objDetailContract.PaidStatus !== 0 ? null :
                            <View>
                                <View style={{marginBottom: 24}}>
                                    <TouchableOpacity
                                        style={styles.btnContainer}
                                        onPress={this._handlePayment}
                                    >
                                        <Text style={styles.btnText}>
                                            {strings("open_safe.detail_contract.payment")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                        {/*......*/}
                    </View>
                </ScrollView>

                <PopupWarning ref="popup"/>
                <TechLoading visible={this.state.loadingVisible}/>
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
export default connect(mapStateToProps, mapDispatchToProps)(ContractDetail);
