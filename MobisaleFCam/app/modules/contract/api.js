import myNetwork from '../../config/network';
import GlobalVariable from '../../config/globalVariable';
import {mapPromotionList, mapDeviceList, mapFeeList} from 'app-libs/helpers/mapPicker';
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';

/**
 * Xu ly load danh sach loai dich vu (Internet, thiet bi)
 * 
 * @param function callback 
 */
export function loadServiceType(callback, options)
{
    const {Username} = options.params;

    myNetwork.post(
        '/Data/GetServiceTypeList',
        {username: Username}
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
 * Xu ly load VAT
 * 
 * @param function callback 
 */
export function getVatList(callback)
{
    myNetwork.post(
        'Data/GetVatList',
        {}
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
 * Xu ly load Tien dat coc
 * 
 * @param function callback 
 */
export function getDepositList(callback, options)
{
    const {LocationId} = options.params;
    myNetwork.post(
        'Data/GetDepositList',
        {LocationId: LocationId}
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
 * Tinh tong tien thiet bi -> khong dung
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


/**
 * Lay chi tiet phieu dang ky
 * 
 * @param function callback 
 */
export function getRegistrationDetail(data, callback)
{
    const {RegID, RegCode} = data;
    
    myNetwork.post(
        '/Registration/GetRegistrationDetail',
        {
            RegID: RegID,
            RegCode: RegCode
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data[0]);
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
 * Lay html hop dong mau
 * 
 * @param function callback 
 */
export function getHtmlContractPattern(data, callback)
{
    const {RegID, RegCode} = data;
    
    myNetwork.post(
        '/Registration/GetHtmlObject',
        {
            RegID: RegID,
            RegCode: RegCode
        }
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data);
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
 * Tao hop dong
 * 
 * @param function callback 
 */
export function createObject(data, callback)
{    
    myNetwork.post(
        '/Registration/CreateObject',
        data
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data[0]);
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
 * Lay chi tiet hop dong
 * 
 * @param function callback 
 */
export function getContractDetail(data, callback)
{
    const {ObjID, Contract} = data;

    myNetwork.post(
        '/Registration/GetContractDetail',
        {
            ObjID: ObjID,
            Contract: Contract
        }
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
 * Thanh toan hop dong
 * 
 * @param function callback 
 */
export function updatePayment(data, callback)
{
    console.log(data);
    myNetwork.post(
        '/Registration/UpdatePayment',
        data
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            callback(true, response.Data[0]);
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
 * Upload chu ky
 * 
 * @param function callback 
 */
export function uploadSignuature(data, callback)
{
    const imgInfo = data.image.split("/");
    const formData = new FormData();
    formData.append('LinkId', data.RegID);
    formData.append('Source', GlobalVariable.UPLOAD_SOURCE);
    formData.append('Type', GlobalVariable.UPLOAD_TYPE_CONTRACT);

    // UPDATE 05-12-18 --- API Token mới ko có input này
    // formData.append('Token', GlobalVariable.UPLOAD_IMAGE_TOKEN);
    // formData.append('SaleName', data.Username);

    formData.append('images', {
        uri: data.image,
        type: 'image/png', // or photo.type
        name: imgInfo.pop()
    });

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
        if (response.Code === 0) {
            callback(true, response.Data[0], null);
        }
        else {
            callback(false, null, {message: response.Description});
        }
    })
    .catch(error => {
        if (error === null) return;

        callback(false, null, {message: error.toString()});
    });
}


/**
 * Lay thong tin phieu ttkh de cap nhat
 * 
 * @param function callback 
 */
export function getRegistrationById(data, callback)
{
    const {RegID, RegCode} = data;

    myNetwork.post(
        '/Registration/GetRegistrationByID',
        {
            RegID: RegID,
            RegCode: RegCode
        }
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
        if (error === null) return;

        callback(false, null, {message: error.toString()});
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
        if (error === null) return;

        callback(false, null, {message: error.toString()});
    });
}


/**
 * Cap nhat tong tien
 * 
 * @param function callback 
 */
export function updateRegistrationTotal(data, callback)
{    
    myNetwork.post(
        '/Registration/UpdateRegistrationTotal',
        data
    )
    .then(response => response.data)
    .then(response => {
        if (response.Code === 1) {
            callback(true, response.Data[0]);
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
 * Lay Link download file PDF
 * 
 * @param function callback 
 */
export function getDownloadPDFLink(ObjId, callback)
{
    myNetwork.post(
        '/Registration/GetContractPDF',
        {
            ObjId: ObjId
        }
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
        if (error === null) return;

        callback(false, null, {message: error.toString()});
    });
}


/**
 * Lay Link download file PDF
 * 
 * @param function callback 
 */
// export function downloadFile(data, callback)
// {
//     const {urlDownload, dataSystemApiToken, RegId, Contract} = data;
//     const dirs = RNFetchBlob.fs.dirs;
//     const filePath = `${dirs.DownloadDir}/${Contract}.pdf`;
//     const iosPath = `${dirs.DocumentDir}/${Contract}.pdf`;

//     RNFetchBlob.config({
//         path: iosPath,
//         appendExt: 'pdf',
//         addAndroidDownloads : {
//             useDownloadManager : true, // <-- this is the only thing required
//             // Optional, override notification setting (default to true)
//             notification : true,
//             // Optional, but recommended since android DownloadManager will fail when
//             // the url does not contains a file extension, by default the mime type will be text/plain
//             path: filePath,
//             mime : 'application/pdf',
//             description : `Download contract file "${Contract}"`
//         }
//     })
//     .fetch('GET', urlDownload, {
//         'Authorization' : 'Bearer ' + GlobalVariable.kong_token,
//         'SystemApiToken' : 'Bearer ' + dataSystemApiToken,
//         'Content-Type' : 'application/json'
//         }, JSON.stringify({
//             RegId : RegId
//         })
//     )
//     .then((resp) => {
//         // the path of downloaded file
//         callback(true, resp.path());
//     }).catch((err) => {
//         // scan file error
//         console.log(err);
//         callback(false, null, {message: err.toString()});
//         //callback(false, null, {message: iosPath});
//     });
// }


/**
 * 
 * 
 * @param function callback 
 */
export function downloadFile(data, callback)
{
    const {urlDownload, dataSystemApiToken, RegId, Contract} = data;
    const dirs = RNFetchBlob.fs.dirs;
    const filePath = `${dirs.DownloadDir}/${Contract}.pdf`;
    const iosPath = `${dirs.DocumentDir}/${Contract}.pdf`;

    RNFetchBlob.config({
        path: Platform.OS == 'android' ? filePath : iosPath,
        appendExt: 'pdf',
    })
    .fetch('Post', urlDownload, {
        'Authorization' : 'Bearer ' + GlobalVariable.kong_token,
        'SystemApiToken' : 'Bearer ' + dataSystemApiToken,
        'Content-Type' : 'application/json'
        }, JSON.stringify({
            RegId : RegId
        })
    )
    .then((resp) => {
        // the path of downloaded file
        if (Platform.OS == 'android') {
            const android = RNFetchBlob.android;
            android.actionViewIntent(resp.path(), 'application/pdf');
        }
        callback(true, resp.path());

    }).catch((err) => {
        // scan file error
        callback(false, null, {message: err.toString()});
        //callback(false, null, {message: iosPath});
    });
}


/**
 * Lay nang luc trien khai
 * 
 * @param function callback 
 */
export function getAbility4Days(data, callback)
{
    const {DeptID, SubID, AppointmentDate, RegCode} = data;
    
    myNetwork.post(
        '/Deployment/GetAbility4Days',
        {
            RegCode: RegCode,
            PartnerID: DeptID,
            SubID: SubID,
            AppointmentDate: AppointmentDate
        }
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            
            callback(true, response.Data);
            
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
 * Lay timezone
 * 
 * @param function callback 
 */
export function getTimezones(myData, callback)
{
    myNetwork.post(
        '/Deployment/GetTimezone', myData
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            callback(true, response.Data);
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
 * Lay dated
 * 
 * @param function callback 
 */
export function getDated(myData, callback)
{
    myNetwork.post(
        '/Deployment/GetDeployAppointmentDateList', myData
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            callback(true, response.Data);
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
 * Lay to doi
 * 
 * @param function callback 
 */
export function getSubTeam(data, callback)
{
    const { ObjId, UserName, RegCode, RegType } = data;
    
    myNetwork.post(
        '/Deployment/GetSubTeamIDOfContract',
        {
            ObjID: ObjId,
            UserName: UserName,
            RegCode: RegCode,
            RegType: RegType
        }
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            callback(true, response.Data);
        } else {
            callback(false, null, {message: response.Message});
        }
    })
    .catch(error => {
        console.log(error);
        if (error === null) return;
        callback(false, null, {message: error.toString()});
    });
}


/**
 * Tich Hen Trien Khai
 * 
 * @param function callback 
 */
export function createDeployAppo(data, callback)
{
    const {DeptID, SubID, Timezone, AppointmentDate, UserName, RegCode, ObjId} = data;
    
    myNetwork.post(
        '/Deployment/UpdateDeployAppointment',
        {
            DeptID: DeptID,
            SubID:SubID,
            Timezone:Timezone,
            AppointmentDate: AppointmentDate,
            UserName: UserName,
            RegCode: RegCode,
            ObjId: ObjId,
        }
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            callback(true, {message: response.Message, data: response.Data});
        }
        else {
            callback(false, null, {message: response.Message, data: response.Data});
        }
    })
    .catch(error => {
        if (error === null) return;

        callback(false, null, {message: error.toString()});
    });
}


/**
 * Get QR code WING
 * 
 * @param function callback 
 */
export function getPaymentCode(data, callback)
{
    const { Contract } = data;

    myNetwork.post(
        '/Registration/GetPaymentCode', { Contract: Contract }
    )
    .then(response => response.data)
    .then(response => {
        
        if (response.Code === 1) {
            
            callback(true, response.Data[0]);
        }
        else {
            callback(false, null, { message: response.Message, data: response.Data });
        }
    })
    .catch(error => {
        
        if (error === null) return;

        callback(false, null, {message: error.toString()});
    });
}