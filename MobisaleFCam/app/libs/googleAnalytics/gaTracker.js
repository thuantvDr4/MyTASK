
// COMPONENT
import * as gaConfig from './gaConfigs';
import gaRouteMap from './gaRouteMap';

// LIB
const isEmpty = require('../helpers/isEmpty');

export default gaTracker = (prevState, currentState) => {
    const currentScreen = gaConfig.getActiveRouteName(currentState);
    const prevScreen = gaConfig.getActiveRouteName(prevState);

    if (prevScreen !== currentScreen) {
        const screenName = ( (isEmpty(gaRouteMap) || !gaRouteMap[currentScreen]) ? currentScreen : gaRouteMap[currentScreen] );
        gaConfig.trackScreenView(screenName);
    }
}
