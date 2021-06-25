import {createStackNavigator, HeaderBackButton} from 'react-navigation';
import React  from 'react';
import {View} from 'react-native';

import DetailCustomersInfo from '../scenes/DetailCustomersInfo';
import UploadImage from '../scenes/UploadCustomerImage';
import CreateContract from '../scenes/CreateContract';
import ContractDetail from '../scenes/Contract-Detail';
import ReceiptDetail from '../scenes/Receipt-Detail';
import ViewImage from '../scenes/ViewCustomerImage';


export default createStackNavigator(
    {
        openSafe_DetailCustomer: {
            screen: DetailCustomersInfo,
        },
        openSafe_UploadImg: {
            screen: UploadImage,
        },
        openSafe_CreateContract: {
            screen: CreateContract,
        },
        openSafe_DetailContract: {
            screen: ContractDetail,
        },
        openSafe_ReceiptDetail: {
            screen: ReceiptDetail,
        },
        openSafe_ViewImage: {
            screen: ViewImage,
        },
    },
    {
        initialRouteName: 'openSafe_DetailCustomer',
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
