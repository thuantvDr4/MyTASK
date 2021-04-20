import myNetwork from "../../config/network";
import {mapPromotionList, mapDeviceList, mapFeeList, mapPickerIPList, mapMonthList} from 'app-libs/helpers/mapPicker';

/**
 * Get thông tin hợp đồng để tạo phiếu bán thêm
 * @param {*} myData
 * @param {*} callback
 */
export function getContractDetail(myData, callback) {
	myNetwork
		.post('/RegistrationContract/GetInsideContractDetail', myData)
		.then(response => response.data)
		.then(response => {
			if (response.Code === 1) {
				callback(true, response.Data, null);
			} else {
				callback(false, null, {
					Code: response.Code,
					message: response.Message
				});
			}
		})
		.catch(error => {
			if (error === null) return;
			callback(false, null, { message: error });
		});
}

/**
 * API get Mac thiết bị để thu hồi từ Id hợp đồng
 * @param {*} myData
 * @param {*} callback
 */
export function getMACEquiqment(myData, callback) {
	myNetwork
		.post('/RegistrationContract/GetMACEquipment', myData)
		.then(response => response.data)
		.then(response => {
			if (response.Code === 1) {
				callback(true, response.Data, null);
			} else {
				callback(false, null, {
					Code: response.Code,
					message: response.Message
				});
			}
		})
		.catch(error => {
			if (error === null) return;
			callback(false, null, { message: error });
		});
}

/**
 * API get danh sách thiết bị để bán thêm
 * @param {*} myData
 * @param {*} callback
 */
export function getDeviceUpgradeList(myData, callback) {
	myNetwork
		.post('/RegistrationContract/GetDeviceUpgradeList', myData)
		.then(response => response.data)
		.then(response => {
			if (response.Code === 1) {
				callback(true, response.Data, null);
			} else {
				callback(false, null, {
					Code: response.Code,
					message: response.Message
				});
			}
		})
		.catch(error => {
			if (error === null) return;
			callback(false, null, { message: error });
		});
}

/**
 * API get danh sách thiết bị để bán thêm (manual load when click picker)
 * @param {*} myData
 * @param {*} callback
 */
export function getDeviceUpgradeListManual(callback, myData) {
	myNetwork
		.post('/RegistrationContract/GetDeviceUpgradeList', myData)
		.then(response => response.data)
		.then(response => {
			if (response.Code === 1) {
				callback(response.Data);
			} else {
				callback([]);
			}
		})
		.catch(error => {
			if (error === null) return;
			callback([]);
		});
}

/**
 * API load discountOption
 * @param {*} myData
 * @param {*} callback
 */
export function getDeviceUpgradeDiscountList(myData, callback) {
	myNetwork
		.post('/RegistrationContract/GetDeviceUpgradeDiscountList', myData)
		.then(response => response.data)
		.then(response => {
			if (response.Code === 1) {
				callback(true, response.Data, null);
			} else {
				callback(false, null, {
					Code: response.Code,
					message: response.Message
				});
			}
		})
		.catch(error => {
			if (error === null) return;
			callback(false, null, { message: error });
		});
}

/**
 * API get total amount service
 * @param {*} myData
 * @param {*} callback
 */
export function getRegistrationContractTotal(myData, callback) {
	
	myNetwork
		.post('/RegistrationContract/GetRegistrationContractTotal', myData)
		.then(response => response.data)
		.then(response => {
			if (response.Code === 1) {
				callback(true, response.Data, null);
			} else {
				callback(false, null, {
					Code: response.Code,
					message: response.Message
				});
			}
		})
		.catch(error => {
			if (error === null) return;
			callback(false, null, { message: error });
		});
}

/**
 * API tạo mới/ update phiếu bán thêm
 * @param {*} myData
 * @param {*} callback
 */
export function updateRegistrationContract(myData, callback) {
	
	myNetwork
		.post(myData.url, myData.data)
		.then(response => response.data)
		.then(response => {
			
			if (response.Code === 1) {
				callback(true, response.Data, null);
			} else {
				callback(false, null, {
					Code: response.Code,
					message: response.Message
				});
			}
		})
		.catch(error => {
			if (error === null) return;
			callback(false, null, { message: error });
		});
}

/**
 * API get list Service Bán thêm
 * @param {*} myData
 * @param {*} callback
 */
