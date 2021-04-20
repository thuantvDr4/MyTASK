/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    TouchableOpacity,
    Image
} from 'react-native';
import styles from '../BookPort.styles';
import {connect} from "react-redux";
import {actions} from '../';
const {changeNetworkType, changeTypeBookport} = actions;

class BookPortTop extends React.PureComponent {
    constructor (props) {

        super(props)

        this._handleOnPressNetworkType = this._handleOnPressNetworkType.bind(this);
    }

    /**
     * xu ly thay doi loai ha tang
     * @param val
     * @private
     */
    _handleOnPressNetworkType(val){
        this.props.changeNetworkType(val);

        if (!this.props.objBookport.typeBookport)
        {
            this.props.changeTypeBookport(0, 0);
        }

    }

    _renderButtonTop() {
        const {networkType} = this.props.objBookport;
        const {RegCode} =  this.props.RegistrationObj;

        if ( RegCode !== "") {
            return (
                <View style={styles.containerBtn}>
                    <View style={styles.oneTab}>
                        <TouchableOpacity 
                            style={[styles.btnTab, styles.btnTabActive]} 
                            onPress={()=>{}}>
                            <Text style={[styles.textTab, styles.textTabActive]}>{networkType !== 1 ? 'FTTH' : 'ADSL' }</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return (
                <View style={styles.containerBtn}>
                    <View style={styles.oneTab}>
                        <TouchableOpacity 
                            style={[styles.btnTab, networkType == '2' ? styles.btnTabActive : null]} 
                            onPress={()=>{this._handleOnPressNetworkType('2')}}>
                            <Text style={[styles.textTab, networkType == '2' ? styles.textTabActive : null]}>FTTH</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.oneTab}>
                        <TouchableOpacity 
                            style={[styles.btnTab, networkType == '1' ? styles.btnTabActive : null]} 
                            onPress={()=>{this._handleOnPressNetworkType('1')}}>
                            <Text style={[styles.textTab, networkType == '1' ? styles.textTabActive : null]}>ADSL</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    render() {
        return (
            <View style={styles.topContainer}>
                { 
                    // this._renderButtonTop() 
                }

                <View style={styles.containerAddress}>
                    <View style={styles.viewImgAddress}>
                        <Image style={styles.imgAddress} source={require('../../../assets/images/bookport/Home_fill.png')} />
                    </View>
                    <View style={styles.viewTxtAddress}>
                        <Text style={styles.txtAddress}>{this.props.RegistrationObj.Address}</Text>
                    </View>
                </View>

            </View>
        );
    }
}

export default connect(state => {
    return {
        RegistrationObj: state.extraServiceInfoReducer.formData,
        objBookport: state.extraServiceInfoReducer.objBookport
    };
}, {changeNetworkType, changeTypeBookport})(BookPortTop);