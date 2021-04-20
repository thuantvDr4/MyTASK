import {createStackNavigator, HeaderBackButton} from 'react-navigation';
import React  from 'react';
import {View} from 'react-native';
import ListCustomersInfo from '../scenes/ListCustomersInfo';
import DetailCustomersInfo from '../scenes/DetailCustomersInfo';

export default createStackNavigator(
    {
        lciListCustomer: {
            screen: ListCustomersInfo,
        },
        lciDetailCustomer: {
            screen: DetailCustomersInfo,
        }
    },
    {
        initialRouteName: 'lciListCustomer',
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
        }
    }
);