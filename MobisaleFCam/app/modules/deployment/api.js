// LIB CUSTOM
import myNetwork from '../../config/network';

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
            callback(false, null, {Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
    });
}

/**
 * API get deploy detail
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
export function getDeployDetail(myData, callback) {

    myNetwork.post(
        'Deployment/GetDeploymentReturnDetail',
        {
            SupID: myData
        },
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
 * API Transfer & cancel deploy
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
export function DeploymentReturnUpdate(myData, callback) {
    myNetwork.post(
        'Deployment/DeploymentReturnUpdate',
        myData
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
