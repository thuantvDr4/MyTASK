import * as t from './actionTypes';
import * as api from './api';


//========>V2.10

export function pushDataInfoRegistration(data) {
    return (dispatch) => {
        dispatch({type: 'sale-new/push_data_info_openSafe_registration', data: data });
        return Promise.resolve()
    }
}


export function showTabBar(data) {
    return (dispatch) => {
        dispatch({type: 'home/SHOW_TAB_BAR', data: data });
    }
}
