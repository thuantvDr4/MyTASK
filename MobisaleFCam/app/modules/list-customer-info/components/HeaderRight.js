

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

class HeaderRight extends React.Component {

    constructor(props)
    {
        super(props);
    }

    render() {
        return (
            <HeaderBackButton onPress={()=>{alert('The feature will be built in next version')}}
                backImage={<Image style={{marginHorizontal:20}} source={require('../../../assets/images/list-customer-info/ic_24Thong_bao.png')}/>}
            tintColor="#fff"/>
        );
    }
}


export default HeaderRight;