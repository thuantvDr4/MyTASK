// LIB
import React, {Component} from "react";
import {Text, ScrollView, View, TouchableOpacity} from "react-native";

// LANGUAGE
import {strings} from "locales/i18n";

// REDUX
import {connect} from "react-redux";

// ACTION
import {actions as act, constants as c} from "../";

const {pushDataInfoRegistration, showTabBar} = act;

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
class DetailCustomersInfo extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings("open_safe.detail_info.header_title"),
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

        this.state = {
            loadingVisible: false,
            objDetailCus: null,
            RegId: this.props.navigation.getParam("RegID", "0"),
            RegCode: this.props.navigation.getParam("RegCode", "0"),
            //
            params: {
                RegId: this.props.navigation.getParam("RegID", "0"),
                RegCode: this.props.navigation.getParam("RegCode", "0"),
            },

        };
        this.props.navigation.setParams({visible: false});
    }

    componentDidMount() {

        this.props.navigation.addListener("willFocus", () => {

            const PARAMS = this.props.navigation.state.params;

            const {params} = this.state;
            this._handleLoadInfoCus(params);
            this.props.showTabBar(false);
        });
    }

    componentWillUnmount() {
        this.props.showTabBar(true);
    }


    /*
    * _handleLoadInfoCus
    * */
    _handleLoadInfoCus(myData) {

        this._loading(true);

        api.GetRegistrationDetail(myData, (success, result, msg) => {
            console.log('DETAIL-----', result)
            if (success) {
                this.setState({
                    loadingVisible: false,
                    objDetailCus: result[0],
                    RegId: myData.RegId,
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
        //show loading
        this._loading(true);
        //
        const {objDetailCus} = this.state;

        let objResult = {...objDetailCus};
        objResult.FullAddress = objDetailCus.Address;

        this.props.showTabBar(true);

        this.props.pushDataInfoRegistration(objResult).then(() => {
            this._loading(false);
            setTimeout(() => {
                NavigationService.navigate("OpenSafe_Info", {
                    lciDetailCustomer: true,
                    titleNav: strings("open_safe.titleNavigation.update")
                });
            }, 500);
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
* FOR------> FUNCTIONS
*
* */

/*
* _uploadImg
* */
    _uploadImg =()=>{
        NavigationService.navigate("openSafe_UploadImg", {
            RegID: this.state.objDetailCus.RegId,
            RegCode: this.state.objDetailCus.RegCode,
        });
    }

    /*
* _viewDetailImg
* */
    _viewDetailImg =()=>{

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
    }



    /*
* viewContract
* */
    viewContract =()=> {
        NavigationService.navigate('openSafe_CreateContract', {
            payload: this.state.objDetailCus
        });
    }


/*
* FOR----> COMPONENTS
*
* */

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
    RenderEquipment =()=>{
        const {objDetailCus} = this.state;

        return(
            <View style={{ paddingHorizontal: 12,}}>
                <TextInfo
                    styleWrapper={styles.wrapperOne}
                    styleLabel={[styles.styleLabel, {fontWeight: '700', color: '#030303'}]}
                    styleValue={styles.styleValue}
                    label={strings("open_safe.detail_info.equipment")}
                    value={objDetailCus ? objDetailCus.DeviceTotal : null}
                />

                {/*..LIST-DEVICE..*/}
                {
                    objDetailCus
                    && objDetailCus.ListOpenSafeDevice
                    && objDetailCus.ListOpenSafeDevice.length > 0
                        ?
                        <>
                            {/*...LINE..*/}
                            <View style={styles.lineMid}/>
                            {/*...*/}
                            {this.RenderItemList(objDetailCus.ListOpenSafeDevice)}
                        </>
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
                    label={strings("open_safe.detail_info.package")}
                    value={objDetailCus ? objDetailCus.PackageTotal : null}
                />

                {/*..LIST-PACKAGES..*/}
                {
                    objDetailCus
                    && objDetailCus.ListOpenSafePackage
                    && objDetailCus.ListOpenSafePackage.length > 0
                        ?
                        <>
                            {/*..LINE..*/}
                            <View style={styles.lineMid}/>
                            {/*...*/}
                            {this.RenderItemList(objDetailCus.ListOpenSafePackage)}
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
                                        {strings("open_safe.detail_info.cus_info")}
                                    </Text>
                                    <TouchableOpacity onPress={this._handleUpdateInfo}>
                                        <Text style={styles.titleRight}>
                                            {strings("open_safe.detail_info.update")}
                                        </Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inner}>
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_info.status")}
                                        value={objDetailCus ? objDetailCus.RegStatus : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_info.service_type")}
                                        value={objDetailCus ? objDetailCus.RegTypeName : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_info.cus_name")}
                                        value={objDetailCus ? objDetailCus.FullName : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_info.registration_code")}
                                        value={objDetailCus ? objDetailCus.RegCode : null}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_info.phone")}
                                        value={objDetailCus ? objDetailCus.Phone1 : null}
                                    />

                                    <TextInfo
                                        styleWrapper={{...styles.wrapperOne}}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.detail_info.install_address")}
                                        value={objDetailCus ? objDetailCus.Address : null}
                                    />

                                    <View style={styles.lineMid}/>

                                    <View style={styles.wrapperOne}>
                                        <Text style={styles.styleLabel}>
                                            {strings("open_safe.detail_info.profile_img")}
                                        </Text>
                                        <View style={{flexDirection: "row"}}>
                                            <TouchableOpacity
                                                onPress={this._uploadImg}
                                            >
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: "500",
                                                    marginRight: 20,
                                                    color: objDetailCus && objDetailCus.IsUpdateImage ? "#0B76FF" : "#f00"
                                                }}>
                                                    {strings("open_safe.detail_info.upload")}
                                                </Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity
                                                disabled={!(objDetailCus && objDetailCus.IsUpdateImage)}
                                                onPress={this._viewDetailImg}>
                                                <Text style={{
                                                    fontSize: 14,
                                                    fontWeight: "500",
                                                    color: objDetailCus && objDetailCus.IsUpdateImage ? "#0B76FF" : "#9a9a9a"
                                                }}>
                                                    {strings("open_safe.detail_info.detail")}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            {/*
                                // ----
                            */}
                            <View style={styles.midContainer}>
                                <View style={styles.titleBox}>
                                    <Text style={styles.titleLeft}>
                                        {strings("open_safe.detail_info.detail_payment")}
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
                                            label={strings("open_safe.detail_info.vat")}
                                            value={objDetailCus ? objDetailCus.VAT : null}
                                        />
                                    </View>

                                </View>

                                <TextInfo
                                    styleWrapper={styles.wrapperTotal}
                                    styleLabel={styles.styleLabelTotal}
                                    styleValue={styles.styleValueTotal}
                                    label={strings("open_safe.detail_info.total_amount")}
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
                                            {strings("open_safe.detail_info.gift")}
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
                                    onPress={this.viewContract}
                                >
                                    <Text style={styles.btnText}>
                                        {strings("open_safe.detail_info.view_contract")}
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
