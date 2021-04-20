// LIB
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';

/**
 * - Return Screen Name & icon
 * @author ThuanDD3
 * @date Jun, 2019
 */

export function getRouteName(modelCategory) {
    // console.log(modelCategory);
    let type = '' + modelCategory;
    let obj = {};
    const icoBell = '../../assets/images/home/bell.png';
    const icoReturn = '../../assets/images/home/noti-icon-2.png';
    const icoComplete = '../../assets/images/home/noti-icon-1.png';
    const icoNew = '../../assets/images/home/noti-icon-3.png';


    switch ( type ) {

        // 0: Test
        case "0":
            obj = { routeName: "NotificationList", icoUri: require(icoBell) }; break;
        // 1: Detail khách hàng tiềm năng
        case "1":
            obj = { routeName: "pcDetailCustomers", icoUri: require(icoNew) }; break;
        // 2: PTC return
        case "2":
            obj = { routeName: "DeploymentDetail", icoUri: require(icoReturn) }; break;
        // 3: PTC complete
        case "3":
            obj = { routeName: "NotificationList", icoUri: require(icoComplete) }; break;
        // // 4: PTC appointed
        case "4":
            obj = { routeName: "NotificationList", icoUri: require(icoComplete) }; break;

            // recare
        case "7":
            obj = { routeName: "pcReCareList", icoUri: require(icoBell) }; break;

            //birthday
        case "8":
            obj = { routeName: "pcBirthdayList", icoUri: require(icoBell) }; break;

        // 99: Test
        case "99":
            obj = { routeName: "NotificationList", icoUri: require(icoBell) }; break;
        // all
        default:
            obj = { routeName: "NotificationList", icoUri: require(icoBell) }; break;
    }

    return obj;
}

/**
 * Xu ly get number icon badge - IOS only
 */
export function getBadgeIconApp(callback) {

    if (Platform.OS !== 'android') {
        PushNotification.getApplicationIconBadgeNumber((num) => {
            // get current number
            const curNum = num;
            return callback(curNum);
        });
    } else {
        return callback(0);
    }

}

/**
 *
 * @param {*} PushNotification
 * @param {*} isNum
 */
export function setBadgeIconApp(isNum = 0) {

    if (Platform.OS !== 'android') {
        PushNotification.setApplicationIconBadgeNumber(isNum);
    }
}
