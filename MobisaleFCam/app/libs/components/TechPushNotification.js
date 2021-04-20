
// LIB
import React from 'react';
import { Platform, PushNotificationIOS, Alert } from 'react-native';
import PushNotification from 'react-native-push-notification';
import {connect} from 'react-redux';

// API
import * as api from '../../modules/home/api';

// ACTION
import { setDeviceToken, setNoti } from '../../modules/splash/actions';
import { setNotinum } from '../../modules/home/actions';

// HELPER
import NavigationService from 'app-libs/helpers/NavigationService';
import showLoading from 'app-libs/helpers/showLoading';
import { forceStopLoadingLocal } from 'app-libs/helpers/showLoadingHelper';
import { getRouteName, getBadgeIconApp, setBadgeIconApp } from 'app-libs/helpers/notificationHelper';
import { showModalAction, showModalWarning } from 'app-libs/helpers/showModal';
import * as accessCachesNoti from 'app-libs/helpers/accessCachesNoti';

// LANGUAGE
import {strings} from 'locales/i18n';

// VARIABLE
import * as con from '../../config/constants'
import GlobalVariable from '../../config/globalVariable';

/**
 * Abc components
 * - Get device token and hold in redux storge
 * - Document see at: https://github.com/zo0r/react-native-push-notification
 * 
 * @since Aug, 2018
 * @author ThuanDD3
 * @completeDate Jun, 2019
 */
class TechPushNotification extends React.Component {

    // set
    isAllowSetNotiNum = true;   // KHong set number auto khi click noti
    isUnLoged = true;           // Khi chua login thì ko auto click noti nhiu lan
    notiNumIOS = 0

    /**
     * 
     */
    constructor(props) {
        super(props);

        this.state = {
            autoSetNumberRead: true,
        }
    }

    /**
     * 
     */
    componentDidMount() {
        // config notifi
        this.notiConfig();

        // If android close app
        if (Platform.OS === 'android') {
            this._checkNotiWhenCloseApp();

        } else {
            /**
             * Set 0 cho App Icon khi vua load app
             * 
            */
            setBadgeIconApp(this.notiNumIOS);
        }

        // Read Cache First
        accessCachesNoti.readCacheNotiNum((res) => {});
    }
    

