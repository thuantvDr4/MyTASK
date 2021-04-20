import myNetwork from '../../config/network';

/**
 * Check imei cua thiet bi
 * 
 * @param object data
 * @param function callback 
 */
export function checkIMEI(data, callback)
{
    const {DeviceIMEI, AndroidVersion, ModelNumber} = data;

    myNetwork.post(
        '/User/CheckIMEI',
        {
            DeviceIMEI: DeviceIMEI,
            AndroidVersion: AndroidVersion,
            ModelNumber: ModelNumber
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data[0], null);
        }
        else {
            callback(false, null, {message: response.Message});
        }
    })
    .catch(error => {
        if (error === null) return;
        callback(false, null, {message: error.toString()});
    });
}


/**
 * Check version cua app
 * 
 * @param object data
 * @param function callback 
 */
export function checkVersion(data, callback) {
    const {DeviceIMEI, Platform, CurrentVersion} = data;

    myNetwork.post(
        '/User/GetVersion',
        {
            DeviceIMEI: DeviceIMEI,
            Platform: Platform == 'android' ? 1 : 2,
            CurrentVersion: CurrentVersion
        }
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            callback(true, response.Data[0], null);
        }
        else {
            callback(false, null, {message: response.Message});
        }
    })
    .catch(error => {
        if (error === null) return;
        callback(false, null, {message: error.toString()});
    });
}