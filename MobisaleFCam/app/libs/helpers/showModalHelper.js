export function forceStopModalLocal(forceStopModalLocalStatus) {
    return (dispatch) => {
        dispatch({ type: 'forceStopModalLocal', forceStopModalLocalStatus: forceStopModalLocalStatus});
    }
}

export function checkModalLocal(modalLocal) {
    return (dispatch) => {
        dispatch({ type: 'checkModalLocal', modalLocal: modalLocal});
    }
}