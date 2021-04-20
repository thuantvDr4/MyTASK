import * as t from "./actionTypes";

export function nextStep(dataTemp) {
	return dispatch => {
		if (dataTemp.step === 1) {
			dispatch({
				type: t.STEP_F_DONE,
				isScreen: !dataTemp.nextScreen ? dataTemp.isScreen : dataTemp.nextScreen
			});
		} else if (dataTemp.step === 2) {
			dispatch({
				type: t.STEP_S_DONE,
				isScreen: !dataTemp.nextScreen ? dataTemp.isScreen : dataTemp.nextScreen
			});
		} else if (dataTemp.step === 3) {
			dispatch({ type: t.STEP_T_DONE });
		} else {
			dispatch({ type: t.BACK_STEP });
		}
	};
}

export function submitCreateTTKH(dataTemp) {
	return dispatch => {
		if (dataTemp.step === 3) {
			dispatch({ type: t.SUBMIT_STEP_LAST });
		}
	};
}

export function resetNavigationData() {
	return dispatch => {
		dispatch({
			type: t.RESET_NAVIGATION_DATA
		});
	};
}

export function updateBackScreenDetail(payload) {
	return dispatch => {
		dispatch({
			type: t.UPDATE_BACK_SCREEN_DETAIL,
			payload
		});
	};
}

/**
 * Dùng cho update phiếu thông tin
 * @param {} data 
 */
export function updateInfoExtraServiceForm(payload, callback) {
	return async dispatch => {
		await dispatch({
			type: t.UPDATE_INFO_REGISTRATION,
			payload
		});

		if (callback) {
			callback();
		}
	};
}

/**
 * Dùng cho update phiếu thông tin từ chi tiết phiếu (bookport lại, cập nhật thông tin)
 * @param {} data 
 */
export function pushDataInfoRegistration_extra(data) {
    return (dispatch) => {
        dispatch({type: t.PUSH_DATA_INFO_REGISTRATION, data: data });
        return Promise.resolve()
    }
}