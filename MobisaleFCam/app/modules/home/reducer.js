import * as t from './actionTypes';

let initialState = {
    showTabBar : true,
    notificationNum: 0, 
};

const homeReducer = (state = initialState, action) => {
    switch (action.type) {
        
        case t.SHOW_TAB_BAR:
            state = {
                ...state,
                showTabBar : action.data
            };
            break;

        case t.SET_NOTI_NUM:
            state = {
                ...state,
                notificationNum: action.notificationNum
            };
            return state;
    }
    return state;
};


export default homeReducer;