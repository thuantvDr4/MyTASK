import {createStackNavigator} from 'react-navigation';
import styles from '../styles';

import CreateContract from '../scenes/CreateContract';
import ContractPattern from '../scenes/ContractPattern';
import ContractDetail from '../scenes/ContractDetail';
import InvoiceDetail from '../scenes/InvoiceDetail';
import UpdateTotalAmount from '../scenes/UpdateTotalAmount';
import DeployAppointment from '../scenes/DeployAppointment';
import PaymentQrCode from '../scenes/PaymentQrCode';

export default {
        Contract: {
            screen: CreateContract
        },
        ContractPattern: {
            screen: ContractPattern
        },
        ContractDetail: {
            screen: ContractDetail
        },
        ContractInvoiceDetail: {
            screen: InvoiceDetail
        },
        ContractUpdateTotalAmount: {
            screen: UpdateTotalAmount
        },
        DeployAppointment: {
            screen: DeployAppointment
        },
        PaymentQrCode: {
            screen: PaymentQrCode
        }
};

/*
export default createStackNavigator(
    {
        ContractCreate: {
            screen: CreateContract
        },
        ContractPattern: {
            screen: ContractPattern
        },
        ContractDetail: {
            screen: ContractDetail
        },
        InvoiceDetail: {
            screen: InvoiceDetail
        },
        UpdateTotalAmount: {
            screen: UpdateTotalAmount
        },
        DeployAppointment: {
            screen: DeployAppointment
        }
    },
    {
        //initialRouteName: 'ContractCreate',

        navigationOptions: {
            headerStyle:      styles.nav_head_style,
            headerTintColor:  '#fff',
            headerTitleStyle: styles.nav_header_titleStyle,
        }
    }
);*/
