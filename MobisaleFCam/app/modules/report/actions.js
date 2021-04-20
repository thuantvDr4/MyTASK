import * as t from './actionTypes';
import * as api from './api';
// action báo cáo lương
export function reportSalary(data, successCB, errorCB) {
    return (dispatch) => {
        api.reportSalary(data, (success, respData, error) => {
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
// action báo cáo T-
export function reportTSub(data, successCB, errorCB) {
    return (dispatch) => {
        api.reportTSub(data, (success, respData, error) => {
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
//action báo cáo T+
export function reportTBonus(data, successCB, errorCB) {
    return (dispatch) => {
        api.reportTBonus(data, (success, respData, error) => {
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