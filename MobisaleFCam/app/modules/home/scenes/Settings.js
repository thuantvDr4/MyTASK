/**
 * Màn hình setting
 * @uthor ThuanDD3
 * @dateCreate Jun-2019
 * @dateEdit ---
 */

// LIB
import React, { Component } from 'react';
import {
    View, Text, TouchableOpacity, TouchableHighlight,
    StyleSheet, Animated, Image, Alert, Linking
} from 'react-native';
import { connect } from 'react-redux';
import { strings } from 'locales/i18n';
import PopupWarning from 'app-libs/components/PopupWarning';
import TechLoading from 'app-libs/components/TechLoading';
import { HeaderBackButton } from 'react-navigation';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';

// STYLE
import styles from '../styles';

// API
import * as api from '../api';
import ChangePassword from './ChangePassword';
import passwordImg from 'assets/images/auth/ic24_Password.png';

class Settings extends React.Component {

    static navigationOptions = ({ navigation }) => {
        return {
            title: strings('settings.nav.title'),
            headerLeft: <HeaderBackButton onPress={() => NavigationService.navigateGoBack()} tintColor="#fff" />,
            headerRight: <View />,
            headerBackTitle: null,
            headerStyle: {
                backgroundColor: '#0B76FF',
                borderBottomWidth: 0,
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                },
                shadowColor: 'transparent',
                elevation: 0
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1
            },
        }
    }

    constructor(props) {
        super(props);

        this.state = {
            deviceToken: this.props.deviceToken,
            deviceImei: this.props.deviceImei,
            dataAPI: {},
            loadingVisible: false
        };
    }

    componentDidMount() {
        // LOAD API FIRST
        this._loadDefaultSettings();
    }

    /**
    * Handle default load Setting API
    * @param isShow
    * @private
    */
    _loadDefaultSettings() {
        // loading
        this._loading(true);

        // input
        const { deviceToken } = this.state;
        const input = {
            RegId: deviceToken,
        }

        api.getSetting(input, (success, result, msg) => {
            this._loading(false);

            if (success) {

                this.setState({
                    dataAPI: result[0],
                });

            } else {
                this._error(msg);
            }
        });
    }

    /**
    * Register RegId
    * @param isShow
    * @private
    */
    _registerRegId() {
        // input
        const { deviceToken, deviceImei } = this.state;
        const input = {
            DeviceToken: deviceToken,
            DeviceIMEI: deviceImei
        }

        // loading
        this._loading(true);

        // call API
        api.registerRegId(input, (success, result, msg) => {

            this._loading(false);

            if (success) {
                // console.log(result);
                this.refs['popup'].getWrappedInstance().show(strings('dl.setting.noti.warnRegister'));
            } else {
                this._error(msg);
            }
        });
    }

    /**
    * Test Remote Push Notification
    * @param isShow
    * @private
    */
    _testNoti() {
        // input
        const { userName } = this.props;
        const input = {
            Title: 'Hello ' + userName,
            Message: userName + ' Test Push Notification'
        }

        // loading
        this._loading(true);

        // call API
        api.testNoti(input, (success, result, msg) => {

            // loading
            this._loading(false);

            // callback
            if (success) {
                this.refs['popup'].getWrappedInstance().show(strings('dl.setting.noti.warnTest'));

            } else {
                this._error(msg);
            }
        });
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

    /**************************************************
    * FUNCTION: _error
    * DESC: Hien thi popup error
    * @param err
    * @private
    ***************************************************/
    _error(err) {
        this._loading(false);
        if (!err.message) return;
        this.refs['popup'].getWrappedInstance().show(err.message);
    }

    _getHelpUrl = () => {
        // loading
        this._loading(true);
        // call API
        api.getUrlHelpPage({}, (success, result, msg) => {
            // loading
            this._loading(false);
            // callback
            if (success) {
                if (msg) {
                    Linking.canOpenURL(msg).then(supported => {
                        if (supported) {
                            Linking.openURL(msg);
                        }
                    })
                } else {
                    this._error({ message: "Couldn't open link" });
                }

            } else {
                this._error(msg);
            }
        });
    }

    render() {
        const { IsActiveNotification, EnableRegisRedId, EnableTestNoti } = this.state.dataAPI;
        // console.log(this.state);

        return (
            <View style={{
                ...styles.container, flex: 1, backgroundColor: "#F8F9FB", padding: 20
            }}>
                <View style={stylesInternal.inner}>

                    {/* status notification */}
                    <View style={stylesInternal.cols}>
                        <View style={[stylesInternal.rows, { justifyContent: 'space-between' }]}>
                            <View style={[stylesInternal.label]}>
                                <Image style={stylesInternal.iconNoti}
                                    source={require('../../../assets/images/home/ic_24Thong_bao.png')} />
                                <Text style={[stylesInternal.textLabel]}>
                                    {strings('settings.notification.label')}</Text>
                            </View>

                            <View style={[stylesInternal.status]}>
                                <Text style={[stylesInternal.textLabel, {
                                    color: IsActiveNotification ? 'green' : '#000'
                                }]}>
                                    {!IsActiveNotification ? strings('settings.notification.statusOff') : strings('settings.notification.statusOn')}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* actions notification */}
                    <View style={stylesInternal.cols}>

                        <View style={[stylesInternal.rows, { justifyContent: 'flex-end' }]}>
                            <TouchableOpacity
                                style={[stylesInternal.btn, { marginRight: 5 }, !EnableRegisRedId ? null : stylesInternal.btnEnable]}
                                onPress={() => !EnableRegisRedId ? {} : this._registerRegId()} >
                                <Text style={[stylesInternal.btnText, !EnableRegisRedId ? null : stylesInternal.btnTextEnable]}>
                                    {strings('settings.notification.btn.re')}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[stylesInternal.btn, !EnableTestNoti ? null : stylesInternal.btnEnable]}
                                onPress={() => !EnableTestNoti ? {} : this._testNoti()} >
                                <Text style={[stylesInternal.btnText, !EnableTestNoti ? null : stylesInternal.btnTextEnable]}>
                                    {strings('settings.notification.btn.te')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                {/* change password */}
                <View style={[stylesInternal.inner, { marginTop: 16 }]}>

                    {/* status notification */}
                    <View style={stylesInternal.cols}>
                        <View style={[stylesInternal.rows, { justifyContent: 'space-between' }]}>
                            <View style={[stylesInternal.label]}>
                                <Image style={stylesInternal.iconNoti}
                                    source={passwordImg} />
                                <Text style={[stylesInternal.textLabel]}>
                                    {strings('home.main_menu.change_password')}</Text>
                            </View>
                        </View>
                    </View>

                    {/* actions notification */}
                    <View style={stylesInternal.cols}>

                        <View style={[stylesInternal.rows, { justifyContent: 'flex-end', paddingHorizontal: 6 }]}>
                            <TouchableOpacity
                                style={[stylesInternal.btn, { marginRight: 5 }, !EnableRegisRedId ? null : stylesInternal.btnEnable]}
                                onPress={() => this.refs["ChangePassword"].getWrappedInstance().show()} >
                                <Text style={[stylesInternal.btnText, !EnableRegisRedId ? null : stylesInternal.btnTextEnable]}>
                                    {strings('home.main_menu.change_action')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <View style={[stylesInternal.inner, stylesInternal.rowSetting]}>
                    {/* Help touchable*/}
                    <TouchableOpacity style={stylesInternal.cols} onPress={() => this._getHelpUrl()}>
                        <View style={[stylesInternal.rows, { justifyContent: 'space-between' }]}>
                            <View style={[stylesInternal.label]}>
                                <Image style={stylesInternal.iconNoti}
                                    source={require('../../../assets/images/home/ic_3xHelp.png')} />
                                <Text style={[stylesInternal.textLabel]}>
                                    {strings('settings.help.label')}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <PopupWarning ref="popup" />
                <TechLoading visible={this.state.loadingVisible} />
                <ChangePassword ref="ChangePassword" Username={this.props.Username} />
            </View >
        )
    }
}
const stylesInternal = StyleSheet.create({
    inner: {
        width: '100%', backgroundColor: '#fff',
        borderRadius: 5, borderWidth: 1, borderColor: '#C2D0E2',
        flexDirection: 'row', paddingVertical: 5,
    },
    cols: { flex: 5, flexDirection: 'row' },
    rows: { flex: 1, flexDirection: 'row', paddingHorizontal: 10, },
    label: { flexDirection: 'row', alignItems: 'center' },
    status: { flexDirection: 'row', alignItems: 'center' },
    iconNoti: { width: 17, height: 17, tintColor: '#0B76FF', marginRight: 10, },
    textLabel: { fontWeight: 'bold', fontSize: 12, color: '#000' },
    btn: {
        width: '40%', height: 40,
        backgroundColor: '#f8f9fa', borderColor: '#f8f9fa',
        borderWidth: 1, borderRadius: 5,
        justifyContent: 'center', alignItems: 'center',
    },
    btnEnable: { borderColor: '#0B76FF' },
    btnText: { color: "#e4e5e6", fontSize: 12 },
    btnTextEnable: { color: "#0B76FF", },
    rowSetting: { marginTop: 16, paddingVertical: 16 },


});

export default connect(
    state => {

        return {
            userName: state.authReducer.Username,
            deviceToken: state.splashReducer.deviceToken,
            deviceImei: state.splashReducer.deviceImei
        }
    }
)(Settings);
