import * as t from './actionTypes';

export function pushDataInfoRegistration(data) {
    return (dispatch) => {
        dispatch({type: 'sale-new/PUSH_DATA_INFO_REGISTRATION', data: data });
        return Promise.resolve()
    }
}

export function showTabBar(data) {
    return (dispatch) => {
        dispatch({type: 'home/SHOW_TAB_BAR', data: data });
    }
}