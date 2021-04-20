/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert
} from 'react-native';
import {HeaderBackButton} from 'react-navigation';
import {connect} from "react-redux";
import NavigationService from 'app-libs/helpers/NavigationService';


class HeaderBackButtonBookport extends React.Component {

    constructor(props)
    {
        super(props);
        this._handlePress = this._handlePress.bind(this);
    }

    componentDidMount(){
    }

    _handlePress(){
        const { navigation } = this.props;
        const lciDetailCustomer = navigation.getParam('lciDetailCustomer',false);
        const pcListCustomers = navigation.getParam('pcListCustomers',false);

        NavigationService.navigate('pcListCustomers');

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