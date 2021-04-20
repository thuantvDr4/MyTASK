import myNetwork, { encryptPassword } from '../../config/network';

/**
 * Thay doi mat khau
 * 
 * @param function callback 
 */
export function changePassword(data, callback) {
    const { NewPass, CurrentPass, Username } = data;
    myNetwork.post(
        '/User/ChangePassword',
        {
            Username: Username,
            OldPassword: encryptPassword(CurrentPass),
            NewPassword: encryptPassword(NewPass)
        }
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {
                callback(true, response.Data);
            }
            else {
                callback(false, null, { message: response.Message });
            }
        })
        .catch(error => {
            //if (error === null) return;

            callback(false, null, { message: error.toString() });
        });
}

/**
 * Clear hop dong
 * 
 * @param function callback 
 */
export function clearHD(Username, callback) {
    myNetwork.post(
        '/Registration/ApproveRegistrationAuto',
        {
            Username: Username,
            Token: 'abc123'
        }
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data);
            }
            else {
                callback(false, null, { message: response.Message });
            }
        })
        .catch(error => {
            //if (error === null) return;

            callback(false, null, { message: error.toString() });
        });
}

/**
 * API get deploy list
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
export function getDeploymentReturnList(myData, callback) {
    myNetwork.post(
        '/Deployment/getDeploymentReturnList',
        myData
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, { Code: response.Code, message: response.Message });
            }
        })
        .catch(error => {
            callback(false, null, { message: error });
        });
}

/**
 * logout
 * 
 * @param function callback 
 */
export function signOut(Username, callback) {

    myNetwork.post(
        '/User/Logout',
        {
            Username: Username,
        }
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data);
            }
            else {
                callback(false, null, { message: response.Message });
            }
        })
        .catch(error => {
            //if (error === null) return;

            callback(false, null, { message: error.toString() });
        });
}

/**
 * GetSetting
 * @param function callback 
 */
export function getSetting(input, callback) {
    myNetwork.post(
        '/User/GetSetting',
        input
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data);
            } else {
                callback(false, null, { message: response.Message });
            }
        })
        .catch(error => {
            callback(false, null, { message: error });
        });
}

/**
 * GCM create regid
 * 
 * @param function callback 
 */
export function registerRegId(input, callback) {
    myNetwork.post(
        '/Notification/GCMCreateRegId',
        input
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {
                callback(true, response.Data);
            } else {
                callback(false, null, { Code: response.Code, message: response.Message });
            }
        })
        .catch(error => {
            callback(false, null, { message: error });
        });
}

/**
 * GCM create regid
 * 
 * @param function callback 
 */
export function testNoti(input, callback) {
    myNetwork.post(
        '/Notification/GCMPushNoti_BySalename',
        input
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {
                callback(true);
            } else {
                callback(false, null, { Code: response.Code, message: response.Message });
            }
        })
        .catch(error => {
            callback(false, null, { message: error });
        });
}


/**
 * Get Noti list
 * 
 * @param function callback 
 */
export function getNotiLog(input, callback) {
    myNetwork.post(
        '/Notification/GCMListNotificationLog',
        input
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {

                // callback
                callback(true, response);
            } else {
                callback(false, null, { Code: response.Code, message: response.Message });
            }
        })
        .catch(error => {
            callback(false, null, { message: error.message });
        });
}


/**
 * Read Noti Log
 * 
 * @param function callback 
 */
export function readNotiLog(input, callback) {
    myNetwork.post(
        '/Notification/GCMReadNoti',
        input
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {

                // callback
                callback(true, response.Data);
            } else {
                callback(false, null, { Code: response.Code, message: response.Message });
            }
        })
        .catch(error => {
            callback(false, null, { message: error });
        });
}


/**
 * Get Accept KHTN
 * 
 * @param function callback 
 */
export function acceptPotential(input, callback) {
    myNetwork.post(
        '/PotentialCustomer/Accept',
        input
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {
                callback(true, response.Data, response.Message);
            } else {
                callback(false, null, { Code: response.Code, message: response.Message });
            }
        })
        .catch(error => {

            callback(false, null, { message: error });
        });
}

/**
 * Get URL Help Page
 * 
 * @param function callback 
 */
export function getUrlHelpPage(data, callback) {
    myNetwork.post(
        '/User/HelpPage',
        data
    )
        .then(response => {
            return response.data;
        })
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, response.Message);
            } else {
                callback(false, null, { Code: response.Code, message: response.Message });
            }
        })
        .catch(error => {

            callback(false, null, { message: error });
        });
}


