// LIB
import firebase from 'react-native-firebase';

// CONST
const analytics = firebase.analytics();

export function trackScreenView(screenName){
    // console.log('Tracking: ', screenName);
    analytics.setCurrentScreen(screenName, screenName);
};

// Gets the current screen from navigation state
export function getActiveRouteName(navigationState) {
    if (!navigationState) { return null; }

    const route = navigationState.routes[navigationState.index];

    // dive into nested navigators
    if (route.routes) { return getActiveRouteName(route); }
    return route.routeName;
}

