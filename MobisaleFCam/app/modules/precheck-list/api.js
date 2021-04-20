import myNetwork from '../../config/network';

/**
 * Xu ly load Precheck list
 * 
 * @param function callback 
 */
export function loadPrechecklist(myData, callback) {
    myNetwork.post(
        '/PreCheckList/PreCheckListList',
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
 * Xu ly load Precheck list Detail
 * 
 * @param function callback 
 */
export function loadPrechecklistDetail(myData, callback)
{
    myNetwork.post(
        '/PreCheckList/PreCheckListDetail',
        {
            IDPreCheckList: myData,
        }
    )
    .then(response => response.data)
    .then(response => {

        if (response.Code === 1) {
            callback(true, response.Data[0], null);
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
 * Xu ly load Status
 * 
 * @param function callback 
 */
export function loadStatusPrechecklist(myData, callback)
{
    myNetwork.post(
        '/PreCheckList/PreCheckListStatus',
        myData
    )
    .then(response => response.data)
    .then(response => {

        if (response.Code === 1) {
            callback(response.Data);
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