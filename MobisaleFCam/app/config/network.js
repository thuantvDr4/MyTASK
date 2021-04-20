// LIB
import {Alert} from 'react-native';
import {Base64} from 'js-base64';
import {strings} from 'locales/i18n';
import md5 from 'react-native-md5';
import axios from 'axios';

// CUSTOM ME
import { PASS_PHARASE, BASE_URL, KONG_AUTH, URL_KONG_GET_TOKEN, CHECK_SUM_KEY, KONG_REFRESH } from './constants';
import GlobalVariable from './globalVariable';
import NavigationService from 'app-libs/helpers/NavigationService';
import * as accessCachesLogin from 'app-libs/helpers/accessCachesLogin';

/**
 * Hàm tạo checksum
 * 
 * B1. Stringify Data JSON post lên thành chuỗi
 * B2. Replace các ký tự đặc biệt \r, \n, \\, \s, "
 * B3. Base64 nội dung
 * B4. Cộng nội dung với KEY rắc muối
 * B5. MD5 nội dung ở hex và chuỗi ký tự viết thường
 */
export function genCheckSumKey(data) {
    
    let jsonString = JSON.stringify(data);
    
    // original
    // jsonString = jsonString.replace(/\r|\n|\\|\s/g, '');

    // fix
    // jsonString = jsonString.replace(/[^\x00-\x7F]/g, '');
    // jsonString = jsonString.replace(/\r|\n|\\|\s|['"]+/g, '');
    // jsonString = jsonString.replace(/^"(.+(?="$))"$/, '$1');
    
    // ONLY REMOVE \
    jsonString = jsonString.replace(/\\/g, '');
    
    return md5.hex_md5(Base64.encode(jsonString) + CHECK_SUM_KEY);
}

/**
 * Hàm lấy token ở KONG
 * @param {*} callback 
 */
export function getKongToken(callback) {
    axios.get(URL_KONG_GET_TOKEN, {
        headers: {
            Authorization: KONG_AUTH
        }
    }).then(function(response) {
        GlobalVariable.kong_token = response.data;
        GlobalVariable.kong_time = new Date();
        callback();
    }).catch(function(error) {
        alert('Error ' + JSON.stringify(error));
        return error;
    });
}

/**
 * Code ma hoa password
 * @param {*} 
 */
export function encryptPassword(password) {
    var crypto  = require('crypto');
    var key     = PASS_PHARASE;
    var iv      = new Array(17).join('0');

    var cipher  = crypto.createCipheriv('aes256', key, iv)
    var crypted = cipher.update(password, 'utf8', 'base64')
    crypted += cipher.final('base64');

    return crypted;
}

/**
 * Code xu ly giai ma password
 * @param {*}
 */
export function descryptPassword(passwordEncrypt) {
    var crypto  = require('crypto');
    var key     = PASS_PHARASE;
    var iv      = new Array(17).join('0');

    var decipher = crypto.createDecipheriv('aes256', key, iv);
    var dec      = decipher.update(passwordEncrypt, 'base64', 'utf8')
    dec += decipher.final('utf8');

    return dec;
}

/**
 * Main function
 */
const myNetwork = axios.create({
    baseURL: BASE_URL
});


//--------------------------------------------------------------- Xử lý trước khi REQUEST
myNetwork.interceptors.request.use(async config => {
    
    // Tinh toan thoi gian het kong token
    const curDate = new Date();
    const diffTime = (curDate - GlobalVariable.kong_time);
    const minutes = Math.floor(diffTime / 60) / 1000;

    // Refresh kong neu time lon hon thoi gian cho phep
    if (minutes > KONG_REFRESH)
    {
        const kongToken = await axios.get(URL_KONG_GET_TOKEN, {
            headers: {
                Authorization: KONG_AUTH
            }
        })

        GlobalVariable.kong_token = kongToken.data;
        GlobalVariable.kong_time = new Date();
    }

    config.timeout = 30000; //30s
    config.headers = {
        ...config.headers,
        'content-type': 'application/json',
        Authorization: 'Bearer ' + GlobalVariable.kong_token,
        CheckSum: genCheckSumKey(config.data),
        FTEL_MOBISALECAM_HEADER: GlobalVariable.ftel_mobisalecam_header,
        // AdminToken: 'e2d9dbec70636eb87b191afb9eed4676'
    }

    return config;

}, function(error) {
    return Promise.reject(error);
}); 

