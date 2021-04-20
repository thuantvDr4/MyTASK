import myNetwork, {encryptPassword} from '../../config/network';
import GlobalVariable from '../../config/globalVariable';
import RNFetchBlob from 'rn-fetch-blob';
/**
 * Xu ly login
 * 
 * @param object data 
 * @param function callback 
 */
export function signIn(data, callback) {
    const loginData = {
        ...data,
        Password: encryptPassword(data.Password)
    }
    myNetwork.post(
        '/User/Login',
        loginData
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
    });
}


/**
 * Xu ly lay thong tin user
 * 
 * @param object username 
 * @param function callback 
 */
export function getInfo(username, callback) {

    myNetwork.post(
        '/User/GetInfo',
        {
            Username: username
        }
    )
    .then(response => response.data)
    .then(response => {

        if (response.Code === 1) {
            callback(true, response.Data, null);
        } 
        else {
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
    });
}


/**
 * Get System Api Token
 * 
 * @param {*} myData = ""
 * @param {*} callbackDownloadAvatar
 * @param {*} callbackUpdateAvatarRedux
 *  
 */
export function getSystemApiToken(myData, idImage, callbackDownloadAvatar, callbackUpdateAvatarRedux) {
    myNetwork.post(
        '/User/GetSystemApiToken',
        myData
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callbackDownloadAvatar(idImage, response.Data[0].Token, callbackUpdateAvatarRedux);
        }
    })
    .catch(error => {
           // error handling
    });
}

//download ảnh avatar 
export function downloadAvatarImage(idImage, dataSystemApiToken, callbackUpdateAvatarRedux) {

    let dirs = RNFetchBlob.fs.dirs;

    RNFetchBlob.config(
        {
            fileCache : true, 
            // path : dirs.DocumentDir + '/avatar.png', 
            appendExt : 'png'
        }
    )
    .fetch('Post', 
        GlobalVariable.DOWNLOAD_IMAGE_URL, {
            'Authorization' : 'Bearer ' + GlobalVariable.kong_token,
            'SystemApiToken' : 'Bearer ' + dataSystemApiToken,
            'Content-Type' : 'application/json'
        }, JSON.stringify({
            Id: idImage
        })
    )
    .then((res) => {
        
        if (res.respInfo.status === 200) {
            callbackUpdateAvatarRedux(true, res.path());
        } else {
            callbackUpdateAvatarRedux(false, null);
        }
    })
    .catch((errorMessage, statusCode) => {
        // error handling
    });
}