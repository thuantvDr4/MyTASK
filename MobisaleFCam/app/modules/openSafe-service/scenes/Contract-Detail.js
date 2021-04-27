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
    _handleUpdateInfo =()=> {
        NavigationService.navigate("OpenSafe_Info", {

        });
    }


    /**
     * show Loi
     * @param err
     * @private
     */
    _error =(err)=> {
        this._loading(false);
        if (!err.message) return;
        this.refs["popup"].getWrappedInstance().show(err.message);
    }

    _errorMsg =(err)=> {
        this._loading(false);
        if (!err) return;
        this.refs["popup"].getWrappedInstance().show(err.toString());
    }

    /**
     * Loading
     * @param isShow
     * @private
     */
    _loading =(isShow)=> {
        this.setState({
            ...this.state,
            loadingVisible: isShow
        });
    }


    /*
    * _handlePayment
    * */
    _handlePayment =()=> {
        NavigationService.navigate('openSafe_CreateContract', {});
    }

    /*
    * FOR------> FUNCTIONS
    *
    * */




    /*
    * FOR----> COMPONENTS
    *
    * */


    /*
    * RenderEquipment
    * */
    RenderEquipment =()=>{
        const {objDetailCus} = this.state;

        return(
            <View style={{ paddingHorizontal: 12,}}>
                <TextInfo
                    styleWrapper={styles.wrapperOne}
                    styleLabel={[styles.styleLabel, {fontWeight: '700', color: '#030303'}]}
                    styleValue={styles.styleValue}
                    label={strings("open_safe.detail_contract.equipment")}
                    value={objDetailCus ? objDetailCus.InternetTotal : null}
                />
                {/** line */}
                <View style={styles.lineMid}/>

                <TextInfo
                    styleWrapper={styles.wrapperOne}
                    styleLabel={styles.styleLabel}
                    styleValue={styles.styleValue}
                    label={'OpenSafe 1'}
                    value={20}
                />

                <TextInfo
                    styleWrapper={styles.wrapperOne}
                    styleLabel={styles.styleLabel}
                    styleValue={styles.styleValue}
                    label={'OpenSafe 2'}
                    value={20}
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
            </View>
        )
    }


    /*
* RenderPackages
* */
    RenderPackages =()=>{
        const {objDetailCus} = this.state;

        return(
            <View style={{ paddingHorizontal: 12,}}>
                <TextInfo
                    styleWrapper={styles.wrapperOne}
                    styleLabel={[styles.styleLabel, {fontWeight: '700', color: '#030303'}]}
                    styleValue={styles.styleValue}
                    label={strings("open_safe.detail_contract.package")}
                    value={objDetailCus ? objDetailCus.InternetTotal : null}
                />
                {/** line */}
                <View style={styles.lineMid}/>

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

                <TextInfo
                    styleWrapper={styles.wrapperOne}
                    styleLabel={styles.styleLabel}
                    styleValue={styles.styleValue}
                    label={'Safe 1'}
                    value={20}
                />
            </View>
        )
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
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.status")}
                                        value={objDetailCus ? objDetailCus.RegStatus : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.service_type")}
                                        value={objDetailCus ? objDetailCus.OpenSafe : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.cus_name")}
                                        value={objDetailCus ? objDetailCus.FullName : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.contract_no")}
                                        value={objDetailCus ? objDetailCus.RegCode : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.phone")}
                                        value={objDetailCus ? objDetailCus.Phone1 : null}
                                    />

                                    <TextInfo
                                        styleWrapper={{...styles.wrapperOne}}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_contract.install_address")}
                                        value={objDetailCus ? objDetailCus.Address : null}
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
                                    <View style={{paddingHorizontal:12}}>
                                        <TextInfo
                                            styleWrapper={styles.wrapperOne}
                                            styleLabel={styles.styleLabel}
                                            styleValue={styles.styleValue}
                                            label={strings("open_safe.detail_contract.vat")}
                                            value={objDetailCus ? objDetailCus.VAT : null}
                                        />
                                    </View>

                                </View>

                                <TextInfo
                                    styleWrapper={styles.wrapperTotal}
                                    styleLabel={styles.styleLabelTotal}
                                    styleValue={styles.styleValueTotal}
                                    label={strings("open_safe.detail_contract.total_amount")}
                                    value={objDetailCus ? objDetailCus.Total : null}
                                />
                            </View>

                            {/*
								// ---- Gift
							*/}
                            {
                                !objDetailCus || objDetailCus.ListGift.length > 0 &&

                                <View>
                                    <View style={[styles.titleBox]}>
                                        <Text style={styles.titleLeft}>
                                            {strings("open_safe.detail_contract.gift")}
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
                                    onPress={this._handlePayment}
                                >
                                    <Text style={styles.btnText}>
                                        {strings("open_safe.detail_contract.payment")}
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
)(ContractDetail);
