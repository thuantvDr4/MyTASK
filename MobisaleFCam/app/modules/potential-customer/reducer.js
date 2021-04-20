import * as t from './actionTypes';
import {RegistrationObj} from "../sale-new/entities";

let initialState = {
    isLoading: false,
    isConnected: false,
    region: null,
    regionDrag: null,
    marker:null,
    pointGroup: null,
    addressPointGroup:null,
    RegistrationObj: RegistrationObj
};

const potentialCustomerReducer = (state = initialState, action) => {
    switch (action.type) {
        case t.CHANGE_LOCATION:
            state = {
                ...state,
                RegistrationObj: {
                    ...state.RegistrationObj,
                    LocationId: action.data.value,
                    BillTo_City: action.data.label,
                    DistrictId: null,
                    BillTo_District: "",
                    WardId: null,
                    BillTo_Ward: "",
                    StreetId: null,
                    BillTo_Street: "",
                    TypeHouse: null,
                    BuildingId: null
                }
            };
            break;

        case t.CHANGE_DISTRICT:
            state = {
                ...state,
                RegistrationObj: {
                    ...state.RegistrationObj,
                    DistrictId: action.data.value,
                    BillTo_District: action.data.label,
                    WardId: null,
                    BillTo_Ward: "",
                    StreetId: null,
                    BillTo_Street: "",
                    TypeHouse: null,
                    BuildingId: null
                }
            };
            break;

        case t.CHANGE_WARD:
            state = {
                ...state,
                RegistrationObj: {
                    ...state.RegistrationObj,
                    WardId: action.data.value,
                    BillTo_Ward: action.data.label,
                    StreetId: null,
                    BillTo_Street: "",
                    TypeHouse: null,
                    BuildingId: null
                }
            };
            break;

    }
    return state;
};

export default potentialCustomerReducer;