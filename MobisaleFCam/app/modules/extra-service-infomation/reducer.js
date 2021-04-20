import * as t from "./actionTypes";
import { RegistrationObj } from "../sale-new/entities";
import data_inu from './helpers/data-inu.json';
import data_inu_step_2 from './helpers/data-inu-step-2.json';

let initialState = {
	isStep: true,
	isStepFDone: false,
	isStepSDone: false,
	isStepTDone: false,
	isScreen: "ciInfoExtra",
	// route được gọi khi bấm nút back ở màn hình ExtraServiceCTDetail
	backScreenDetail: "ContractListExtraService",
	formData: RegistrationObj,

	// bookport
	objBookport : {
		region:					null,	// toa do hien tai tren ban do
		regionAddress:			null,	// toa do theo dia chi
		regionGps:				null,	// toa do theo gps,
		regionDrag:				null,	// Toa do khi keo map
		regionGetPointGroup:	null,	// toa do lay tap diem
		regionBookport:			null,	// toa do de bookport
		marker:					null,	// toa do cua marker
		pointGroup:				null,	// danh sach tap diem
		infoPointGroup:			null,	// thong tin port dang chon
		networkType:			2,		// loai ha tang FTTH-2 or ADSL-1
		typeBookport:			1,		// loai bookport, 1: auto | 0: manual
		allowBookport:			1,		// cho phep bookport,
		isMapReady:				false
	},
};

const extraServiceInfoReducer = (state = initialState, action) => {
	switch (action.type) {
		case t.STEP_F_DONE:
			state = {
				...state,
				isStep: false,
				isStepFDone: true,
				isStepSDone: false,
				isStepTDone: false,
				isScreen: action.isScreen
			};
			break;

		case t.STEP_S_DONE:
			state = {
				...state,
				isStep: false,
				isStepFDone: true,
				isStepSDone: true,
				isStepTDone: false,
				isScreen: action.isScreen
			};
			break;

		case t.STEP_T_DONE:
			state = initialState;
			break;

		case t.SUBMIT_STEP_LAST:
			state = initialState;
			break;

		case t.BACK_STEP:
			state = initialState;
			break;

		// v2.4 tuan anh
		case t.RESET_NAVIGATION_DATA: 
			state = {
				...state,
				isStep: true,
				isStepFDone: false,
				isStepSDone: false,
				isStepTDone: false,
				isScreen: "ciInfoExtra"
			};
			break;
		
		case t.UPDATE_BACK_SCREEN_DETAIL: 
			state = {
				...state,
				backScreenDetail: action.payload
			};
			break

		case t.UPDATE_INFO_REGISTRATION:
			state = {
				...state,
				formData: {
					...state.formData,
					...action.payload
				}
			};
			break

		// v2.7 thuandd3
		// day thong tin da co tu man hinh chi tiet TTKH vao registation (edit port)
		case t.RESET_DATA_BOOKPORT:
			state = {
				...state,
				objBookport: {
					...initialState.objBookport
				}
			};
			break;
			
		case t.PUSH_DATA_INFO_REGISTRATION:
			state = {
				...state,
				formData: action.data,
				objBookport: {
					...initialState.objBookport,
					networkType: action.data.Kind
				}
			};
			break;
		
		case t.IS_MAP_READY:
			state = {
				...state,
				objBookport : {
					...state.objBookport,
					isMapReady:true
				},
			};
			break;

		case t.RESET_ALL_DATA_BOOKPORT:
			state = initialState;
			break;

		case t.SAVE_INSTALL_ADDRESS:
			state = {
				...state,
				formData: {
					...state.formData,
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
				},
			};
			break;

		case t.SAVE_LAT_LNG_DEVICED:
			state = {
				...state,
				formData: {
					...state.formData,
					LatlngDevice: action.data,
				},
			};
			break;

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
				formData: {
					...state.formData,
					ContractTemp: ""
				},
			};
			break;

		default:
			return state;
	}
	
	return state;
};

export default extraServiceInfoReducer;
