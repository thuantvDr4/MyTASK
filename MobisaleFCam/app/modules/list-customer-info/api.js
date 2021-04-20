import myNetwork from "../../config/network";
import GlobalVariable from '../../config/globalVariable';
import RNFetchBlob from 'rn-fetch-blob';


/**
 * Lay loai tim kiem o danh sach TTKH
 * 
 * @param {*} callback 
 */
export function GetRegistrationSearchTypeList(callback) {
    myNetwork.post(
        '/Registration/GetRegistrationSearchTypeList', {}
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
 * API tim kiem va lay danh sach TTKH, hop dong
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
export function GetRegistrationAll(myData, callback) {
    myNetwork.post(
        '/Registration/GetRegistrationAll',
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
 * API lay chi tiet TTKH
 * 
 * @param {*} myData 
 * @param {*} callback 
 */
export function GetRegistrationDetail(myData, callback) {
    myNetwork.post(
        '/Registration/GetRegistrationDetail',
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
        '/Registration/UpdateRegistrationImage',
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