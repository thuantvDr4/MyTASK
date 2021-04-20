// LIB
import React from 'react';
import { Text, View, Image, TouchableOpacity, ImageBackground} from 'react-native';
import {Component} from "react";
import {isIphoneX} from 'react-native-iphone-x-helper'
import {connect} from 'react-redux';
import {strings} from 'locales/i18n';

// LIB CUSTOM
import NavigationService from 'app-libs/helpers/NavigationService';

// STYLE
import styles from "../styles";

class HomeHeader extends Component {
    
    constructor(props) {
        super(props);
    }

    // hiển thị avatar
    renderAvatar(){ 
        if (this.props.avatar != null) {
            return <Image style={styles.avatarImage} source={{uri: this.props.avatar}}/>;
        } else {
            return <Image style={styles.avatarImage} source={require('../../../assets/images/home/ic_48avatar.png')}/>;
        }
    }

    render(){
        return(
            <ImageBackground style={[isIphoneX() ? styles.headerContainerX : styles.headerContainer]} 
                resizeMode='stretch'  
                source={require('../../../assets/images/background.png')}>

                <View style={[styles.headerTop]}>
                    <TouchableOpacity
                        style={styles.headerMenu}
                        onPress={ () => this.props.navigation.openDrawer() }
                    >
                        <Image source={require('../../../assets/images/home/ic_24Menu.png')}/>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={styles.headerIcon} 
                        onPress={ ()=> {
                            this.props.avatar && NavigationService.navigate('DetailAvatar', { localpathAvatar: this.props.avatar });
                        }}
                    >
                        {this.renderAvatar()}
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                        style={styles.headerNotify}
                        onPress={() => {
                            NavigationService.navigate('NotificationList');
                        }}
                    >
                        <Image style={styles.headerNotifyImg} source={require('../../../assets/images/home/ic_24Thong_bao.png')}/>
                        { 
                            this.props.notiNum > 0 && this.props.notiNum !== 'undefined'
                            ?
                            <View style={styles.headerNotifyDot} >
                                <Text style={[styles.headerNotifyText]}>{this.props.notiNum > 9 ? "9+" : this.props.notiNum }</Text>
                            </View>
                            : 
                            null
                        }
                    
                    </TouchableOpacity>
                </View>

                <View style={styles.oneHeader}>
                    <Text style={styles.headerInfoName}>
                        {this.props.Username}
                    </Text>
                </View>
                
                <View style={styles.oneHeader}/>
            </ImageBackground>
        );
    }
}

export default connect((state) => {
    // GET STATE
    const notiNum = state.homeReducer.notificationNum;

    return {
        Username: state.authReducer.userInfo.UserName,
        avatar: state.authReducer.avatar,
        notiNum: notiNum,
    }}, null
)(HomeHeader);