export function getServiceTypeList(myData, callback) {
	myNetwork
		.post('/Data/GetServiceTypeList', {'RegType': myData})
		.then(response => response.data)
		.then(response => {
			if (response.Code === 1) {
				callback(true, response.Data, null);
			} else {
				callback(false, null, {
					Code: response.Code,
					message: response.Message
				});
			}
		})
		.catch(error => {
			if (error === null) return;
			callback(false, null, { message: error });
		});
}

/**
 * Xu ly load Danh sach IP
 * 
 * @param function callback 
 */
export function loadIPList(callback, options)
{   
    myNetwork.post(
        '/Registration/StaticIP_GetPrices', {}
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(mapPickerIPList(response.Data));
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}

/**
 * Xu ly load Danh sach Month IP
 * 
 * @param function callback 
 */
export function loadMonthList(callback, options)
{   
    myNetwork.post(
        '/Registration/StaticIP_GetMonths', {}
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(mapMonthList(response.Data));
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}

/**
 * Xu ly load danh sach loai dich vu internet (Goi F5, F2, ...)
 * 
 * @param function callback 
 */
export function loadLocalTypeList(callback, options) {

    const { Username, Kind } = options.params;

    myNetwork.post(
        '/Data/GetLocalTypeList',
        { 
            UserName: Username,
            Kind: Kind
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(response.Data);
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}

/**
 * Xu ly load CLKM
 * 
 * @param function callback 
 */
export function loadPromotionList(callback, options) {
	
	const {LocationID, LocalTypeID, Username} = options.params;

    myNetwork.post(
        '/Data/GetPromotionList',
        {
            LocationId: LocationID,
            LocalTypeId: LocalTypeID,
            UserName: Username,
            ConTract: ""
        }
    )
    .then(response => response.data)
    .then(response => {
		
        if (response.Code === 1) {
            callback(mapPromotionList(response.Data));
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}

/**
 * Xu ly load Phi hoa mang
 * 
 * @param function callback 
 */
export function loadConnectionFeeList(callback, options) {

    const {LocationId} = options.params;

    myNetwork.post(
        '/Data/GetConnectionFeeList',
        {
            LocationId: LocationId
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(mapFeeList(response.Data));
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        callback([]);
    });
}

/**
 * Xu ly load Danh sach thiet bi
 * 
 * @param function callback 
 */
export function loadDeviceList(callback, options)
{
	const {LocationId, MonthOfPrepaid, LocalType} = options.params;
	
    myNetwork.post(
        '/Data/GetDeviceList',
        {
            LocationId: LocationId,
            MonthOfPrepaid: MonthOfPrepaid,
            LocalType: LocalType,
            Type: 2, // 1: Ban moi, 2: Ban them
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(mapDeviceList(response.Data));
        }
        else {
            callback([]);
        }
    })
    .catch(error => {
        if (error === null) return;
        callback([]);
    });
}

/**
 * Api chi tiết HD bán thêm
 * @param {*} myData
 * @param {*} callback
 * @version 2.4
 */
// export function loadExtraContractDetail(myData, callback) {
	
// 	const { RegId, RegCode} = myData;

// 	myNetwork.post(
// 		'/RegistrationContract/GetRegistrationContractByID', {
//             RegId: RegId,
//             RegCode: RegCode
//         }
// 	)
// 	.then(response => response.data)
// 	.then(response => {
// 		if (response.Code === 1) {
			
// 			callback(true, response.Data || {});
// 		} else {
// 			callback(false, null, { message: response.Message });
// 		}
// 	})
// 	.catch(error => {
// 		callback(false, null, { message: error });
// 	});
// }


/**
 * API Lay full thong tin dung cho viec update, edit
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
// export function getRegistrationContract_INU_ByID(myData, callback) {
//     myNetwork.post(
//         '/RegistrationContract/GetRegistrationContract_InternetUpgradeByID', myData
//     )
//     .then(response => response.data)
//     .then(response => {
//         if (response.Code === 1) {
//             callback(true, response.Data, null);
//         }
//         else {
//             callback(false, null, {Code: response.Code, message: response.Message});
//         }
//     })
//     .catch(error => {
//         //if (error === null) return;
//         callback(false, null, {message: error});
//     });
// }

/**
 * Tinh tong tien
 * 
 * @param function callback 
 */
export function calcRegistrationContractUpgradeTotal(data, callback)
{
    myNetwork.post(
        '/RegistrationContract/GetRegistrationContractUpgradeTotal',
        data
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data[0] || {});
        }
        else {
            callback(false, null, {message: response.Message});
        }
    })
    .catch(error => {
        //if (error === null) return;

        callback(false, null, {message: error.toString()});
    });
}