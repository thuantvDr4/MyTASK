import * as t from './actionTypes';
import * as api from './api';

export function login(data, successCB, errorCB) {
    return (dispatch) => {
        api.signIn(data, (success, respData, error) => {
            
            if (success) {
                // Lay thong tin user
                api.getInfo(data.Username, (success, respData, error) => {

                    if (success) {
                        // console.log('================ USER_INFO: ', respData);
                        dispatch({ type: t.LOGIN_SUCCESS, Username: data.Username, userInfo: respData[0] });

                        // set unRead notify vào redux
                        dispatch({ type: 'home/SET_NOTI_NUM', notificationNum: respData[0].UnReadCount });
                        
                        // xoá đường dẫn cache avatar trong redux
                        dispatch({ type: t.UPDATE_AVATAR, data: null});
                
                        // update đường dẫn avatar vào redux
                        let updateAvatar = (status, data) => {
                            if (status) {
                                dispatch({ type: t.UPDATE_AVATAR, data:'file://' + data });
                            }
                        };

                        // kết nối api lấy token và funtion truyền funtion download ảnh avatar
                        api.getSystemApiToken({}, respData[0].AvatarId, api.downloadAvatarImage, updateAvatar);
                        successCB();
                    }
                    else {
                        errorCB(error);
                    }
                });                
            }
            else {
                errorCB(error);
            }
        });
    }
}


// Auto login, dung header lưu trong cache
export function getInfo(dataInput, successCB, errorCB) {

    const data = {
        Username: dataInput.UserName
    }

    return (dispatch) => {
        // Lay thong tin user
        api.getInfo(data.Username, (success, respData, error) => {

            if (success) {
                // console.log('================ USER_INFO: ', respData);
                dispatch({ type: t.LOGIN_SUCCESS, Username: data.Username, userInfo: respData[0] });

                // set unRead notify vào redux
                dispatch({ type: 'home/SET_NOTI_NUM', notificationNum: respData[0].UnReadCount });
                
                // xoá đường dẫn cache avatar trong redux
                dispatch({ type: t.UPDATE_AVATAR, data: null});
                
                // update đường dẫn avatar vào redux
                let updateAvatar = (status, data) => {
                    if (status) {
                        dispatch({ type: t.UPDATE_AVATAR, data:'file://' + data });
                    }
                };

                // kết nối api lấy token và funtion truyền funtion download ảnh avatar
                api.getSystemApiToken({}, respData[0].AvatarId, api.downloadAvatarImage, updateAvatar);
                successCB();
            }
            else {
                errorCB(error);
            }
        });    
    }
}