import * as t from './actionTypes';
import {RegistrationObj} from '../sale-new/entities';

let initialState = { 
    isStep: true, 
    isStepFDone: false,
    isStepSDone: false,
    isStepTDone: false,
    isScreen: 'ciInfo'
};

const customerInfoReducer = (state = initialState, action) => {
    
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
            return state;

        case t.STEP_S_DONE:
            state = {
                ...state, 
                isStep: false,
                isStepFDone: true,
                isStepSDone: true,
                isStepTDone: false,
                isScreen: action.isScreen
            };
            return state;
        
        case t.STEP_T_DONE:
            return initialState;

        case t.SUBMIT_STEP_LAST:
            return initialState;

        case t.BACK_STEP:
            return initialState;

        default:
            return state;
    }
};


export default customerInfoReducer;