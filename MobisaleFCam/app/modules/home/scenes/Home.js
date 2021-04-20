// LIB
import React from 'react';
import {
    ScrollView,View, BackHandler, Alert, BackAndroid, AppState, Platform
} from 'react-native';
import {connect} from 'react-redux';

// LANGUAGE
import {strings} from 'locales/i18n';

// COMPONENT
import HomeHeader from "../components/HomeHeader";
import HomeInfo from "../components/HomeInfo";
import HomeFunctions from "../components/HomeFunctions";

// LIB CUSTOM
import {AndroidBackHandler}  from '../components/AndroidBackHandler';

// ACTION
import { unsetNoti, setNotinum } from '../actions';

// API
import * as api from '../api';

// HELPER
import showLoading from 'app-libs/helpers/showLoading';
import { getRouteName, getBadgeIconApp, setBadgeIconApp } from 'app-libs/helpers/notificationHelper';
import { showModalAction, showModalWarning } from 'app-libs/helpers/showModal';
import NavigationService from "app-libs/helpers/NavigationService";
// VARIABLE
import GlobalVariable from '../../../config/globalVariable';

// STYLE
import styles from '../styles';

function getCurrentRouteFromState(navigationState) {
    // console.log(navigationState)
    // console.log(navigationState.index);
    // console.log(navigationState.routes)
    
    const route = navigationState.routes[navigationState.index];
    // dive into nested navigators
    if (route.routes) {
        return getCurrentRouteFromState(route);
    }
    return route;
}

class Home extends React.Component {

    /**
     * 
     * @param {*} props 
     */
    constructor(props){
        super(props);
    }

    /**
     * 
     */
    componentDidMount() {
        const alert = this.props.navigation.getParam('alert');

        if (alert) {
            this.props.showModalWarning(
                true, 
                alert.message
            );
            return;
        }

        // Check If Have notification
        this._checkNotification();

        //test code, sẽ xóa sau
        // NavigationService.navigate("ExtraServiceLists");
    }

    /**
     * 
     */
    componentWillUnmount() {
        // console.log('---------------', AppState.currentState);
    }

    /**
     * 
     */
    _checkNotification() {
        const { notification } = this.props;

        // XỬ LÝ NOTIFICATION
        if (notification) {
            this._processNotification(notification);
            // Read noti
            this._readNoti(notification);
        }
        return;
    }


    /**
     * 
     * @param {*} notification 
     */
    _processNotification(notification) {
        const { unsetNoti } = this.props;

        // SET VALUE NOTIFICATION TYPE IF HAVE
        const modelCategory = (Platform.OS !== 'android' ? notification.data.modelCategory : notification.modelCategory);

        // REDIRECT FOLLOW NOTIFICATION
        if (notification && modelCategory) {
            // console.log('-------> ROUTE FOLLOW NOTIFICATION', modelCategory);

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
                        this._acceptGetPotential(routeName, model);
                        break;
        
                    // 2: PTC return
                    case "2": 
                        this._reDirectScreen(routeName, { SupId: model.SupId }, strings('dl.notification.move.toDeploy'));
                        break;
            
                    // all
                    default: 
                        this._reDirectScreen(routeName, {}, strings('dl.notification.move.toNotiList'));
                        break;
                }
            });
        }

        // Clear redux data Notification sau khi da route
        unsetNoti(null);
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
                }}
            );
        }

        // Xử lý set noti number vào APP ICON IOS (IOS Only)
        this._setNotiNumIOS();
    }


    /**
     * Xử lý notifi va trả ra tên màn hình cần chuyển đi
     * @param
     */
    _getRouteNameNoti(modelCategory, callback) {
        const obj = getRouteName(modelCategory);
        callback (obj.routeName);
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
     * FUNCTION: _acceptGetPotential 
     * DESC: Xử lý accept KHTN cho sale trước khi chuyển màn hình
     * @param
     * @private
     ***************************************************/
    _acceptGetPotential(routeName, model) {
        const { showLoading } = this.props;

        // Show loading
        showLoading(true);

        // input API
        const myInput = {
            PotentialCusId: model.PotentialObjID,
        }

        // Call API
        api.acceptPotential(myInput, (success, result, msg) => {
            // Hide loading
            showLoading(false);
            
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

            this._getNotiNumIOS((numUnread) => {
            
                let numSet = typeof(numUnread) === 'string' ? Number(numUnread) : numUnread;
                numSet = type === '+' ? (numSet + 1) : (numSet > 0 ? numSet - 1 : 0);

                // Set new number from push real time from badge to cache & redux store;
                setBadgeIconApp(numSet);
            } );
        }
    }


    /**************************************************
     * Xử lý get noti number từ caches ra và bỏ vào redux state 
     * (cho icon App và icon trong App)
     * Note: App Start
     * @param
     **************************************************/
    _getNotiNum(callback) {
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


    /**************************************************
     * Xử lý get noti number từ system IOS
     * (cho icon App và icon trong App)
     * Note: App Start
     * @param
     **************************************************/
    _getNotiNumIOS(callback) {
        // Get cache Badge from System
        getBadgeIconApp((num) => {
            let systemBadge = num;

            return callback(systemBadge);
        });
    }


    /**
     * 
     */
    onBackButtonPressAndroid = () => {
        // console.log('---- BACK EXIT')
        Alert.alert(
            strings('home.home_screen.Exit_Application'),
            strings('dl.home.home_screen.exit_app'), [
                {
                    text: 'Cancel',
                    style: 'cancel'
                }, {
                    text: 'OK',
                    onPress: () => {
                        GlobalVariable.isLoged = false;
                        GlobalVariable.isOpenApp = false;
                        BackHandler.exitApp()
                    }
                },
            ], {
                cancelable: false
            }
        )
        return true;
    };


    render() {
        
        return (
            <AndroidBackHandler onBackPress={this.onBackButtonPressAndroid}>
                <View style={styles.container}>

                    <HomeHeader navigation={this.props.navigation}/>

                    <ScrollView>
                        <View style={[{paddingHorizontal: 16}]}>
                            <HomeInfo/>
                            <HomeFunctions/>
                        </View>
                    </ScrollView>
                </View>
            </AndroidBackHandler>
        );
    }
}
export default connect( state => { 
    return {
        notification: state.splashReducer.notification,
        notiNum: state.homeReducer.notificationNum,
    }; 
}, { unsetNoti, setNotinum, showModalAction, showModalWarning, showLoading })
(Home);

