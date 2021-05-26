import React from 'react';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import {
    Animated, Easing, Platform
} from 'react-native'

// SCREEN

import Splash from '../modules/splash/scenes/Splash';
import Upgrade from '../modules/splash/scenes/Upgrade';
import Login from '../modules/auth/scenes/Login';
import ImeiScreen from '../modules/auth/scenes/ImeiScreen';
import DetailCustomersInfo from '../modules/list-customer-info/scenes/DetailCustomersInfo';

// NAVIGATION
import CustomerInfoNavigation from '../modules/customer-info/navigations/CustomerInfoNavigation';
import ListCustomerInfoNavigation from '../modules/list-customer-info/navigations/ListCustomerInfoNavigation';
import UploadImageCusNavigation from '../modules/list-customer-info/navigations/UploadImageCusNavigation';
import HomeNavigation from '../modules/home/navigations/HomeNavigation';
import ContractNavigation from '../modules/contract/navigations/ContractNavigation';
import SaleNewNavigation from '../modules/sale-new/navigations/SaleNewNavigation';


// COMPONENT
import SearchPickerDynamic from '../libs/components/SearchPickerDynamic';
import SearchPickerCLKM from '../libs/components/SearchPickerCLKM';
import SearchMultiPickerDynamic from '../libs/components/SearchMultiPickerDynamic';
import PotentialCustomerNavigation from '../modules/potential-customer/navigations/PotentialCustomerNavigation';
import SearchSinglePickerDynamic from '../libs/components/SearchSinglePickerDynamic';

// v2 - 2019
import ContractListNavigation from '../modules/contract-list/navigations/ContractListNavigation';
import PrechecklistNavigation from '../modules/precheck-list/navigations/PrechecklistNavigation';
import HideBottomTabReportNavigation from'../modules/report/navigations/HideBottomTabReportNavigation';
import DetailAvatar from'../modules/home/scenes/DetailAvatar';

// v2.1 - 2019 June
import DeploymentNavigation from '../modules/deployment/navigations/DeploymentNavigation';
import Settings from '../modules/home/scenes/Settings';

// v2.2 - 2019 July
import NotificationList from '../modules/home/scenes/NotificationList';

// v2.4 - 2020
import ExtraServiceNavigation from '../modules/extra-service/navigations/ExtraServiceNavigation';
import CustomerInfoExtraNavigation from '../modules/extra-service-infomation/navigations/ExtraServiceInfoNavigation';
import ExSerBookNavigation from '../modules/extra-service-bookport/navigations/ExSerBookNavigation';

// V2.10
import OpenSafeInfo_nav from '../modules/openSafe-info/navigations/openSafe-nav';
import OpenSafeService_nav from '../modules/openSafe-service/navigations/openSafeService-nav';


const AppNavigator = createStackNavigator(
    {
        Splash: {
            screen: Splash
        },
        Upgrade: {
            screen: Upgrade
        },
        Login: {
            screen: Login
        },
        Imei: {
            screen: ImeiScreen
        },
        Home: {
            screen: HomeNavigation,
            navigationOptions: ({navigation}) => ({
                header: null,
            })
        },
        Settings: {
            screen: Settings
        },
        NotificationList: {
            screen: NotificationList
        },
        SaleNew: {
            screen: SaleNewNavigation,
            navigationOptions: ({navigation}) => ({
                header: null,
            })
        },
        OpenSafe_Info: {
            screen: OpenSafeInfo_nav,
            navigationOptions: {
                header: null,
            }
        },

        OpenSafe_service: {
            screen: OpenSafeService_nav,
            navigationOptions: {
                header: null,
            }
        },


        CustomerInfo: {
            screen: CustomerInfoNavigation,
            navigationOptions: {
                header: null,
            }
        },
        ListCustomerInfo: {
            screen: ListCustomerInfoNavigation,
            navigationOptions: {
                header: null,
            }
        },
        CustomerInfoExtra: {
            screen: CustomerInfoExtraNavigation,
            navigationOptions: {
                header: null,
            }
        },
        SearchPickerDynamic: {
            screen: SearchPickerDynamic
        },
        SearchPickerCLKM: {
            screen: SearchPickerCLKM
        },
        SearchMultiPickerDynamic: {
            screen: SearchMultiPickerDynamic
        },
        SearchSinglePickerDynamic: {
            screen: SearchSinglePickerDynamic
        },

        vund : {
            screen : DetailCustomersInfo,
            navigationOptions: {
                header: null,
            }
        },
        DetailAvatar: {
            screen: DetailAvatar
        },
        ExSerBookport : {
            screen : ExSerBookNavigation,
            navigationOptions: {
                header: null,
            }
        },
        ...UploadImageCusNavigation,
        ...ContractNavigation,
        ...PotentialCustomerNavigation,
        ...HideBottomTabReportNavigation,
        ...ContractListNavigation,
        ...PrechecklistNavigation,
        ...DeploymentNavigation,
        ...ExtraServiceNavigation,
    },
    {
    initialRouteName: 'Splash',
        mode: Platform.OS === "ios" ? "modal" : "card",
        // transitionConfig: TransitionConfiguration,
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#0B76FF',
                borderBottomWidth: 0,
                shadowRadius: 0,
                shadowOffset: {
                    height: 0,
                },
                shadowColor: 'transparent',
                elevation: 0
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
                fontSize    :20,
                fontWeight: 'bold',
                textAlign: 'center',
                flexGrow: 1
            },
            headerBackTitle: null,
        }
    },
);


// ANIMATION (NOT WORK)
let CollapseExpand = (index, position) => {
    const inputRange = [index - 1, index, index + 1];
    const opacity = position.interpolate({
        inputRange,
        outputRange: [0, 1, 1],
    });

    const scaleY = position.interpolate({
        inputRange,
        outputRange: ([0, 1, 1]),
    });

    return {
        opacity,
        transform: [
            { scaleY }
        ]
    };
};

let SlideFromRight = (index, position, width) => {
    const inputRange = [index - 1, index, index + 1];
    const translateX = position.interpolate({
        inputRange: [index - 1, index, index + 1],
        outputRange: [width, 0, 0]
    })
    const slideFromRight = { transform: [{ translateX }] }
    return slideFromRight
};

const TransitionConfiguration = () => {
    return {
        transitionSpec: {
            duration: 750,
            easing: Easing.out(Easing.poly(4)),
            timing: Animated.timing,
            useNativeDriver: true,
        },
        screenInterpolator: (sceneProps) => {
            const { layout, position, scene } = sceneProps;
            const width = layout.initWidth;
            const { index, route } = scene
            const params = route.params || {}; // <- That's new
            const transition = params.transition || 'default'; // <- That's new

            return {
                collapseExpand: CollapseExpand(index, position),
                default: SlideFromRight(index, position, width),
            }[transition];
        },
    }
}

export default createAppContainer(AppNavigator);
