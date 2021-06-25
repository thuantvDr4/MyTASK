import myNetwork from '../../config/network';

/**
 * API lay data bao cao phat trien thue bao
 *
 * @param {*} myData
 * @param {*} callback
 */
export function reportPTTB(myData, callback) {
    myNetwork.post(
        '/Report/ReportPTTB',
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
 * API lay data báo cáo lương
 *
 * @param {*} data
 * @param {*} callback
 */
export function reportSalary(data, callback) {
    myNetwork.post(
        'Report/ReportSalary',
        data
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null,{Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
    });
}
/**
 * API lay data báo cáo T-
 *
 * @param {*} data
 * @param {*} callback
 */
export function reportTSub(data, callback) {
    myNetwork.post(
        'Report/ReportTSub',
        data
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null,{Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
    });
}
/**
 * API lay data báo cáo T+
 *
 * @param {*} data
 * @param {*} callback
 */
export function reportTBonus(data, callback) {
    myNetwork.post(
        'Report/ReportTAdd',
        data
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data, null);
        }
        else {
            callback(false, null,{Code: response.Code, message: response.Message});
        }
    })
    .catch(error => {
        callback(false, null, {message: error});
    });
}


/**
 * V2.8-thuantv - 07/10/2020
 * API : lay danh sach contract status type
 *
 * @param {*} data
 * @param {*} callback
 */
export function getContractStatusType (data, callback) {
    myNetwork.post(
        '/Data/GetContractStatusTypeList',
        data
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null,{Code: response.Code, message: response.Message});
            }
        })
        .catch(error => {
            callback(false, null, {message: error});
        });
}


/**
 * V2.8-thuantv - 07/10/2020
 * API : lay danh sach contract service type
 *
 * @param {*} data
 * @param {*} callback
 */
export function getContractServiceType (data, callback) {
    myNetwork.post(
        '/Data/GetListMenuPermissions',
        data
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null,{Code: response.Code, message: response.Message});
            }
        })
        .catch(error => {
            callback(false, null, {message: error});
        });
}


/**
 * V2.8-thuantv - 07/10/2020
 * API : lgetReportExtraService
 *
 * @param {*} data
 * @param {*} callback
 */
export function getReportExtraService (data, callback) {
    myNetwork.post(
        '/Report/ReportExtraService',
        data
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null,{Code: response.Code, message: response.Message});
            }
        })
        .catch(error => {
            callback(false, null, {message: error});
        });
}



/**
 * API lay data bao cao phat trien thue bao
 *
 * @param {*} myData
 * @param {*} callback
 */
export function reportOpenSafePTTB(myData, callback) {
    myNetwork.post(
        '/Report/OpenSafeReportPTTB',
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
