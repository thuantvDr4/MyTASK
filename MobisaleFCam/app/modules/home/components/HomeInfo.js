import React from 'react';
import {Component} from "react";
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';
import {
    Text, View, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, TouchableHighlight
} from 'react-native';

import styles from "../styles";

class HomeInfo extends Component {
    render(){
        return(
            <View style={styles.infoContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{strings('home.home_screen.personal_information')}</Text>
                </View>
                <View style={styles.contentInfoContainer}>
                    <View style={styles.oneContent}>
                        <Text style={styles.oneInfoLeft}>{strings('home.home_screen.full_name')}</Text>
                        <Text style={styles.oneInfoRight}>{this.props.userInfo.FullName}</Text>
                    </View>
                    <View style={styles.oneContent}>
                        <Text style={styles.oneInfoLeft}>{strings('home.home_screen.region')}</Text>
                        <Text style={styles.oneInfoRight}>{this.props.userInfo.Location}</Text>
                    </View>
                    <View style={styles.oneContent}>
                        <Text style={styles.oneInfoLeft}>{strings('home.home_screen.phone_number')}</Text>
                        <Text style={styles.oneInfoRight}>{this.props.userInfo.Phone}</Text>
                    </View>
                    <View style={styles.oneContent}>
                        <Text style={styles.oneInfoLeft}>{strings('home.home_screen.email')}</Text>
                        <Text style={styles.oneInfoRight}>{this.props.userInfo.Email}</Text>
                    </View>
                </View>
            </View>
        );
    }
}

export default connect(
    (state) => {
        return {
            userInfo: state.authReducer.userInfo
        }
    },
    null
)(HomeInfo);