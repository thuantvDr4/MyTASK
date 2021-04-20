import React, { Component } from 'react';
import {
    Alert
} from 'react-native';

// REDUX
import {connect} from "react-redux";

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';
import {HeaderBackButton} from 'react-navigation';

// LANGUAGE
import {strings} from 'locales/i18n';

class HeaderBackButtonBookport extends React.Component {

    constructor(props)
    {
        super(props);
        this._handlePress = this._handlePress.bind(this);
    }

    _handlePress(){
        const { navigation } = this.props;

        // Get Param từ màn hình detail customer
        // const lciDetailCustomer = navigation.getParam('lciDetailCustomer', false);

        // Get Param từ màn hình khách hàng tiềm năng
        // const pcListCustomers = navigation.getParam('pcListCustomers',false);

        // Từ màn hình tạo mới phiếu thông tin thì ko cần

        Alert.alert(
			strings('sale_new.dialog.title'),
			strings('dl.sale_new.goBack'),
			[
				{ text: strings('dialog.btnCancel'), onPress: () => {}, style: "cancel" },
                { text: strings('dialog.btnOK'), onPress: () => {
                        // if (lciDetailCustomer) {
                        //     // NavigationService.navigate('lciDetailCustomer', {
                        //     //     RegID : this.props.RegistrationObj.RegId, 
                        //     //     RegCode : this.props.RegistrationObj.RegCode});
                        // } else {
                        //     NavigationService.navigateGoBack();
                        // }

                        NavigationService.navigateGoBack();
                    } 
				},
			],
			{ cancelable: false },
        );
    }

    render() {
        return (
            <HeaderBackButton onPress={this._handlePress} tintColor="#fff"/>
        );
    }
}

export default connect((state)=>{
    return{
        RegistrationObj : state.saleNewReducer.RegistrationObj,
    }
})(HeaderBackButtonBookport);