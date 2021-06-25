// LIB
import React from 'react';
import {Platform, View, Image, NetInfo, Alert, Text} from 'react-native';
import {requestPermission} from 'react-native-android-permissions';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';
import DeviceInfo, {getUniqueId, getModel} from 'react-native-device-info';
import IMEI from 'react-native-imei';
import CodePush from "react-native-code-push";
// import { IDFA } from '@ptomasroos/react-native-idfa';

// LIB CUSTOM
import GlobalVariable from '../../../config/globalVariable';
import NavigationService from 'app-libs/helpers/NavigationService';
import {getKongToken} from '../../../config/network';
import * as accessCachesLogin from 'app-libs/helpers/accessCachesLogin';

// API
import * as api from '../api';

// REDUX ACTION
import {actions as sp} from '../';
import {getInfo} from '../../auth/actions';

const {setDeviceImei, checkIMEI, setAppVersion, setUserName, setDeviceInfo} = sp;

// STYLE
import styles from '../styles';

// VARIABLE
import * as con from '../../../config/constants';

//
// cd android /&&  ./gradlew clean && ./gradlew assembleReleaseStaging && cd .. && open `pwd`
// cd android /&&  ./gradlew clean && ./gradlew assembleReleaseProduction && cd .. && open `pwd`

class Splash extends React.Component {
    static navigationOptions = {
        header: null
    }

    constructor(props) {
        super(props);

        this.state = {
            isReady: false,
            deviceinfo: {}
        }
    }


    /**
     * Kiem tra permission khi render xong man hinh
     */
    componentDidMount() {
        this.getDiviceInfo();
    }

    /**
     * Xu ly khi update state
     */
    componentDidUpdate() {

        if (this.state.isReady) {
            NavigationService.navigateReset('Login');
        }
    }

    /**
     * Get Divice Info
     */
    async getDiviceInfo() {
        let deviceJSON = {}
        const versionAPP = await DeviceInfo.getVersion();
        try {
            deviceJSON.model = await getModel();
            deviceJSON.uniqueId = await getUniqueId();
            deviceJSON.androidId = await DeviceInfo.getAndroidId();
            deviceJSON.systemVersion = await DeviceInfo.getSystemVersion();
            deviceJSON.version = await DeviceInfo.getVersion();

        } catch (e) {
            // console.log('Trouble getting device info ', e);
        }
        // console.log(deviceJSON);
        this.setState({
            deviceinfo: deviceJSON

        }, () => {
            if (Platform.OS == 'android') {
                this.checkAndroidPermission();
            } else {
                this.checkIOsPermission();
            }

            this.props.setDeviceInfo(deviceJSON);
        });
    }

    /**
     * Xin quyen tren android
     */
    checkAndroidPermission() {

        setTimeout(() => {
            requestPermission("android.permission.READ_PHONE_STATE")
                .then((result) => {

                        // ko commit: S8 IMEI
                        // this.props.setDeviceImei(358059082043856);
                        // ko commit: Android 4
                        // this.props.setDeviceImei(358240051111110);

                        // commit
                        this.props.setDeviceImei(this.state.deviceinfo.systemVersion > 9 ? this.state.deviceinfo.androidId : IMEI.getImei());
                        this.checkInternetStatus();
                    },
                    (result) => {
                        Alert.alert(
                            strings('dialog.title'),
                            strings('dl.dialog.lost_internet'),
                        );
                    });
        }, 0);
    }

    /**
     * Xin quyen tren IOS
     */
    checkIOsPermission() {
        // ko commit: S7 PLUS
        // this.props.setDeviceImei("26F02B70-0C83-4A6E-B8E7-92827F4CEBB1");
        // this.props.setDeviceImei("358059082043856");

        // commit
        this.props.setDeviceImei(this.state.deviceinfo.uniqueId);
        this.checkInternetStatus();
    }

    /**
     * Kiem tra may co ket noi internet khong
     */
    checkInternetStatus() {

        NetInfo.isConnected.fetch().then(isConnected => {
            if (isConnected) {
                getKongToken(this.nextScreen.bind(this));
            }
            else {
                Alert.alert(
                    strings('dialog.title'),
                    strings('dl.dialog.lost_internet'),
                    [
                        {text: 'OK', onPress: () => this.checkInternetStatus()}
                    ]
                );
            }
        });
    }

    /**
     * Hoan tat kiem tra Chuyen sang man hinh login
     */
    nextScreen() {

        // v2.3
        this.checkVersion((isSuccess, resp, err) => this.autoLoginProcess(isSuccess, resp, err));
    }

    /**
     * Kiem tra version cua app
     *
     * @param {*} callback
     * @note BIG UPDATE 2.3 - Khau nay la cung de autoLogin hoặc manual Login
     */
    checkVersion(callback) {

        // Input Param
        const {deviceinfo} = this.state;
        const data = {
            DeviceIMEI: this.props.deviceImei,
            CurrentVersion: deviceinfo.version,
            Platform: Platform.OS,
            AndroidVersion: deviceinfo.systemVersion,
            ModelNumber: deviceinfo.model
        }

        // Call API
        api.checkVersion(data, (isSuccess, resp, err) => {

            if (!isSuccess) {
                Alert.alert(
                    strings('dialog.title'),
                    err.message.toString()
                );
                return;
            }

            if (!resp.IsNew) {

                if (con.RELEASE) {
                    this.checkOTA();
                }
                // di tiep man hinh login
                this.props.setAppVersion(resp);
                // return callback();

                // 2.3
                this.props.setUserName(resp.UserName);
                return callback(isSuccess, resp, err);
            }

            NavigationService.navigateReset('Upgrade', {info: resp});
        });
    }

