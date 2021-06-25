// LIB
import React from 'react';
import { View } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator} from 'react-navigation';
import { strings } from 'locales/i18n';
import HandleSoftBackButton from '../components/HandleSoffBackButton';
import Tabbar from './Tabbar';
import openSafe_ciInfo from '../scenes/CustomerInfo';
import openSafe_ciServiceType from '../scenes/ServiceType';
import openSafe_ciAmount from '../scenes/TotalAmount';

// CONST
const strTitle = strings('customer_info.titleNavigation.new');

const CustomTabStack = createMaterialTopTabNavigator(
    {
        openSafe_ciInfo: { screen: openSafe_ciInfo },
        openSafe_ciServiceType: { screen: openSafe_ciServiceType },
        openSafe_ciAmount: { screen: openSafe_ciAmount },
    },
    {
        initialRouteName: 'openSafe_ciInfo', //
        headerMode: 'none',
        mode: 'card',
        cardStyle: {
            shadowColor: 'transparent',
        },
        navigationOptions: {
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
        },
        tabBarComponent: props => <Tabbar {...props}/>,
        tabBarPosition: "top",
        animationEnabled: true,
        swipeEnabled: false
    }
);


const OpenSafeNavigation = createStackNavigator(
    {
        ciMain: {
            screen: CustomTabStack,
            navigationOptions: ({navigation}) => {
                return { title: navigation.getParam('titleNav', strTitle) }
            }
        }
    },
    {
        initialRouteName: 'ciMain',
        defaultNavigationOptions: ({navigation}) => ({
            headerLeft: <HandleSoftBackButton navigation={navigation} />,
            //headerBackTitle: null,
            headerStyle: {
                backgroundColor: '#0B76FF',
                borderBottomWidth: 0,
            },
            headerTintColor: '#FFFFFF',
            headerTitleStyle: {
                fontSize : 20,
                fontWeight: 'bold',
                textAlign: 'center',
                alignSelf: 'center',
                flexGrow: 1
            },
            headerRight: <View/>,
        })
    }
);

export default OpenSafeNavigation;
