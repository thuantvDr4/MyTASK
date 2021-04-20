/*
    Module: Contract List Navigation
    Author: Thuandd3
    Date Create: 28/05/19
*/

// LIB
import React  from 'react';
import { View } from 'react-native';
import { createStackNavigator } from 'react-navigation';

// COMPONENT
import DeploymentList from '../scenes/DeploymentList';
import DeploymentDetail from '../scenes/DeploymentDetail';


export default {
    DeploymentList: { screen: DeploymentList },
    DeploymentDetail: { screen: DeploymentDetail },
};