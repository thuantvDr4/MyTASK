import * as t from './actionTypes';
import { RegistrationObj } from './entities';

import { RegistrationObj as OpenSafeObj } from '../openSafe-info/entities';
/**
 * {Address: "34a St.71BT, Sangkat Stueng Mean Chey, Khan Mean Chey, Phnom Penh", AppointmentDate: null, AppointmentDept: null, Approved: 0, ApprovedName: "Not yet Approve", BillTo_City: "Phnom Penh", BillTo_District: "Khan Mean Chey", BillTo_Number: "34a", BillTo_Street: "St.71BT", BillTo_Ward: "Sangkat Stueng Mean Chey", Birthday: "05/26/1979", BookportIdentityId: "c7dcb83c-416f-40e3-856f-f4f36a17ffa3", BuildingId: 0, ConnectionFee: 15, Contact1: "da", Contact2: "", Contract: "", ContractTemp: "PPKP880692", CusTypeDetail: 12, CusTypeDetailName: "Personal", DepositFee: 30, DeviceTotal: 110, DistrictId: 52, Email: "", Fax: "", FullAddress: "34a St.71BT, Sangkat Stueng Mean Chey, Khan Mean Chey, Phnom Penh", FullName: "olaD", GroupPoints: "PPH5011.0230/GM", ImageInfo: "", ImageSignature: "", ImageSurvey: "", InDType: 0, Indoor: 5, InternetTotal: 330, IsUpdateImage: 0, Kind: 2, Latlng: "11.5409272,104.9022543", LatlngDevice: "37.785834,-122.406417", ListDevice: [{Value: "392_0_1_110", Name: "UniFiApAcPro - 110$", Number: 1, Price: 110, TotalPrice: 110}], ListGift: [{Code: 1, Name: "Helmet"}], ListServiceType: [{Id: 1, Name: "Internet"},{Id: 2, Name: "Equipment"}], ListStaticIP: [], LocalType: 113, LocalTypeName: "FTTH - B25 - Flat", LocationId: 1000, MonthOfPrepaid: 7, Nationality: "CAM", NationalityName: "Cambodian", NoteAddress: "", ODCCableType: "PPH5011.0230/GM-9/9-G", ObjCreateDate: "01/01/0001", ObjId: 0, OutDType: 0, OutDoor: 16, PaidStatus: 0, PaidStatusName: "Not yet Paid", Passport: "dasda", PaymentMethod: 1, PaymentMethodName: "Cash Payment", PaymentMethodPerMonth: 1, PaymentMethodPerMonthName: "At Office", Phone1: "423423", Phone2: "432", PromotionDescription: "Prepaid 7M, Offer 0 USD/M - 5M first, Offer 66 USD/M - 2M next", PromotionId: 3082, PromotionName: "330.00 - Prepaid 7M", RegCode: "ZPPFI22122", RegId: 583273, RegStatus: "Customer Info", RegType: 1, RegTypeName: "Bán mới", Representive: "", SaleId: 27682, StreetId: 9662, TaxCode: "", Total: 485, TypeHouse: 1, UpdateReceiptDate: "01/01/0001", UpdateReceiptStatus: 0, VAT: 0, WardId: 642}
 */

let initialState = {
    //dia chi lap dat
    RegistrationObj: RegistrationObj,
    //
    openSafeObj: OpenSafeObj,
    //

    //bookport
    objBookport : {
        region: null, // toa do hien tai tren ban do
        regionAddress : null, // toa do theo dia chi
        regionGps:null, // toa do theo gps,
        regionDrag:null, // Toa do khi keo map
        regionGetPointGroup : null,// toa do lay tap diem
        regionBookport : null, // toa do de bookport
        marker:null, // toa do cua marker
        pointGroup: null, // danh sach tap diem
        infoPointGroup:null, //thong tin port dang chon
        networkType:2, // loai ha tang FTTH-2 or ADSL-1
        typeBookport : 1, //loai bookport, 1 : auto, 0: manual
        allowBookport: 1, // cho phep bookport,
        isMapReady : false
    },
};

