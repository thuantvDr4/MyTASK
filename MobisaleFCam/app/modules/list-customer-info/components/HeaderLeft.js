

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert, Image, StyleSheet
} from 'react-native';
import {HeaderBackButton} from 'react-navigation';

class HeaderLeft extends React.Component {

    constructor(props)
    {
        super(props);
    }

    render() {
        return (
            <HeaderBackButton
                backImage={<Image style={{marginHorizontal:20}} source={require('../../../assets/images/list-customer-info/ic_24Menu.png')}/>}
                onPress={() => {this.props.navigation.openDrawer()}}
            tintColor="#fff"/>
        );
    }
}


export default HeaderLeft;