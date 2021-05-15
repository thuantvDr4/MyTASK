import myNetwork from '../../config/network';
import {mapPromotionList, mapDeviceList, mapFeeList, mapPickerIPList, mapMonthList} from 'app-libs/helpers/mapPicker';
import GlobalVariable from "../../config/globalVariable";
import RNFetchBlob from "rn-fetch-blob";

/**
 * Xu ly load danh sach loai dich vu (Internet, thiet bi)
 *
 * @param function callback
 */
export function loadServiceType(callback, options)
{
    // RegType : 1 : bán mới, 2 : bán thêm
    const { RegType } = options.params;

    myNetwork.post(
        '/Data/GetServiceTypeList', { RegType: RegType }
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
 * Xu ly load danh sach loai dich vu internet (Goi F5, F2, ...)
 *
 * @param function callback
 */
export function loadLocalTypeList(callback, options)
{
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
export function loadPromotionList(callback, options)
{
    const {LocationID, LocalTypeID, Username} = options.params;

    myNetwork.post(
        '/Data/GetPromotionList',
        {
            LocationId: LocationID,
            LocalTypeID: LocalTypeID,
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
export function loadConnectionFeeList(callback, options)
{
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
 * Xu ly load Phuong thuc thanh toan hang thang
 *
 * @param function callback
 */
export function loadPaymentMethodPerMonthList(callback, options)
{
    const {Username} = options.params;

    myNetwork.post(
        '/Data/GetPaymentMethodPerMonthList',
        {
            username: Username
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
            Type: 1, // 1: Ban moi, 2: Ban them
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
        'Registration/StaticIP_GetMonths', {}
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
 * Xu ly load Danh sach Gift
 *
 * @param function callback
 */
export function loadGiftList(callback, options) {
    myNetwork.post(
        'Registration/Gift_GetList', {}
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
 * Tinh tong tien
 *
 * @param function callback
 */
export function caclRegistrationTotal(data, callback)
{
    myNetwork.post(
        '/Registration/GetRegistrationTotal',
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

/**
 * Tinh tong tien thiet bi (khong su dung)
 *
 * @param function callback
 */
export function calcTotalDevice(LocationID, ListDevice, MonthOfPrepaid, callback)
{
    myNetwork.post(
        '/Data/GetTotalDevice',
        {
            LocationID: LocationID,
            ListDevice: ListDevice,
            MonthOfPrepaid: MonthOfPrepaid,
            Type: 1, // 1: Ban moi, 2: Ban them
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data[0]);
        }
        else {
            callback(false, {
                code: response.Code,
                message: response.Message
            });
        }
    })
    .catch(error => {
        if (error === null) return;
        callback(false, {message: error});
    });
}

// GET API LOAI KHACH HANG
export function GetCustomerType(myData, callback) {
    myNetwork.post(
        'Data/GetCusTypeDetailList',
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

// GET API QUOC TICH
export function GetNationalityList(myData, callback) {
    myNetwork.post(
        'Data/GetNationalityList',
        myData    )
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

// GET API VAT
export function GetVatList(myData, callback) {
    myNetwork.post(
        'Data/GetVatList',
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

// GET API DAT COC
export function GetDepositList(myData, callback) {
    myNetwork.post(
        'Data/GetDepositList',
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

// TẠO THÔNG TIN KHACH HÀNG
export function createInfoCustomer(myData, callback) {
    myNetwork.post(
        'Registration/UpdateRegistration',
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





//=============>2.10- 05/05/2021
/**
 * API lay chi tiet TTKH
 *
 * @param {*} myData
 * @param {*} callback
 */
export function GetRegistrationDetail(myData, callback) {
    myNetwork.post(
        '/RegistrationOpenSafe/GetOSRegistrationByID',
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
 * Upload image
 *
 * @param object data {image: {path: "file://", mime: "image/png"}, Source: 123, Username: "DaiDP"}
 * @param function callback
 */
export function uploadImage(data, callback) {

    // console.log(data);
    // console.log("SystemApiToken: ", data.dataSystemApiToken);
    // console.log(GlobalVariable.UPLOAD_IMAGE_URL);

    /**
     * -------------------------------------------------  UPLOAD: USE RNFetchBlob
     * -------------------------------------------------
     */

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
            //if (error === null) return;
            // console.log(error);
            // alert("Upload error"+ response.Data)
            callback(false, null, {message: err.toString()});
        });


    // var formData = [
    //     {
    //         "LinkId":9321,
    //         "Source":2,
    //         "Type":"3",
    //         "images": {
    //             "name":"530B3959-69C1-4FE0-952E-0D46314F8815.jpg",
    //             "type":"image/jpeg",
    //             "uri":"/Users/red.apple/Library/Developer/CoreSimulator/Devices/A2190C26-0D8D-4045-B2F8-A15B21908568/data/Containers/Data/Application/7E1B8E17-B2A5-4076-87FD-661760A7848E/tmp/react-native-image-crop-picker/530B3959-69C1-4FE0-952E-0D46314F8815.jpg"
    //             }
    //         }
    //     ];

    // console.log(formData);

    /*
    // upload multiple
    for (i in data.image)
    {
        let imgInfo = data.image[i].path.split("/");

        formData.append('images', {
            uri: data.image[i].path,
            type: data.image[i].mime,
            name: imgInfo.pop()
        });
    }*/


    /**
     * ------------------------------------------------- UPLOAD: USE Axios
     * -------------------------------------------------
     */

    /**
     const imgInfo = data.image.path.split("/");
     const formData = new FormData();

     formData.append('LinkId', data.RegID);
     formData.append('Source', GlobalVariable.UPLOAD_SOURCE);
     formData.append('Type', GlobalVariable.UPLOAD_TYPE_TTKH);
     formData.append('images', {
            uri: data.image.uri,
            type: data.imageType,
            name: imgInfo.pop()
        });

     // UPDATE 05-12-18 --- API Token mới ko có input này
     // formData.append('Token', GlobalVariable.UPLOAD_IMAGE_TOKEN);
     // formData.append('SaleName', data.Username);

     myNetwork.post(
     GlobalVariable.UPLOAD_IMAGE_URL,
     formData,
     {
                baseURL: '',
                headers: {
                    'SystemApiToken': 'Bearer ' + data.dataSystemApiToken
                },
            }
     )
     .then(response => response.data)
     .then(response => {

            if (response.Code === 0 && response.Data) {
                callback(true, response.Data[0], null);
            } else {
                callback(false, null, {message: response.Description});
            }
        })
     .catch(error => {
            //if (error === null) return;
            // console.log(error);
            // alert("Upload error"+ response.Data)
            callback(false, null, {message: error.toString()});
        });
     */

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
 * Cap nhat hinh anh TTKH
 *
 * @param {*} data
 * @param {*} callback
 */
export function updateRegistrationImage(data, callback) {
    const {RegID, RegCode, ImageInfo} = data;

    myNetwork.post(
        '/RegistrationOpenSafe/UpdateOSRegistrationImage',
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