    /**************************************************
     * Config Notification
     * 
     * @param
     **************************************************/
    notiConfig() {
        const { setDeviceToken } = this.props;

        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function(token) {
                // console.log('================ DEVICES TOKEN: ', token);
                setDeviceToken(token);
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: (notification) => {
                // console.log( '---- NOTIFICATION RECEIVE:', notification );
                
                // Process the notification theo Platform
                if (Platform.OS !== 'android') {
                    this._toIOS(notification);

                } else {
                    this._toANDROID(notification)
                }

                // Set number App icon tu notification vừa bắn xuống (only in app)
                // (truong hop nay se bi goi lai 2 lan, nen khoa no bang bien isAllowSetNotiNum)
                if (this.isAllowSetNotiNum) {
                    if (GlobalVariable.isLoged) {
                        this._setNotiNum('+');
                    }
                    // set number read vao ICON APP (only IOS)
                    this._setNotiNumIOS('+');
                }
                
            },

            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            // senderID: "444817274790",   //-> FIREBASE TEST CUA THUAN
            senderID: con.SENDER_ID, 

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true,
        });
    }


    /**************************************************
     * XU ly Notification rieng của IOS
     * @param
     **************************************************/
    _toIOS(notification) {
        // Tap banner noti
        // Check if opened from foreground
        if (notification.data.openedInForeground) {
            // console.log('---- NOTIFICATION TAP BANNER', notification);

            // Force data (cheat for IOS)
            notification.userInteraction = true;
        }
        
        if (notification.data.openedInForeground && notification.userInteraction) {
            // console.log('---- NOTIFICATION TAP BANNER ios', notification);
            this.isAllowSetNotiNum = false;
            this._clickNoti(notification);
        }  

        // Only call callback if not from foreground
        if (!notification.foreground && !notification.data.openedInForeground) {
            // console.log('---- APP STATE DANG O BACKGROUND');

            // Required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
            notification.finish("backgroundFetchResultNoData");
            
            // Cai nay meo hieu sao loi luon
            // notification.finish(PushNotificationIOS.FetchResult.NoData);
        }
    }


    /**************************************************
     * XU ly Notification rieng của Android
     * @param
     **************************************************/
    _toANDROID(notification) {
        // Click noti popup, statusBar (APP BACKGROUND, ACTIVE)
        if (notification.userInteraction) {
                        
            // console.log( '---- NOTIFICATION TAP BANNER android:', notification );
            this.isAllowSetNotiNum = false;
            this._clickNoti(notification);
        }
    }


    /**************************************************
     * Check Notification khi app da exit, close (Hardpress Android)
     * @param
     **************************************************/
    _checkNotiWhenCloseApp() {
        PushNotification.popInitialNotification((notification) => {
            if (notification && !GlobalVariable.isOpenApp) {
                // console.log( '---- NOTIFICATION APP EXIT:', notification);
                
                // Click noti popup, statusBar (APP EXIT)
                if (notification.userInteraction) {
                    
                    // console.log('---- Click Noti APP EXIT:', notification );
                    this._clickNoti(notification);
                }
            }
        });
    }


    /**************************************************
     * Xu ly khi click vao noti và chuyen man hinh
     * @param notification
     **************************************************/
    _clickNoti(notification) {
        // console.log('-------------- clickNoti PROCESS');
        const modelCategory = Platform.OS !== 'android' ? notification.data.modelCategory : notification.modelCategory;

        // Truong hop da login
        if (GlobalVariable.isLoged) {
            // Read noti
            this._readNoti(notification);

            // console.log( '---- XU LY NAVIGATE DA LOGIN:');
            this._userLoged(notification, modelCategory);
        } 
        // Truong hop chua login (foreGround & backGround) thi login xong moi xu ly
        else {
            // console.log( '---- XU LY NAVIGATE CHUA LOGIN:');
            this._userUnLoged(notification, modelCategory);
        }
    }


    /**************************************************
     * FUNCTION: _userLoged
     * DESC: Xử lý noti khi user da login
     * @param
     * @private
     ***************************************************/
    _userLoged(notification, modelCategory) {

        // Da login roi thi xu ly tai cho
        if (notification && modelCategory) {

            // Loại Noti
            const type = '' + modelCategory;

            // value
            const model = Platform.OS !== 'android' ? notification.data.model : JSON.parse(notification.model);

            // Check valid data
            if (! this._checkValidData(type, model)) {
                return;
            }

            // Get routename tu noti (callback)
            this._getRouteNameNoti(type, (routeName) => {

                switch ( type ) {
                    // 1: Detail khách hàng tiềm năng
                    case "1": 
                        // validate data
                        this._acceptGetPotential(routeName, model);
                        break;
        
                    // 2: PTC return
                    case "2": 
                        this._reDirectScreen(routeName, {SupId: model.SupId}, strings('dl.notification.move.toDeploy'));
                        break;
            
                    // all
                    default: 
                        this._reDirectScreen(routeName, {}, strings('dl.notification.move.toNotiList'));
                        break;
                }
        
                // Clear redux data notify
                this.props.setNoti(null);
            });
        }
    }


    /**************************************************
     * FUNCTION: _userUnLoged
     * DESC: Xử lý noti khi user chua login
     * @param
     * @private
     ***************************************************/
    _userUnLoged(notification, modelCategory) {

        // Set notification data vao state redux sau do login
        if (notification && modelCategory) {
            this.props.setNoti(notification);
        }      
    }


    /**************************************************
     * FUNCTION: _acceptGetPotential 
     * DESC: Xử lý accept KHTN cho sale trước khi chuyển màn hình
     * @param
     * @private
     ***************************************************/
    _acceptGetPotential(routeName, model) {
        const { showLoading } = this.props;

        // Check loading local & show loading modal
        this._checkLoadingLocal();

        // input API
        const myInput = {
            PotentialCusId: model.PotentialObjID,
            // Code: model.Code
        }

        // Call API
        api.acceptPotential(myInput, (success, result, msg) => {
            
            // hide global loading
            // showLoading(false);    

            // Redirect to Detail Potential Customer
            if (success) {
                this._reDirectScreen(
                    routeName, 
                    { PotentialCusId: model.PotentialObjID },
                    msg
                );
            } else {
                this._reDirectScreen(
                    'NotificationList', 
                    null, 
                    msg.message
                );
            }
        });
    }


    /**************************************************
     * FUNCTION: _getRouteNameNoti
     * Xử lý notifi va trả ra tên màn hình cần chuyển đi
     * @param modelCategory string
     * @return callback: object
     **************************************************/
    _getRouteNameNoti(modelCategory, callback) {
        const obj = getRouteName(modelCategory);
        callback (obj.routeName);
    }


    /**************************************************
     * FUNCTION: _checkValidData 
     * Kiểm tra dữ liệu trong model có tồn tại ko
     * @param 
     * @return 
     **************************************************/
    _checkValidData(type, model) {
        let errorList = [];

        // Check 
        if (type == "1") {
            if (!model.PotentialObjID) {
                errorList.push({
                    name: 'PotentialObjID',
                    msg: strings('dl.notification.dataInvalid')
                });
            }
        }

        if (type == "2") {
            if (!model.SupId) {
                errorList.push({
                    name: 'SupId',
                    msg: strings('dl.notification.dataInvalid')
                });
            }
        }

        // khong co loi = true
        if (errorList.length == 0) {
            return true;
        }

        // co loi = false
        // USE MODAL GLOBAL (showPopup, content, routeName, params)
        this.props.showModalWarning(
            true, 
            errorList[0].msg
        );
        return false;
    }


    /**************************************************
     * FUNCTION: _checkLoadingLocal 
     * DESC: Kiểm tra có đang loading local ko, nếu có thì tắt và show loading global
     * @param
     * @private
     ***************************************************/
    _checkLoadingLocal() {
        const { showLoading, forceStopLoadingLocal, loadingLocal } = this.props;

        // Check loading local
        if (loadingLocal) {
            // force stop local loading 
            forceStopLoadingLocal(true);
            // show global loading
            showLoading(true);

        } else {
            // show global loading
            showLoading(true);
        }
    }


    /**************************************************
     * FUNCTION: _reDirectScreen 
     * DESC: Xử lý chuyển màn hình kèm input
     * @param
     * @private
     ***************************************************/
    _reDirectScreen(routeName, param, message) {
        const { showLoading } = this.props;

        // hide global loading
        showLoading(false);

        // Gọi modal action
        if (routeName !== '') {
            // USE MODAL GLOBAL (showPopup, content, routeName, params)
            this.props.showModalAction(
                true, 
                message, 
                routeName, 
                param
            );
        }
    }


    /**************************************************
     * FUNCTION: _handleReadNoti (LOAD API)
     * DESC: 
     * @param
     * @private
     ***************************************************/
    _readNoti(notification) {
        const model = Platform.OS !== 'android' ? notification.data.model : JSON.parse(notification.model);
        const NotiId = model.NotiId;

        if (NotiId > 0) {
            // api: 1 là đã dọc tất cả, 0 là đã đọc 1 tin
            api.readNotiLog({ IdNoti: NotiId, IsReadAll: 0 }, (success, result, msg) => { 
                    
                if (success) { 
                    // set number read vao redux store
                    this._setNotiNum();
                    // set number read vao ICON APP (only IOS)
                    this._setNotiNumIOS();
                }}
            );
        }
    }


    /**************************************************
     * Xử lý set noti number vào cache va redux store 
     * (cho icon App và icon trong App)
     * @param
     **************************************************/
    _setNotiNum(type = '-') {
        const { setNotinum } = this.props;

        // Get noti number từ redux store
        this._getNotiNum(type, (numUnread) => {
            
            let numSet = typeof(numUnread) === 'string' ? Number(numUnread) : numUnread;
            numSet = type === '+' ? numSet + 1 : numSet - 1;

            // Set new number from push real time from badge to cache & redux store;
            setNotinum(numSet);

            // Cho phep set auto noti tro lai
            this.isAllowSetNotiNum = true;
        } );
    }


    /**************************************************
     * Xử lý set noti number vào APP ICON IOS (IOS Only)
     * (cho icon App và icon trong App)
     * @param
     **************************************************/
    _setNotiNumIOS(type = '-') {

        // For IOS
        if (Platform.OS !== 'android') { 

            this.notiNumIOS = type === '+' ? this.notiNumIOS + 1 : this.notiNumIOS - 1;
            setBadgeIconApp(this.notiNumIOS);
        }
    }


    /**************************************************
     * Xử lý get noti number từ caches ra và bỏ vào redux state 
     * (cho icon App và icon trong App)
     * Note: App Start
     * @param
     **************************************************/
    _getNotiNum(type, callback) {
        // Lan dau cai app, cache app se tra ve mang rong, length = 0 -> se lay số từ cache của system
        // Lan sau vao lai, cache se tra ve gia trị int, length = undefined -> se lay res

        const { notiNum } = this.props;

        /**
         * KHÔNG DÙNG NỮA
         * 
            // Get cache Badge from System
            getBadgeIconApp((num) => {
                let systemBadge = num;

                accessCachesNoti.readCacheNotiNum((res) => {
                    return callback(res.length === 0 ? systemBadge : res);
                });
            });
            
        */

        // Notinum tu redux
        return callback(notiNum);
    }
    
    
    /**
     * 
     */
    render() {
        return null;
    }
}

