// LIB
import React  from 'react';
import {View, Platform} from 'react-native';
import {createStackNavigator, HeaderBackButton} from 'react-navigation';

// SCREEN
import BookPort from '../scenes/BookPort';
import BookPortCab from '../scenes/BookPortCab';


export default createStackNavigator(
    {
        ExSerBookport: {
            screen: BookPort,
        },
        ExSerBookportCab: {
            screen: BookPortCab,
        }
    },
    {
        initialRouteName: 'ExSerBookport',
        defaultNavigationOptions: ({navigation}) => ({
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
            headerRight: <View/>,
        }),
        mode: Platform.OS === "ios" ? "modal" : "card",
    }
);