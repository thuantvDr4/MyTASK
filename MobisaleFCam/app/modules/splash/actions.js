import * as t from './actionTypes';
import * as api from './api';

/**
 * Kiem tra imei co ton tai tren MBS khong
 * 
 * @param {*} data 
 * @param {*} callback 
 */
// export function checkIMEI(data, callback) {
    
//     return (dispatch) => {
//         api.checkIMEI(data, (isSuccess, respData, msg) => {
            
//             if (isSuccess) {
//                 dispatch({ type: t.SET_USERNAME, Username: respData.UserName });
//                 callback(true, null, respData);
                
//             } else {
//                 callback(false, msg);
//             }
//         });
//     }
// }

/**
 * Dua username vào state
 * 
 * @param {*} data 
 */
export function setUserName(UserName) {
    
    return (dispatch) => {
        dispatch({ type: t.SET_USERNAME, Username: UserName });
    }
}

/**
 * Dua device Info (Lib) vao state
 * 
 * @param {*} data 
 */
export function setDeviceInfo(info) {
    return (dispatch) => {
        dispatch({ type: t.SET_DEVICE_INFO, deviceInfo: info });
    }
}

/**
 * Dua device Imei vao state
 * 
 * @param {*} data 
 */
export function setDeviceImei(Imei) {
    return (dispatch) => {
        dispatch({ type: t.CHANGE_DEVICE_IMEI, deviceImei: Imei });
    }
}

/**
 * Dua device Token vao state
 * 
 * @param {*} data 
 */
export function setDeviceToken(token) {
    return (dispatch) => {
        dispatch({ type: t.SET_DEVICE_TOKEN, data: token });
    }
}

/**
 * Set App version vao state
 * 
 * @param {*} data 
 */
export function setAppVersion(appVersion) {
    return (dispatch) => {
        dispatch({ type: t.SET_APP_VERSION, appVersion: appVersion });
    }
}

/**
 * Dua notifi value vao state
 * 
 * @param {*} data 
 */
export function setNoti(notification) {
    return (dispatch) => {
        dispatch({ type: t.SET_NOTI, notification: notification });
    }
}