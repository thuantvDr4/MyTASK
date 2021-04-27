

import * as t from './actionTypes';
import * as api from './api';


export function nextStep(dataTemp) {
    return (dispatch) => {

        if (dataTemp.step === 1) {
            dispatch({ type: t.STEP_F_DONE, isScreen: !dataTemp.nextScreen ? dataTemp.isScreen : dataTemp.nextScreen });

        } else if (dataTemp.step === 2) {
            dispatch({ type: t.STEP_S_DONE, isScreen: !dataTemp.nextScreen ? dataTemp.isScreen : dataTemp.nextScreen });

        } else if (dataTemp.step === 3) {
            dispatch({ type: t.STEP_T_DONE });

        } else {
            dispatch({ type: t.BACK_STEP });
        }
    }
}

export function submitCreateTTKH(dataTemp) {
    return (dispatch) => {
        if (dataTemp.step === 3) {
            dispatch({ type: t.SUBMIT_STEP_LAST});
        }
    }
}

export function updateInfoRegistration(data, callback) {
    return (dispatch) => {
        dispatch({type: 'sale-new/UPDATE_INFO_REGISTRATION', data: data });
        callback();
    }
}
