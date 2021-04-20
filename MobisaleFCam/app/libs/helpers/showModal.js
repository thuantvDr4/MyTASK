export function showModalAction(isShow, content, routeName, params) {
    return (dispatch) => {
        dispatch({ 
            type: 'splash/SHOW_MODAL_ACTION', 
            modalGlobalAction: {
                isShow: isShow, 
                content: content,
                routeName: routeName,
                params: params
            }
        });
    }
}

export function hideModalAction() {
    return (dispatch) => {
        dispatch({ 
            type: 'splash/SHOW_MODAL_ACTION', 
            modalGlobalAction: {
                isShow: false, 
                content: '',
                routeName: '',
                params: null
            }
        });
    }
}

export function showModalWarning(isShow, content) {
    return (dispatch) => {
        dispatch({ 
            type: 'splash/SHOW_MODAL_WARNING', 
            modalGlobalWarning: {
                isShow: isShow, 
                content: content,
            }
        });
    }
}

export function hideModalWarning() {
    return (dispatch) => {
        dispatch({ 
            type: 'splash/SHOW_MODAL_WARNING', 
            modalGlobalWarning: {
                isShow: false, 
                content: '',
            }
        });
    }
}