// Xử lý khi có RESPONSE
myNetwork.interceptors.response.use(

    function(response) {
        console.log('--------------- RESPONSE', response);
        // console.log(response.data.Code);
        // console.log(GlobalVariable.isLogin);

        const rData = response.data;

        //----------> NEW FIX UPGRADE v2.3.1 - Navigate to Upgrage
        if (response.data.Code == -1 && response.data.Data.IsNew === 1 ) {
            console.log('--------------- RESPONSE 1');
            NavigationService.navigateReset('Upgrade', {info: response.data.Data});

            return Promise.reject(null);
        }
        if (response.data.Code == -1 && response.data.Data.length > 0 && response.data.Data[0].IsNew === 1 ) {
            console.log('--------------- RESPONSE 2');
            NavigationService.navigateReset('Upgrade', {info: response.data.Data[0]});

            return Promise.reject(null);
        }

        // 
        if (response.data.Code == -1 && !GlobalVariable.isLogin) {
            console.log('--------------- RESPONSE 3');
            
            if (!GlobalVariable.isBackLogin) {
                console.log('--------------- RESPONSE 4');
                // WRITE CACHE SAVE LOGIN HEADER
                accessCachesLogin.writeCacheLogin('');

                NavigationService.navigateReset('Login', {alert: {
                    title: strings('dialog.title'),
                    message: response.data.Message,
                }});
            }

            GlobalVariable.isLoged = false;
            return Promise.reject(null);
        }

        // Từ API LOGIN, API GET INFO co header nay
        if (response.headers.ftel_mobisalecam_header) {
            console.log('--------------- RESPONSE 5');
            GlobalVariable.ftel_mobisalecam_header = response.headers.ftel_mobisalecam_header;

            // WRITE CACHE SAVE LOGIN HEADER
            if (GlobalVariable.isRememberPass) {
                accessCachesLogin.writeCacheLogin(response.headers.ftel_mobisalecam_header);
            }
            
        }
        
        return response;

    }, function(error) {
        // console.log('--------------- ERROR', error);
        console.log('--------------- ERROR.response', error.response);

        if (error.response && error.response.status == 401) {
            console.log('--------------- ERROR 1');
            if (!GlobalVariable.isBackLogin) {
                console.log('--------------- ERROR 2');
                // WRITE CACHE SAVE LOGIN HEADER
                accessCachesLogin.writeCacheLogin('');
                
                NavigationService.navigateReset('Login', {alert: {
                    title: strings('dialog.title'),
                    message: strings('dl.dialog.token_expired'),
                }});
            }

            GlobalVariable.isLoged = false;
            return Promise.reject(null);
        }
        
        if (error.response && error.response.status != 401) {
            console.log('--------------- ERROR 3');
            //----------> OLD
            // Alert.alert(
            //     strings('dialog.title'),
            //     strings('dl.dialog.error_connection'),
            // );
            // return Promise.reject(null);

            //----------> NEW FIX SERVER (2019.09.05)
            if (error.response.status === 504) {
                console.log('--------------- ERROR 4');
                // return Promise.reject(null);
                return Promise.reject(error.response.data.message);

            } else {
                console.log('--------------- ERROR 5');
                NavigationService.navigateReset('Login', {alert: {
                    title: strings('dialog.title'),
                    message: strings('dl.dialog.error_connection'),
                }});

                GlobalVariable.isLoged = false;
                return Promise.reject(null);

                // Alert.alert(
                //     strings('dialog.title'),
                //     strings('dl.dialog.error_connection'),
                // );
                // return Promise.reject(null);
            }
        }

         //----------> NEW FIX TIMEOUT (2019.10.16)
        if (error && error.message === "timeout of 30000ms exceeded") {
            console.log('--------------- ERROR 6');
            NavigationService.navigateReset('Home', {alert: {
                title: strings('dialog.title'),
                message: strings('dl.dialog.can_not_connect'),
            }});
            return Promise.reject(null);
        }

        //return Promise.reject(null);
        return Promise.reject(error);
    }
);

export default myNetwork;


// Dung de download hinh anh
const kongOnlyNetwork = axios.create({});

kongOnlyNetwork.interceptors.request.use(async config => {
    // Tinh toan thoi gian het kong token
    const curDate = new Date();
    const diffTime = (curDate - GlobalVariable.kong_time);
    const minutes = Math.floor(diffTime / 60) / 1000;

    // Refresh kong neu time lon hon thoi gian cho phep
    if (minutes > KONG_REFRESH)
    {
        const kongToken = await axios.get(URL_KONG_GET_TOKEN, {
            headers: {
                Authorization: KONG_AUTH
            }
        })

        GlobalVariable.kong_token = kongToken.data;
        GlobalVariable.kong_time = new Date();
    }

    config.timeout = 30000; //30s
    config.headers = {
        ...config.headers,
        Authorization: 'Bearer ' + GlobalVariable.kong_token
    }

    return config;
}, function(error) {
    return Promise.reject(error);
}); 

export {kongOnlyNetwork};