import * as t from './actionTypes';

let initialState = { 
    appVersion: null,
    deviceInfo: null,
    deviceImei: '', 
    deviceToken: '', 
    notification: null, 
    modalGlobalAction: {
        isShow: false,
        content: '',
        routeName: '',
        params: null
    },
    modalGlobalWarning: {
        isShow: false,
        content: '',
    },
    isLoading: false,
    loadingLocal: false,
    forceStopLoadingLocal: false,
    modalLocal: false,
    forceStopModalLocalStatus: false,
};

const splashReducer = (state = initialState, action) => {
    switch (action.type) {
        case t.SET_DEVICE_INFO:
            state = {
                ...state, 
                deviceInfo: action.deviceInfo
            };
            return state;

        case t.CHANGE_DEVICE_IMEI:
            state = {
                ...state, 
                deviceImei: action.deviceImei
            };
            return state;
        
        case t.SET_DEVICE_TOKEN:
            state = {
                ...state,
                deviceToken: action.data.token
            };
            return state;
        
        case t.SET_APP_VERSION:
            state = {
                ...state,
                appVersion: action.appVersion
            };
            return state;

        case t.SET_NOTI:
            state = {
                ...state,
                notification: action.notification
            };
            return state;

        case 'showloading':
            state = {
                ...state,
                isLoading: action.isLoading,
            };
            return state;

        case 'forceStopLoadingLocal':
            state = {
                ...state,
                forceStopLoadingLocal: action.forceStopLoadingLocal
            };
            return state;

            
        case 'checkLoadingLocal':
            state = {
                ...state,
                loadingLocal: action.loadingLocal
            };
            return state;
        
        case 'forceStopModalLocal':
            state = {
                ...state,
                forceStopModalLocalStatus: action.forceStopModalLocalStatus
            };
            return state;
            
        case 'checkModalLocal':
            state = {
                ...state,
                modalLocal: action.modalLocal
            };
            return state;

        case t.SHOW_MODAL_ACTION:
            state = {
                ...state,
                modalGlobalAction: action.modalGlobalAction,
            };
            return state;

        case t.SHOW_MODAL_WARNING:
            state = {
                ...state,
                modalGlobalWarning: action.modalGlobalWarning,
            };
            return state;

        default:
            return state;
    }
};

export default splashReducer;