const saleNewReducer = (state = initialState, action) => {

    switch (action.type) {
        case t.IS_MAP_READY:
            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    isMapReady:true
                },
            };
            break;

        // reset toan bo reducer bookport
        case t.RESET_ALL_DATA_BOOKPORT:
            state = initialState;
            break;

        case t.SAVE_INSTALL_ADDRESS:
            state = {
                ...state,
                RegistrationObj: {
                    ...state.RegistrationObj,
                    LocationId:         action.data.Location.Id || null,
                    BillTo_City:        action.data.Location.Name || "",
                    DistrictId:         action.data.District ? action.data.District.Id : null,
                    BillTo_District:    action.data.District ? action.data.District.Name : "",
                    WardId:             action.data.Ward ? action.data.Ward.Id : null,
                    BillTo_Ward:        action.data.Ward ? action.data.Ward.Name : "",
                    StreetId:           action.data.Street ? action.data.Street.Id : null,
                    BillTo_Street:      action.data.Street ? action.data.Street.Name : "",
                    BillTo_Number:      action.data.BillTo_Number ? action.data.BillTo_Number : "",
                    TypeHouseName:      action.data.HomeType ? action.data.HomeType.Name : "",
                    TypeHouse:          action.data.HomeType ? action.data.HomeType.Id : null,
                    BuildingName :      action.data.Building ? action.data.Building.Name : "",
                    BuildingId:         action.data.Building ? action.data.Building.Id : null,
                    FullAddress:        action.data.FullAddress,
                    Address:            action.data.FullAddress,
                    Email:              action.data.Email ? action.data.Email : "",
                    FullName:           action.data.FullName ? action.data.FullName : "",
                    Phone1:             action.data.Phone1 ? action.data.Phone1 : "",
                    PotentialObjID:     action.data.PotentialObjID ? action.data.PotentialObjID : null,
                    Telegram:           action.data.Telegram ? action.data.Telegram : "",
                },
                //

                openSafeObj: {
                    ...state.openSafeObj,
                    LocationId:         action.data.Location.Id || null,
                    BillTo_City:        action.data.Location.Name || "",
                    DistrictId:         action.data.District ? action.data.District.Id : null,
                    BillTo_District:    action.data.District ? action.data.District.Name : "",
                    WardId:             action.data.Ward ? action.data.Ward.Id : null,
                    BillTo_Ward:        action.data.Ward ? action.data.Ward.Name : "",
                    StreetId:           action.data.Street ? action.data.Street.Id : null,
                    BillTo_Street:      action.data.Street ? action.data.Street.Name : "",
                    BillTo_Number:      action.data.BillTo_Number ? action.data.BillTo_Number : "",
                    TypeHouseName:      action.data.HomeType ? action.data.HomeType.Name : "",
                    TypeHouse:          action.data.HomeType ? action.data.HomeType.Id : null,
                    BuildingName :      action.data.Building ? action.data.Building.Name : "",
                    BuildingId:         action.data.Building ? action.data.Building.Id : null,
                    FullAddress:        action.data.FullAddress,
                    Address:            action.data.FullAddress,

                },

            };
            break;

        case t.SAVE_INSTALL_ADDRESS_OPENSAFE:
            state = {
                ...state,
                openSafeObj: {
                    ...action.data,
                    LocationId:         action.data.Location.Id || null,
                    BillTo_City:        action.data.Location.Name || "",
                    DistrictId:         action.data.District ? action.data.District.Id : null,
                    BillTo_District:    action.data.District ? action.data.District.Name : "",
                    WardId:             action.data.Ward ? action.data.Ward.Id : null,
                    BillTo_Ward:        action.data.Ward ? action.data.Ward.Name : "",
                    StreetId:           action.data.Street ? action.data.Street.Id : null,
                    BillTo_Street:      action.data.Street ? action.data.Street.Name : "",
                    BillTo_Number:      action.data.BillTo_Number ? action.data.BillTo_Number : "",
                    TypeHouseName:      action.data.HomeType ? action.data.HomeType.Name : "",
                    TypeHouse:          action.data.HomeType ? action.data.HomeType.Id : null,
                    BuildingName :      action.data.Building ? action.data.Building.Name : "",
                    BuildingId:         action.data.Building ? action.data.Building.Id : null,
                    FullAddress:        action.data.FullAddress,
                    Address:            action.data.FullAddress,
                },

            };
            break;

        case t.SAVE_LAT_LNG_DEVICED:
            state = {
                ...state,
                RegistrationObj: {
                    ...state.RegistrationObj,
                    LatlngDevice: action.data,
                },
            };
            break;

        // cập nhật thong tin Registation
        case t.UPDATE_INFO_REGISTRATION:
            state = {
                ...state,
                RegistrationObj: {
                    ...state.RegistrationObj,
                    ...action.data
                },
            };
            break;

        // cập nhật thong tin openSafe-Registation
        case t.UPDATE_OPENSAFE_REGISTRATION:
            state = {
                ...state,
                openSafeObj: {
                    ...state.openSafeObj,
                    ...action.data
                },
            };
            break;


        // 2.10 : day thong tin da co tu man hinh chi tiet TTKH vao registation -
        case t.PUSH_DATA_INFO_OPENSAFE_REGISTRATION:
            state = {
                ...state,
                openSafeObj: action.data,
            };
            break;


        // day thong tin da co tu man hinh chi tiet TTKH vao registation - port map
        case t.PUSH_DATA_INFO_REGISTRATION:
            state = {
                ...state,
                RegistrationObj: action.data,
                objBookport: {
                    ...initialState.objBookport,
                    networkType: action.data.Kind
                }
            };
            break;
        /*
            END dia chi lap dat
         */

        /*
            START BOOKPORT
         */
        case t.LOAD_MAP:

            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    region:action.data.region,
                    regionBookport : action.data.region,
                    regionGetPointGroup : action.data.region,
                    marker:action.data.region,
                    regionAddress : action.data.regionAddress ? action.data.regionAddress : null,
                    regionGps: action.data.regionGps ? action.data.regionGps : null
                },
            };
            break

        case t.DRAG_MAP:
            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    region:action.data,
                    regionDrag:action.data,
                    regionGetPointGroup : action.data,
                },
            };
            break;

        case t.SHOW_POINT_GROUP:
            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    pointGroup:action.data,
                }
            };
            break;

        case t.CLEAR_DATA_MAP:
            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    marker:null,
                    region:null,
                    pointGroup:null,
                    regionDrag:null
                }
            };
            break;

        case t.CHANGE_POINT_GROUP:
            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    infoPointGroup:action.data,
                }
            };
            break;

        case t.CHANGE_NETWORK_TYPE:
            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    networkType:action.data,
                    pointGroup:null,
                    infoPointGroup : null
                }
            };
            break;

        case t.CHANGE_TYPE_BOOK_PORT:
            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    typeBookport : action.data.typeBookport,
                    allowBookport: action.data.allowBookport
                }
            };
            break;

        case t.REGION_BOOK_PORT:
            state = {
                ...state,
                objBookport : {
                    ...state.objBookport,
                    regionBookport : action.data,
                }
            };
            break;


        case t.CLEAR_CONTRACT_TEMP:
            state = {
                ...state,
                RegistrationObj: {
                    ...state.RegistrationObj,
                    ContractTemp: ""
                },
            };
            break;
    }
    return state;
};

export default saleNewReducer;
