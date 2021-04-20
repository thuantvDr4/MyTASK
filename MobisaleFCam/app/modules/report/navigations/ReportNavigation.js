import { createStackNavigator } from 'react-navigation';
import React from 'react';
import { View } from 'react-native';
import ReportFilter from '../scenes/ReportFilter';
import ReportList from '../scenes/ReportList';
import TypeReportChoose from '../scenes/TypeReportChoose';
import SalaryReport from '../scenes/SalaryReport';
import CancelServiceReport from '../scenes/CancelServiceReport';
import SalaryBonusReport from '../scenes/SalaryBonusReport';


export default createStackNavigator({
    typeReportChoose: {
        screen: TypeReportChoose,
    },
    reportFilter: {
        screen: ReportFilter
    },
    salaryReport: {
        screen: SalaryReport
    },
    reportList: {
        screen: ReportList
    },

    cancelServiceReport: {
        screen: CancelServiceReport
    },
    salaryBonusReport:{
        screen: SalaryBonusReport
    },
}, {
    initialRouteName: 'typeReportChoose',
    navigationOptions: ({ navigation }) => ({
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
            fontSize: 20,
            fontWeight: 'bold',
            textAlign: 'center',
            flexGrow: 1
        },
        headerRight: < View/> ,
    })
});
