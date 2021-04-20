
import myNetwork from '../../config/network';

/**
 * Xu ly load cac kieu search contract
 * 
 * @param function callback 
 */
export function loadSearchType(myData, callback) {
    myNetwork.post(
        '/Registration/ContractPreCLSearchTypeList',
        myData
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {
            if (error === null) return;
            callback([]);
        });
}

/**
 * Xu ly load data sau khi search
 * 
 * @param function callback 
 */
export function loadSearchDataAll(myData, callback) {
    const { SearchType, SearchContent, SearchLocation } = myData;

    myNetwork.post(
        '/Registration/SearchContractPreCL',
        {
            Agent: SearchType,
            AgentName: SearchContent,
            LocationId: SearchLocation.Id
        }
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            } else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {
            if (error === null) return;
            callback([]);
        });
}

/**
 * Xu ly load cac loai reason
 * 
 * @param function callback 
 */
export function loadReasonList(myData, callback) {
    myNetwork.post(
        'PreCheckList/PreCheckListReasionList',
        myData
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {
            if (error === null) return;
            callback([]);
        });
}


/**
 * Xu ly tao prechecklist
 * 
 * @param function callback 
 */
export function createPrechecklist(data, callback) {
    myNetwork.post(
        '/PreCheckList/CreatePreCheckList',
        data

    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, { message: response.Message, data: response.Data });
            }
            else {
                callback(false, null, { message: response.Message, data: response.Data });
            }
        })
        .catch(error => {
            if (error === null) return;

            callback(false, null, { message: error.toString() });
        });
}


// v2.3

/**
 * Xu ly load cac request
 * 
 * @param function callback 
 */
export function loadRequestList(data, callback) {

    myNetwork.post(
        'Division/DivisionRequest',
        data
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {
            if (error === null) return;
            callback([]);
        });
}


/**
 * Xu ly load cac sub request theo requestID
 * 
 * @param function callback 
 */
export function loadSubRequestList(data, callback) {
    myNetwork.post(
        'Division/DivisionSubRequest',
        data
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {
            if (error === null) return;
            callback([]);
        });
}

/**
 * Xu ly load danh sách các deparment
 * 
 * @param function callback 
 */
export function loadDepartmentList(data, callback) {
    myNetwork.post(
        'Division/DivisionDepartment',
        data
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {

            if (error === null) return;
            callback([]);
        });
}


/**
 * Tạo division
 * 
 * @param function callback 
 */
export function createDivision(data, callback) {
    myNetwork.post(
        'Division/DivisionCreate',
        data
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {

            if (error === null) return;
            callback([]);
        });
}


/**
 * Load division list
 */
export function loadDivisionLists(data, callback) {
    myNetwork.post(
        'Division/DivisionList',
        data
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {

            if (error === null) return;
            callback([]);
        });
}



/**
 * Load danh sách 3 bill gần nhất
 */
export function loadBillHistory(data, callback) {
    myNetwork.post(
        'Registration/GetBills',
        data
    )
        .then(response => response.data)
        .then(response => {
            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {
            if (error === null) return;
            callback([]);
        });
}


/**
* Lấy lịch sử 2 lần thay đổi trạng thái gần nhất
*/
export function loadChangeStatusHistory(data, callback) {
    myNetwork.post(
        'Registration/GetStatusHistory',
        data
    )
        .then(response => response.data)
        .then(response => {

            if (response.Code === 1) {
                callback(true, response.Data, null);
            }
            else {
                callback(false, null, {
                    code: response.Code,
                    message: response.Message
                });
            }
        })
        .catch(error => {

            if (error === null) return;
            callback([]);
        });
}