    /**
     * BIG UPDATE 2.3 - Khau nay la cung de autoLogin hoặc manual Login
     *
     * @param {*} callback
     */
    autoLoginProcess = (isSuccess, respData, err) => {

        if (isSuccess) {
            // ERASE CACHE
            // accessCachesLogin.removeCacheLogin((a)=> {console.log(a)});

            // READ CACHE LOGIN HEADER
            accessCachesLogin.readCacheLogin((res) => {

                if (res && res.length !== 0) {

                    // PARSE HEADER
                    // GlobalVariable.isLogin = true;
                    GlobalVariable.isRememberPass = true;
                    GlobalVariable.ftel_mobisalecam_header = res ? res : '';

                    // GET INFO USER AND DIRECT TO HOME
                    this.props.getInfo(respData, this.autoLoginSC.bind(this), this.autoLoginER.bind(this));

                } else {
                    this.manualLogin('Login', isSuccess, err);
                }
            });

        } else {
            this.manualLogin('Login', isSuccess, err);
        }
    }

    /**
     * Auto Login success
     *
     * @param {*} callback
     */
    autoLoginSC() {
        //
        GlobalVariable.isLogin = false;

        // Set trạng thái đã login thành công
        GlobalVariable.isLoged = true;
        GlobalVariable.isBackLogin = false;

        // redirect to home
        NavigationService.navigateReset('Home');

        // NavigationService.navigateReset('CustomerInfo'); // dung de test man hinh
    }

    /**
     * Auto Login Fail
     *
     * @param {*} callback
     */
    autoLoginER(error) {
        //
        GlobalVariable.isLogin = false;

        // CLEAR CACHE SAVE LOGIN HEADER
        accessCachesLogin.writeCacheLogin('');

        // Chuyen ve Login (Unless)
        if (error.Code === -1) {

            accessCachesLogin.readCacheLogin((res) => {

            });
            NavigationService.navigateReset('Login', {
                alert: {
                    title: strings('dialog.title'),
                    message: strings('dl.dialog.token_expired'),
                }
            });
        } else {
            // display error
            this.showPopup(strings('dl.dialog.error_connection'));
        }
    }

    /**
     * Manual Login
     *
     * @param {*} callback
     */
    manualLogin(screen, isSuccess, err) {
        // CLEAR CACHE SAVE LOGIN HEADER
        accessCachesLogin.writeCacheLogin('');

        // Chuyen ve Login

        NavigationService.navigateReset(
            screen,
            isSuccess ? null :
                {
                    alert: {
                        title: strings('dialog.title'),
                        message: err.message,
                    }
                },
        );

    }

    /**
     * Check xem co ban cap nhat OTA nao ko
     */
    checkOTA() {
        CodePush.checkForUpdate()
            .then((update) => {

                if (update) {
                    this.syncOTA(update);

                } else {
                    CodePush.getUpdateMetadata(CodePush.UpdateState.RUNNING)
                        .then((metadata: LocalPackage) => {

                            // JSON.stringify(metadata)
                        }, (error: any) => {

                        });
                }
            });

    }

    /**
     * Cap nhat OTA
     */
    syncOTA(updateData) {
        let {isMandatory} = updateData;

        let warni = {
            title: 'Mobisale Fcam',	                    // Dialog Title

            // UPDATE FORCE, có lệnh mandatory (se ko co nut Ignore)
            mandatoryContinueButtonLabel: 'Update now',		// Button CONTINUE label
            mandatoryUpdateMessage: 'An update is available that must be installed now.\n\n* Note: App will restart after install',

            // UPDATE BINH THUONG, ko có lệnh mandatory
            optionalIgnoreButtonLabel: 'Later',				    // Button IGNORE label
            optionalInstallButtonLabel: 'Update',		        // Button INSTALL label
            optionalUpdateMessage: 'An update is available that must be installed now.\n\n',

            appendReleaseDescription: false,
            descriptionPrefix: 'Patch note:\n',
        }

        CodePush.sync(
            {
                updateDialog: isMandatory ? warni : false,
                installMode: isMandatory ? CodePush.InstallMode.IMMEDIATE : CodePush.InstallMode.ON_NEXT_RESTART
            },
            (status) => {
                this.syncStatusOTA(status);
            },
            ({receivedBytes, totalBytes,}) => {
                /* Update download modal progress */
            }
        );
    }

    /**
     * Status cua OTA
     */
    syncStatusOTA(status) {
        switch (status) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                // this.setState({ syncMessage: "Checking for update." });
                // console.log("Checking for update.");
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                // this.setState({ syncMessage: "Downloading package." });
                break;
            case CodePush.SyncStatus.AWAITING_USER_ACTION:
                // this.setState({ syncMessage: "Awaiting user action." });
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                // this.setState({ syncMessage: "Installing update." });
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                // this.setState({ syncMessage: "App up to date.", progress: false });
                // console.log("App up to date.");
                break;
            case CodePush.SyncStatus.UPDATE_IGNORED:
                // this.setState({ syncMessage: "Update cancelled by user.", progress: false });
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                // this.setState({ syncMessage: "Update installed and will be applied on restart.", progress: false });
                break;
            case CodePush.SyncStatus.UNKNOWN_ERROR:
                // this.setState({ syncMessage: "An unknown error occurred.", progress: false });
                break;
        }
    }

    render() {

        return (
            <View style={[styles.container]}>
                <Image style={styles.logo} source={require('assets/images/splash/__Logo_white.png')}/>
            </View>
        );
    }
}

export default connect(state => {

    return {
        deviceImei: state.splashReducer.deviceImei
    }
}, {setDeviceImei, checkIMEI, setAppVersion, setUserName, setDeviceInfo, getInfo})(Splash);

