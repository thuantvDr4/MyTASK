import React, { Component } from 'react';
import {View, Text, TouchableOpacity,StyleSheet, Image, ScrollView} from 'react-native';
import Dimensions from 'Dimensions';
import {HeaderBackButton} from 'react-navigation';
import {strings} from 'locales/i18n';
import {connect} from 'react-redux';
const DEVICE_WIDTH = Dimensions.get('window').width;
class DetailAvatar extends React.PureComponent {
    static navigationOptions = ({ navigation }) => {
        return {
            title:strings('home.detail_avatar.title'),
            headerLeft: <HeaderBackButton onPress={() => navigation.goBack(null)} tintColor="#fff"/>,
            headerRight: <TouchableOpacity  style={{marginRight: 10}}/>
        };
    };
    constructor(props)
    {
        super(props);
        this.state = {
            pathavatar:this.props.navigation.getParam('localpathAvatar',null)
        }
    }
    // xử lý hiển thị avatar sale man
    rederAvatar(){
        if(this.state.pathavatar === null )
        {
        return <Image  style={styles.sizedefaultavatar} source={require('../../../assets/images/home/ic_48avatar.png')}/>;
            
        }else
        {
        return <Image  style={styles.sizeavatar} source={{uri:this.state.pathavatar}}/>;
        }
    }
    render(){
        return (
                <View style={{flex:1}}>
                    <View style={styles.containeravatar}>
                        {this.rederAvatar()}
                    </View>
                </View>
        );
    }
}
export default connect()(DetailAvatar)
const styles = StyleSheet.create({
    containeravatar:{
        flex:1,
        alignItems: 'center' ,
        justifyContent: 'center',
        backgroundColor:'#FFFFFF'
    },
    sizedefaultavatar:{
        width:150,
        height:150
    },
    sizeavatar:{
        width:DEVICE_WIDTH,
        height:DEVICE_WIDTH
    }
});