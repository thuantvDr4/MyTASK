import {Alert} from 'react-native';
import {strings} from 'locales/i18n';
import GlobalVariable from '../../config/globalVariable';

import * as t from './actionTypes';
import { NET_INFO_CHANGED } from 'react-native-redux-listener';

let initialState = { isConnected: true, isLogin: false, Username: '', userInfo: {}, avatar: null };

const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case NET_INFO_CHANGED:
            
            if (state.isConnected != action.isConnected && action.isConnected === false) {
                Alert.alert(
                    strings('dialog.title'),
                    strings('dl.dialog.lost_internet'),
                );
            }

            state = {
                ...state, 
                isConnected: action.isConnected
            };
            return state;

        case t.LOGIN_SUCCESS:
            state = {
                ...state, 
                isLogin: true,
                Username: action.Username,
                userInfo: action.userInfo
            };

            // set thong tin upload tu tren server tra ve
            GlobalVariable.setUploadConfig(action.userInfo);
            return state;

        case t.LOG_OUT:
            state = {
                ...state, 
                isLogin: false,
                Username: '',
                userInfo: {}
            };
            return state;

        case t.SET_USERNAME:
            state = {
                ...state, 
                Username: action.Username
            };
            return state;

        case t.UPDATE_AVATAR:
            state = {
                ...state,
                avatar: action.data
            }
            return state;

        default:
            return state;
    }
};


export default authReducer;