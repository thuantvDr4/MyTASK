import {createStackNavigator} from 'react-navigation';
import React  from 'react';
import {View} from 'react-native';
import ListCustomers from '../scenes/ListCustomers';
import AddCustomer from '../scenes/AddCustomer';
import DetailCustomers from '../scenes/DetailCustomers';
import AdvisoryResults from '../scenes/AdvisoryResults';
import ReCareList from '../scenes/RecareList';
import BirthdayList from  '../scenes/BirthdayList';
import ReCare from '../scenes/ReCare';

export default {
    pcListCustomers: {
        screen: ListCustomers,
    },
    pcAddCustomer: {
        screen: AddCustomer,
    },
    pcDetailCustomers: {
        screen: DetailCustomers,
    },
    pcAdvisoryResults: {
        screen: AdvisoryResults,
    },
    pcReCareList: {
        screen: ReCareList,
    },
    pcBirthdayList: {
        screen: BirthdayList,
    },
    pcReCare: {
        screen: ReCare,
    }
};

// export default createStackNavigator(
//     {
//         pcListCustomers: {
//             screen: ListCustomers,
//         },
//         pcAddCustomer: {
//             screen: AddCustomer,
//         }
//     },
//     {
//         initialRouteName: 'pcListCustomers',
//         navigationOptions: ({navigation}) => ({
//             headerStyle: {
//                 backgroundColor: '#0B76FF',
//                 borderBottomWidth: 0,
//                 shadowRadius: 0,
//                 shadowOffset: {
//                     height: 0,
//                 },
//                 shadowColor: 'transparent',
//                 elevation: 0
//             },
//             headerTintColor: '#FFFFFF',
//             headerTitleStyle: {
//                 fontSize    :20,
//                 fontWeight: 'bold',
//                 textAlign: 'center',
//                 flexGrow: 1
//             },
//             headerRight: <View/>,
//         })
//     }
// );
