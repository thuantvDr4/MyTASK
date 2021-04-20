import * as t from './actionTypes';
import * as api from './api';

export function loading(data) {
    return (dispatch) => {
        dispatch({type: t.LOADING, isLoading: data });
    }
}

export function loadMap(data) {
    return (dispatch) => {
        dispatch({ type: t.LOAD_MAP, region: data });
    }
}

export function dragMap(data) {
    return (dispatch) => {
        dispatch({ type: t.DRAG_MAP, regionDrag: data });
    }
}

export function showPointGroup(data) {
    return (dispatch) => {
        dispatch({
            type: t.SHOW_POINT_GROUP,
            pointGroup: data.pointGroup,
            region: data.region,
        });
    }
}

export function changeAddressPointGroup(data) {
    return (dispatch) => {
        dispatch({type: t.CHANGE_ADDRESS_POINT_GROUP, addressPointGroup: data });
    }
}

export function getDistrict(data, successCB, errorCB) {
    return (dispatch) => {
        api.loadDistrict(data.value, (success, respData, error) => {
            if (success)
            {
                dispatch({ type: t.CHANGE_LOCATION, data: data });
                successCB(respData);
            }
            else {
                errorCB(error);
            }
        });
    }
}

export function getWard(data, idProvince, successCB, errorCB) {
    return (dispatch) => {
        api.loadWard(data.value, idProvince, (success, respData, error) => {
            if (success)
            {
                dispatch({ type: t.CHANGE_DISTRICT, data: data });
                successCB(respData);
            }
            else {
                errorCB(error);
            }
        });
    }
}

export function getStreet(data, idDistrict, idProvince, successCB, errorCB) {
    return (dispatch) => {
        api.loadStreet(data.value, idDistrict, idProvince, (success, respData, error) => {
            if (success)
            {
                dispatch({ type: t.CHANGE_WARD, data: data });
                successCB(respData);
            }
            else {
                errorCB(error);
            }
        });
    }
}

export function getHomeType(successCB, errorCB) {
    return (dispatch) => {
        api.loadHomeType((success, respData, error) => {
            if (success)
            {
                successCB(respData);
            }
            else {
                errorCB(error);
            }
        });
    }
}

export function getBuilding(idProvince, successCB, errorCB) {
    return (dispatch) => {
        api.loadBuilding(idProvince, (success, respData, error) => {
            if (success)
            {
                successCB(respData);
            }
            else {
                errorCB(error);
            }
        });
    }
}