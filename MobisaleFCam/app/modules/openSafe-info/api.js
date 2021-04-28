import myNetwork from '../../config/network';
import {mapPromotionList, mapDeviceList, mapFeeList, mapPickerIPList, mapMonthList} from 'app-libs/helpers/mapPicker';

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
