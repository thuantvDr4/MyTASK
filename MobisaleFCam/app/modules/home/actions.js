// ACTION
import * as t from './actionTypes';

// HELPER
import NavigationService from 'app-libs/helpers/NavigationService';
import { setBadgeIconApp } from 'app-libs/helpers/notificationHelper';
import GlobalVariable from '../../config/globalVariable';

// DBase
import cacheNotiNum from "app-libs/caches/cacheNotiNum";
import * as accessCachesLogin from 'app-libs/helpers/accessCachesLogin';


export function setNavigation(data) {
    return (dispatch) => {
        dispatch({type:t.NAVIGATION, homeNavigation:data})
    }
}


export function resetAllDataBookport() {
    return (dispatch) => {
        dispatch({ type: 'sale-new/RESET_ALL_DATA_BOOKPORT'});
    }
}


export function logout() {
    return (dispatch) => {
        setTimeout(() => {
            NavigationService.navigateReset('Login');
            dispatch({ type: t.LOG_OUT});
        }, 0);

        GlobalVariable.isLoged = false;

        // CLEAR CACHE SAVE LOGIN HEADER
        accessCachesLogin.writeCacheLogin('');
    }
}


export function showTabBar(data) {
    return (dispatch) => {
        dispatch({ type: t.SHOW_TAB_BAR, data: data });
    }
}


/**
 * 
 * @param {*} notificationNum 
 */
export function setNotinum(notificationNum) {
    // set caches noti number
    cacheNotiNum.cache(notificationNum);

    // set badge icon App IOS
    // setBadgeIconApp(notificationNum);

    return (dispatch) => {
        dispatch({ type: t.SET_NOTI_NUM, notificationNum: notificationNum });
    }
}


/**
 * 
 * @param {*} notificationNum 
 */
export function unsetNoti(notification) {
    return (dispatch) => {
        dispatch({type: 'splash/SET_NOTI', notification: notification });
    }
}