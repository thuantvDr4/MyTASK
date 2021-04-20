import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function navigate(routeName, params)
{
    _navigator.dispatch(
        NavigationActions.navigate({
            routeName,
            params
        })
    );
}

function navigateReset(routeName, params)
{
    const resetAction = StackActions.reset({
        index: 0,
        actions: [
            NavigationActions.navigate({routeName: routeName, params: params})
        ],
        key: null
    });
    _navigator.dispatch(resetAction);
}

function navigateCustomReset(routeName, index = 0)
{
    const resetAction = StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: routeName })],
    });
    _navigator.dispatch(resetAction);
}

function navigateBackHome(routeName, params)
{
    const resetAction = StackActions.reset({
        index: 1,
        actions: [
            NavigationActions.navigate({ routeName: 'Home' }),
            NavigationActions.navigate({ routeName: routeName, params: params })
        ],
        key: null
    });
    _navigator.dispatch(resetAction);
}

function navigateFromNoti(routeName, params)
{
    const resetAction = StackActions.reset({
        index: 1,
        actions: [
            NavigationActions.navigate({ routeName: 'Home' }),
            NavigationActions.navigate({ routeName: routeName, params: params })
        ],
        key: null
    });
    _navigator.dispatch(resetAction);
}

function navigateGoBack()
{
    _navigator.dispatch(
        NavigationActions.back()
    );
}

function navigatePop()
{
    const popAction = StackActions.pop({
        n: 2,
    });

    _navigator.dispatch(popAction);
}

export default {
    navigate,
    navigateReset,
    navigateBackHome,
    setTopLevelNavigator,
    navigateCustomReset,
    navigateGoBack,
    navigateFromNoti,
    navigatePop
}