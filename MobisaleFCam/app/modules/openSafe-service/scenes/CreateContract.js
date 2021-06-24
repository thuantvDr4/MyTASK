/*
* Screen: Create Contract
* code by: thuantv
* date: 22/04/2021
*
* */
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
class CreateContract extends React.Component {
    static navigationOptions = ({navigation}) => {
        return {
            title: strings("open_safe.create_contract.header_title"),
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

        const {payload} = this.props.navigation.state.params;

        const {UserName} = this.props.userInfo; // props from redux-reducer

        this.state = {
            loadingVisible: false,
            objDetailCus: payload,
            RegId: this.props.navigation.getParam("RegID", "0"),
            RegCode: this.props.navigation.getParam("RegCode", "0"),
            UserName: UserName,
        };
        this.props.navigation.setParams({visible: false});
    }

    componentDidMount() {
        this.props.navigation.addListener("willFocus", () => {
            const {navigation} = this.props;

            const {RegId, RegCode} = navigation.getParam("payload", null);

            this.setState({
                RegId: RegId,
                RegCode: RegCode,
            });

        });
    }

    componentWillUnmount() {
        this.props.showTabBar(true);
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
    _loading (isShow) {
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
    createContract = () => {
        //
        const {UserName, RegCode} = this.state;
        //
        const data = {
            "Username": UserName,
            "RegCode": RegCode,
        };
        this._createOSContract(data);
    }


    /*
    * call api--> Tao hợp đồng
    * */
    _createOSContract = (myData) => {
        //
        this._loading(true);

        // this._errorMsg('Test');

        setTimeout(()=>{
            this._loading(false);
        }, 600)

        //
        api.createOSContract(myData, (success, result, msg) => {
            if (success) {
                //
                const {Contract, ObjId} = result[0];

                const params ={
                    "ObjId":ObjId,
                    "Contract":Contract
                };
                // delay
                setTimeout(()=>{
                    this._loading(false);
                    this._gotoContractDetail(params);
                }, 600);
               //
            } else {
                // delay
                setTimeout(()=>{
                    this._loading(false);
                    this._errorMsg(msg.message);
                }, 600);
                //
            }
        });
    }


    /*
    * gotoContractDetail
    * params send = {"ObjId":11231,"Contract":"PPHJ20019"}
    * */
    _gotoContractDetail =(params)=>{
        NavigationService.navigate('openSafe_DetailContract', params);
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
                                    <Text style={styles.titleLeft}>
                                        {strings("open_safe.create_contract.cus_info")}
                                    </Text>
                                </View>

                                <View style={[styles.inner, {borderWidth: 0, paddingTop: 12}]}>
                                    <TextInfo
                                        styleWrapper={[styles.wrapperOne, {marginBottom: 12,}]}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.cus_name")}
                                        value={objDetailCus ? objDetailCus.FullName : ''}
                                    />

                                    <TextInfo
                                        styleWrapper={[styles.wrapperOne, {marginBottom: 12,}]}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.code")}
                                        value={objDetailCus ? objDetailCus.RegCode : ''}
                                    />

                                    <TextInfo
                                        styleWrapper={[styles.wrapperOne, {marginBottom: 12,}]}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.phone")}
                                        value={objDetailCus ? objDetailCus.Phone1 : ''}
                                    />

                                    <TextInfo
                                        styleWrapper={[styles.wrapperOne, {marginBottom: 12,}]}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.email")}
                                        value={objDetailCus ? objDetailCus.Email : ''}
                                    />

                                    <TextInfo
                                        styleWrapper={{...styles.wrapperOne}}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.address")}
                                        value={objDetailCus ? objDetailCus.Address : ''}
                                    />
                                </View>
                            </View>

                        </View>

                        {/*...BUTTON...*/}
                        <View>
                            <View style={{marginBottom: 24}}>
                                <TouchableOpacity
                                    disabled={this.state.loadingVisible}
                                    style={styles.btnContainer}
                                    onPress={this.createContract}
                                >
                                    <Text style={styles.btnText}>
                                        {strings("open_safe.create_contract.create_contract")}
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

/*
*
* */

const mapStateToProps = state => {
    const userInfo = state.authReducer.userInfo;
    console.log('USER---', userInfo)

    return{
        userInfo
    }
}

const mapDispatchToProps = dispatch => {
    return{
        pushDataInfoRegistration, showTabBar
    }
}

/*
*
* */

export default connect(mapStateToProps, mapDispatchToProps)(CreateContract);
