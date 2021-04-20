// LIB
import React from 'react';
import { View } from 'react-native';
import { createStackNavigator, createMaterialTopTabNavigator, HeaderBackButton } from 'react-navigation';
import { strings } from 'locales/i18n';
import { connect } from 'react-redux';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import HandleSoftBackButton from '../components/HandleSoffBackButton';

// COMPONENT 
import Tabbar from './Tabbar';
import CustomerInfo from '../scenes/CustomerInfo';
import ServiceType from '../scenes/ServiceType';
import TotalAmount from '../scenes/TotalAmount';

// CONST
const strTitle = strings('customer_info.titleNavigation.new');

const CustomTabStack = createMaterialTopTabNavigator(
    {
        ciInfo: { screen: CustomerInfo },
        ciServiceType: { screen: ServiceType },
        ciAmount: { screen: TotalAmount },
    },
    {
        initialRouteName: 'ciInfo',
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


const CustomerInfoNavigation = createStackNavigator(
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

export default CustomerInfoNavigation;