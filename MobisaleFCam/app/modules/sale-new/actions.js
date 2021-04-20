import * as t from './actionTypes';
import * as api from './api';

/**
 * 
 */
export function resetAllDataBookport() {
    return (dispatch) => {
        dispatch({ type: t.RESET_ALL_DATA_BOOKPORT});
    }
}

/**
 * 
 */
export function isMapReady() {
    return (dispatch) => {
        dispatch({ type: t.IS_MAP_READY});
    }
}

/**
 * @returns {function(*)}
 */
export function saveLatLngDevice(data) {
    return (dispatch) => {
        dispatch({type: t.SAVE_LAT_LNG_DEVICED, data: data });
    }
}

/**
 * luu toa do hien tai de load map
 * @param data
 * @returns {function(*)}
 */
export function loadMap(data) {
    return (dispatch) => {
        dispatch({ type: t.LOAD_MAP, data: data });
    }
}

/**
 * luu toa do khi di chuyen map
 * @param data
 * @returns {function(*)}
 */
export function dragMap(data) {
    return (dispatch) => {
        dispatch({ type: t.DRAG_MAP, data: data });
    }
}

/**
 * hien thi cac toa do tap diem
 * @param data
 */
export function showPointGroup(data) {
    return (dispatch) => {
        dispatch({ type: t.SHOW_POINT_GROUP, data: data });
    }
}

/**
 * chon vi tri tap diem
 * @param data
 * @returns {function(*)}
 */
export function changePointGroup(data) {
    return (dispatch) => {
        dispatch({type: t.CHANGE_POINT_GROUP, data: data });
    }
}

/**
 *
 */
export function clearDataMap() {
    return (dispatch) => {
        dispatch({type: t.CLEAR_DATA_MAP, data: data });
    }
}

/**
 * thay doi loai ha tang
 * @param data
 * @returns {function(*)}
 */
export function changeNetworkType(data) {
    return (dispatch) => {
        dispatch({ type: t.CHANGE_NETWORK_TYPE, data: data });
    }
}

/*
    Start Bookport
 */
/**
 * luu toa do can bookport
 * @param data
 * @returns {function(*)}
 */
export function regionBookport(data) {
    return (dispatch) => {
        dispatch({ type: t.REGION_BOOK_PORT, data: data });
    }
}

/*
    Start Bookport
 */
/**
 * luu toa do hien tai de load map
 * @param data
 * @returns {function(*)}
 */
export function changeTypeBookport(typeBookport, allowBookport) {
    return (dispatch) => {
        dispatch(
            {
                type: t.CHANGE_TYPE_BOOK_PORT,
                data: {
                    typeBookport: typeBookport,
                    allowBookport: allowBookport
                }
            }
            );
    }
}

/*
    END Bookport
 */

export function saveInstallAddress(data, callback) {
    return (dispatch) => {
        dispatch({type: t.SAVE_INSTALL_ADDRESS, data: data });
        callback();
    }
}

export function updateInfoRegistration(data, callback) {
    return (dispatch) => {
        dispatch({type: t.UPDATE_INFO_REGISTRATION, data: data });
        callback();
    }
}


/**
 * Xoa contract temp khi bookport bi loi. Fix truong hop thu hoi port
 */
export function clearContractTemp() {
    return (dispatch) => {
        dispatch({type: t.CLEAR_CONTRACT_TEMP});
    }
}