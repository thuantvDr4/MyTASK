export default function showLoading(isLoading) {
    return (dispatch) => {
        dispatch({ type: 'showloading', isLoading: isLoading});
    }
}