export default connect(state => {
    return {
        loadingLocal: state.splashReducer.loadingLocal,
        notiNum: state.homeReducer.notificationNum,
    }
}, { 
    showLoading, forceStopLoadingLocal, 
    showModalAction, showModalWarning,
    setDeviceToken, setNoti, setNotinum 
})(TechPushNotification);


/*

    // AMAZON APPLE
    // EXPLAIN
    "APNS_SANDBOX":"{
        \"aps\":{
            \"alert\":{
                \"title\":\"Test notify title\",
                \"body\":\"Test notify content 123\"
            },
            \"content-available\": 1,
            \"badge\": 1,
            \"sound\": \"default\"
        },
        \"model\":{
            \"key\": \"xxx\",
            \"param\": null,
            \"id\": null
        }
    }"

    // MIN
    "APNS_SANDBOX":"{\"aps\":{\"modelCategory\":\"text\", \"title\":\"Test notify title\", \"message\":\"Test notify content 123\", \"alert\":{\"title\":\"Test notify title\", \"body\":\"Test notify content 123\" }, \"content-available\": 1, \"badge\": 1, \"sound\": \"default\" }, \"model\":{\"key\": \"xxx\", \"param\": null, \"id\": null }}"



    // AMAZON ANDROID
    // EXPLAIN
    "GCM": "{ 
        \"data\": { 
            \"message\": \"Sample message for Android endpoints\", 
            \"title\":\"Test notify title\", 
            \"priority\" : \"high\",
            \"badge\": 1,
            \"model\":{
                \"key\": \"xxx\",
                \"param\": null,
                \"id\": null
            }
        } 
    }"

    // MIN
    "GCM": "{\"data\": {\"message\": \"Sample message for Android endpoints\", \"title\":\"Test notify title\", \"priority\" : \"high\", \"badge\": 1, \"model\":{\"key\": \"xxx\", \"param\": null, \"id\": null }}}"

*/