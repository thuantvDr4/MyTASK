export function forceStopLoadingLocal(forceStopLoadingLocal) {
    return (dispatch) => {
        dispatch({ type: 'forceStopLoadingLocal', forceStopLoadingLocal: forceStopLoadingLocal});
    }
}

export function checkLoadingLocal(loadingLocal) {
    return (dispatch) => {
        dispatch({ type: 'checkLoadingLocal', loadingLocal: loadingLocal});
    }
}