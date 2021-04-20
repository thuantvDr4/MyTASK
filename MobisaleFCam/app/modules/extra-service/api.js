import myNetwork from "../../config/network";
import GlobalVariable from '../../config/globalVariable';
import RNFetchBlob from 'rn-fetch-blob';

/**
 * get danh sach extra service
 * @param myData
 * @param callback
 */
export function getListExtraService(myData, callback) {
	myNetwork
	.post("/RegistrationContract/GetRegistrationContractAll", myData)
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
		callback(false, null, { message: error });
	});
}

/**
 * Api tìm kiếm hợp đồng để tạo phiếu bán thêm
 * @param {*} myData
 * @param {*} callback
 */
export function loadContractList(myData, callback) {
	myNetwork
	.post("RegistrationContract/RegistrationContractSearchList", myData)
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
		callback(false, null, { message: error });
    });
}

/**
 * Api get các search type màn hình extra service list
 * @param {*} myData
 * @param {*} callback
 */
export function getRegistrationSearchTypeList(myData, callback) {
	myNetwork
    .post("Registration/GetRegistrationSearchTypeList", myData)
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
		callback(false, null, { message: error });
    });
}

/**
 * Api chi tiết HD bán thêm
 * @param {*} myData
 * @param {*} callback
 * @version 2.4
 */
export function loadExtraContractDetail(myData, callback) {
	
	const { RegId, RegCode, svType } = myData;
	const url = svType === 1
			? '/RegistrationContract/GetRegistrationContractByID'						// 1: Bán thêm: Equipment & IP
			: '/RegistrationContract/GetRegistrationContract_InternetUpgradeByID';		// 2: Bán thêm: Internet Upgrade

	myNetwork.post(url, {
            RegId: RegId,
            RegCode: RegCode
        }
	)
	.then(response => response.data)
	.then(response => {

		if (response.Code === 1) {	
			callback(true, response.Data || {});
		} else {
			callback(false, null, { message: response.Message });
		}
	})
	.catch(error => {
		callback(false, null, { message: error });
	});
}

/**
 * Lay phuong thuc thanh toan
 * 
 * @param function callback 
 */
export function getPaymentMethodList(data, callback)
{    
    myNetwork.post(
        '/Data/GetPaymentMethodList',
        data
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
 * Thanh toan hop dong bán thêm
 * 
 * @param function callback 
 */
export function updateContractPayment(data, callback) {
    console.log(data)
    const { ObjID, RegID, PaymentMethod, svType } = data;
	const url = svType === 1
			? '/RegistrationContract/UpdateContractPayment'						// 1: Bán thêm: Equipment & IP
            : '/RegistrationContract/UpdateContractPayment_Upgrade';		    // 2: Bán thêm: Internet Upgrade


    myNetwork.post(url, {
        ObjID: ObjID,
        RegID: RegID,
        PaymentMethod: PaymentMethod
    })
    .then(response => response.data)
    .then(response => {
        console.log(response);
        if (response.Code === 1) {
            callback(true, response.Data[0]);
        }
        else {
            callback(false, null, {message: response.Message});
        }
    })
    .catch(error => {
        console.log(error)
        // if (error === null) return;
        callback(false, null, {message: error.toString()});
    });
}

/**
 * Get System Api Token
 * 
 * @param {*} myData = ""
 * @param {*} callback 
 */
export function getSystemApiToken(myData, callback) {
    myNetwork.post(
        '/User/GetSystemApiToken',
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
        if (error === null) return;
        callback(false, null, {message: error});
    });
}

/**
 * API Lay full thong tin dung cho viec update, edit
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
export function GetRegistrationByID(myData, callback) {
    myNetwork.post(
        '/Registration/GetRegistrationByID',
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
        //if (error === null) return;
        callback(false, null, {message: error});
    });
}

/**
 * Upload image
 * 
 * @param object data {image: {path: "file://", mime: "image/png"}, Source: 123, Username: "DaiDP"}
 * @param function callback 
 */
export function uploadImage(data, callback) {
    
    let imgInfo = data.image.path.split("/");
    const cleanFilePath = data.image.path.replace('file://', '');
    const newFormData = [
        { name : 'LinkId', data: '' + data.RegID },
        { name : 'Source', data: '' + GlobalVariable.UPLOAD_SOURCE },
        { name : 'Type', data : '' + GlobalVariable.UPLOAD_TYPE_TTKH },
        { name: 'images', filename: imgInfo.pop(), type: data.imageType, data: RNFetchBlob.wrap(cleanFilePath), }
    ]
    
    RNFetchBlob.fetch('POST', 
        GlobalVariable.UPLOAD_IMAGE_URL, 
        {
            'Authorization' : 'Bearer ' + GlobalVariable.kong_token,
            'SystemApiToken': 'Bearer ' + data.dataSystemApiToken,
            'Content-Type' : 'multipart/form-data',
        }, newFormData
    )
    .uploadProgress({ interval : 20 }, (written, total) => {
        callback(false, true, {progress: written / total});
    })
    .then(res => {
        const response = res.json();
        if (response.Code === 0 && response.Data) {
            callback(true, response.Data[0], null);
        } else {
            callback(false, null, {message: response.Description});
        }
    })
    .catch(err => {
        // console.log(err);
        // if (error === null) return;
        callback(false, null, {message: err.toString()});
    });
}

/**
 * Cap nhat hinh anh TTKH
 * 
 * @param {*} data 
 * @param {*} callback 
 */
export function updateRegistrationImage(data, callback) {
    const {RegID, RegCode, ImageInfo} = data;

    myNetwork.post(
        '/RegistrationContract/UpdateRegistrationContractUpgradeImage',
        {
            RegID: RegID, 
            RegCode: RegCode,
            ImageInfo: ImageInfo
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
            //if (error === null) return;
            callback(false, null, {message: error});
        });
}

/**
 * Download image TTKH ve bo nho cache va hien thi len
 * 
 * @param {*} idImage 
 * @param {*} callback 
 */
export function downloadImage(idImage, dataSystemApiToken, callback) {

    RNFetchBlob.config({ fileCache : true, appendExt : 'png', })
    .fetch(
        'Post', 
        GlobalVariable.DOWNLOAD_IMAGE_URL, 
        {
            'Authorization' : 'Bearer ' + GlobalVariable.kong_token,
            'SystemApiToken' : 'Bearer ' + dataSystemApiToken,
            'Content-Type' : 'application/json'
        }, 
        JSON.stringify({
            Id : idImage
        })
    )
    .progress({ count : 10 }, (received, total) => {
        // console.log('progress', received / total)
    })
    .then((res) => {
        callback(true, res.path());
    })
    .catch((errorMessage, statusCode) => {
        // error handling
        callback(false, null, {message: err.errorMessage});
    });
}

/**
 * Get QR code WING
 * 
 * @param function callback 
 */
export function getPaymentCode(data, callback){
    const { Contract } = data;

    myNetwork.post(
        '/Registration/GetPaymentCode', { Contract: Contract }
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            console.log(response);
            callback(true, response.Data[0]);

        } else {
            callback(false, null, { message: response.Message, data: response.Data });
        }
    })
    .catch(error => {
        
        if (error === null) return;

        callback(false, null, {message: error.toString()});
    });
}