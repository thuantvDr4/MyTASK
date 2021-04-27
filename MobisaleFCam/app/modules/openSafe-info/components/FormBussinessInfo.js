import React, { Component } from 'react';
import {View, Image, Text, TouchableOpacity} from 'react-native';
import {strings} from 'locales/i18n';

import { convertPhone, convertWhiteSpace } from "app-libs/helpers/regex";

// Component    
import InputO from './InputO';
import DateTimePicker from './DateTimePicker';

// Gobal Style
import styles from '../styles';
var reStyle = require('../../../styles/Ola-style');

const ols = reStyle.default;

class FormBussinessInfo extends Component
{
    constructor(props) {
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

    _onOut(key) {
        let state = this.state;

        if (key === 'FullName' && convertWhiteSpace(state.data.FullName) === '' ) {
            state.data[key] = '';
        }

        if (key === 'Representive' && convertWhiteSpace(state.data.Representive) === '' ) {
            state.data[key] = '';
        }

        if (key === 'TaxCode' && convertWhiteSpace(state.data.TaxCode) === '' ) {
            state.data[key] = '';
        }

        this.setState(state, () => {
            // this._liveCheck(key);
            this.props.onChangeFromChild && this.props.onChangeFromChild(key, state.data[key]);
        });

        return;
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


    setValidForm() {
        const {data} = this.state;
        
        // FULLNAME
        if (data.FullName == "" || (data.FullName.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
            this.refs['FullNameType'].setValid(false);
        } else {
            this.refs['FullNameType'].setValid(true);
        }

        // DAI DIEN
        if (data.Representive == "" || (data.Representive.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
            this.refs['RepresentiveType'].setValid(false);
        } else {
            this.refs['RepresentiveType'].setValid(true);
        }

        // TAX
        if (data.TaxCode == "" || (data.TaxCode.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
            this.refs['TaxCodeType'].setValid(false);
        } else {
            this.refs['TaxCodeType'].setValid(true);
        }

        // ANIVERSARY
        if (data.Birthday == "") {
            this.refs['BirthdayType'].setValid(false);
        } else {
            this.refs['BirthdayType'].setValid(true);
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

            case 'Representive':
                if (data.Representive == "" || (data.Representive.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
                    this.refs['RepresentiveType'].setValid(false);
                } else {
                    this.refs['RepresentiveType'].setValid(true);
                }
                break;

            case 'TaxCode':
                if (data.TaxCode == "" || (data.TaxCode.replace(/^\s\s*/, '').replace(/\s+$/, '') === "")) {
                    this.refs['TaxCodeType'].setValid(false);
                } else {
                    this.refs['TaxCodeType'].setValid(true);
                }
                break;

            default:
                break;
        }
    }


    render() {
        // const opjNationCus = [{ct:"Campuchia"}, {ct:"Việt Nam"}];

        return (
            <View>
                <View style={styles.container}>
                    <InputO
                        ref="FullNameType"
                        label={strings('customer_info.customer_info.form.cus_name_personal_label')}
                        style={[styles.textInput, ols.fw500, ols.txtR, {paddingLeft: 120,}]}
                        placeholder={strings('customer_info.customer_info.form.cus_name_personal_placeholder')}
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
                    <Text style={[styles.plfake, ols.fs12]}></Text>
                    <InputO
                        ref="RepresentiveType"
                        label={strings('customer_info.customer_info.form.cus_delegate_label')}
                        style={[styles.textInput, ols.fw500, ols.txtR, {paddingLeft: 120,}]}
                        placeholder={strings('customer_info.customer_info.form.cus_delegate_placeholder')}
                        placeholderTextColor='#444444'
                        textAlign={'right'}
                        autoCapitalize={'none'}
                        returnKeyType={'done'}
                        autoCorrect={false}
                        onChangeText={(text) => this._changeValue('Representive', text)}
                        onBlur={() => this._onOut('Representive')}
                        value={this.state.data['Representive']}
                    />
                </View>

                <View style={styles.container}>
                    <Text style={[styles.plfake, ols.fs12]}></Text>
                    <InputO
                        ref="TaxCodeType"
                        label={strings('customer_info.customer_info.form.cus_tax_label')}
                        style={[styles.textInput, ols.fw500, ols.txtR, {paddingLeft: 90,}]}
                        placeholder={strings('customer_info.customer_info.form.cus_tax_placeholder')}
                        placeholderTextColor='#444444'
                        textAlign={'right'}
                        autoCapitalize={'none'}
                        returnKeyType={'done'}
                        //keyboardType='numeric'
                        autoCorrect={false}
                        onChangeText={(text) => this._changeValue('TaxCode', text)}
                        onBlur={() => this._onOut('TaxCode')}
                        value={this.state.data['TaxCode']}
                    />
                </View>

                <View style={styles.container}>
                    <DateTimePicker
                        ref="BirthdayType"
                        label={strings('customer_info.customer_info.form.cus_aniversary_date_label')}
                        placeholder={strings('customer_info.customer_info.form.cus_aniversary_date_placeholder')}
                        mode={'date'}
                        locale={'en'}
                        data={this.state.data}
                        date={this.state.data.Birthday}
                        onChange={this._onChange.bind(this)}
                        // onChangeFromChild={this.props.onChangeFromChild}
                    />
                </View>
            </View>

            
        );
    }
}


export default FormBussinessInfo;