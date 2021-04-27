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
    createContract = () => {
        NavigationService.navigate('openSafe_DetailContract', {});
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

                                <View style={[styles.inner, {borderWidth: 0}]}>
                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.cus_name")}
                                        value={objDetailCus ? objDetailCus.FullName : 'Thuantv'}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.code")}
                                        value={objDetailCus ? objDetailCus.RegCode : 'FZ3123123'}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.email")}
                                        value={objDetailCus ? objDetailCus.Phone1 : 'thuantv@gmail.com'}
                                    />

                                    <TextInfo
                                        styleWrapper={styles.wrapperOne}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.phone")}
                                        value={objDetailCus ? objDetailCus.Phone1 : '9999999999'}
                                    />

                                    <TextInfo
                                        styleWrapper={{...styles.wrapperOne}}
                                        styleLabel={styles.styleLabel}
                                        styleValue={styles.styleValue}
                                        label={strings("open_safe.create_contract.address")}
                                        value={objDetailCus ? objDetailCus.Address : '123 abc,P12,Q10'}
                                    />
                                </View>
                            </View>

                        </View>

                        {/*...BUTTON...*/}
                        <View>
                            <View style={{marginBottom: 24}}>
                                <TouchableOpacity
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

export default connect(
    state => {
        return {};
    },
    {pushDataInfoRegistration, showTabBar}
)(CreateContract);
