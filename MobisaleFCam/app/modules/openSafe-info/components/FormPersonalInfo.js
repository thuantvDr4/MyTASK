import React, { Component } from 'react';
import {View, Image, Text, TouchableOpacity, Keyboard} from 'react-native';
import {strings} from 'locales/i18n';

import { convertPhone, convertWhiteSpace } from "app-libs/helpers/regex";

// Component    
import InputO from './InputO';
import DateTimePicker from './DateTimePicker';

// Gobal Style
import styles from '../styles';
import ols from '../../../styles/Ola-style';
import {KEYBOARD_NUMBER} from '../constants';

export default class FormPersonalInfo extends Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            data: this.props.data,
        };

        this._changeValue = this._changeValue.bind(this);
    }

    /**
     * TEXT CHANGE
     * @param 
     * @private
     */
    _changeValue(name, value) {
        let data = this.state.data;
        data[name] = value;

        this.setState({
            data: data
        }, () => {
            this.props.onChangeText && this.props.onChangeText(name, value);
        });
    }


    /**
     * SELECT CHANGE
     * @param 
     * @private
     */
    _onChange(key, text) {
        var state = this.state;
        state.data[key] = text;
        this.setState({
            state
        }, () => {
            this.props.onChangeFromChild && this.props.onChangeFromChild(key, text)
        });
    }

    _onOut(key) {
        let state = this.state;

        if (key === 'FullName' && convertWhiteSpace(state.data.FullName) === '' ) {
            state.data[key] = '';
        }

        if (key === 'Passport' && convertWhiteSpace(state.data.Passport) === '' ) {
            state.data[key] = '';
        }

        this.setState(state, () => {
            // this._liveCheck(key);
            this.props.onChangeFromChild && this.props.onChangeFromChild(key, state.data[key]);
        });

        return;
    }


    setValidForm() {
        const {data} = this.state;
        
        // FULLNAME
        if (data.FullName == "" || (data.FullName.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
            this.refs['FullNameType'].setValid(false);
        } else {
            this.refs['FullNameType'].setValid(true);
        }

        // BIRTHDAY
        if (data.Birthday == "") {
            this.refs['BirthdayType'].setValid(false);
        } else {
            this.refs['BirthdayType'].setValid(true);
        }

        // PASSPORT
        if (data.Passport == "" || (data.Passport.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
            this.refs['PassportType'].setValid(false);
        } else {
            this.refs['PassportType'].setValid(true);
        }
    }


    /**
     * LIVE VALIDATE FORM
     */
    _liveCheck(key, text) {
        const data = this.state.data;

        switch (key) {
            case 'FullName':
                if (data.FullName == "" || (data.FullName.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
                    this.refs['FullNameType'].setValid(false);
                } else {
                    this.refs['FullNameType'].setValid(true);
                }
                break;

            case 'Passport':
                if (data.Passport == "" || (data.Passport.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
                    this.refs['PassportType'].setValid(false);
                } else {
                    this.refs['PassportType'].setValid(true);
                }
                break;

            default:
                break;
        }
    }

    
    render() {
        return (
            <View>
                <View style={styles.container}>
                    <InputO
                        ref="FullNameType"
                        label={strings('customer_info.customer_info.form.cus_name_label')}
                        style={[styles.textInput, ols.fw500, {paddingLeft: 100,}]}
                        placeholder={strings('customer_info.customer_info.form.cus_name_placeholder')}
                        placeholderTextColor='#444444'
                        textAlign={'right'}
                        autoCapitalize={'none'}
                        returnKeyType={'done'}
                        autoCorrect={false}
                        onChangeText={(text) => this._changeValue('FullName', text)}
                        onBlur={() => this._onOut('FullName')}
                        value={this.state.data['FullName']}
                    />
                </View>

                <View style={styles.container}>
                    <DateTimePicker
                        ref="BirthdayType"
                        label={strings('customer_info.customer_info.form.cus_birth_label')}
                        placeholder={strings('customer_info.customer_info.form.cus_birth_placeholder')}
                        mode={'date'}
                        locale={'en'}
                        data={this.state.data}
                        date={this.state.data.Birthday}
                        onChange={this._onChange.bind(this)}
                        // onChangeFromChild={this.props.onChangeFromChild}
                    />
                </View>

                <View style={styles.container}>
                    <InputO
                        ref="PassportType"
                        label={strings('customer_info.customer_info.form.cus_ID_label')}
                        style={[styles.textInput, ols.fw500, ols.txtR, {paddingLeft: 110,}]}
                        placeholder={strings('customer_info.customer_info.form.cus_ID_placeholder')}
                        placeholderTextColor='#444444'
                        textAlign={'right'}
                        autoCapitalize={'none'}
                        returnKeyType={'done'}
                        autoCorrect={false}
                        // keyboardType={KEYBOARD_NUMBER}
                        onChangeText={(text) => this._changeValue('Passport', text)}
                        onBlur={() => this._onOut('Passport')}
                        value={this.state.data['Passport']}
                    />
                </View>
            </View>
            
        );
    }
}