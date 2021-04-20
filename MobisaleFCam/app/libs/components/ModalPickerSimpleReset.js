import React, { Component } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

// LIB COMPONENT CUSTOM
import { CustomPicker } from 'react-native-custom-picker';

// HELPER
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

// Gobal Style
import { color, fontSize } from "../../styles/Ola-style";
var styleRe = require('../../styles/Ola-style');

// IMAGE
var souD = require('assets/images/tech-picker/down-arrow.png');
var souU = require('assets/images/tech-picker/up-arrow.png');

const ols = styleRe.default;


/**
Tương tự như ModalPickerSimple nhưng có thêm props điều kiện để reset lại field
 * 
 * @author Pham Tuan Anh
 */
export default class ModalPickerReset extends Component {

    constructor(props) {
        super(props);

        this.state = {
            selectedItem: false,
            isSelected: false,
            isValid: true
        };
    }

    _slec() {
        this.setState({
            isSelected: true,
        });
    }

    _unslec() {
        this.setState({
            isSelected: false,
        });
    }

    setValid(isValid) {
        this.setState({
            isValid: isValid
        })
    }


    componentWillReceiveProps(nextProps) {
    
        let newState = {};

        if (nextProps.defaultValue != this.props.defaultValue) {
            newState.isValid = true;
        }

        this.setState(newState);

    }

    render() {
        const validStyle = createValidStyleSheet(this.state.isValid);
        return (
            <View style={[ols.field, validStyle.validStyleBorder]} ref="NationlyType">
                <Text style={[ols.plfake, ols.fs12]}>{this.props.label}</Text>
                <CustomPicker
                    {...this.props}
                    fieldTemplate={this.renderField.bind(this)}
                    optionTemplate={this.renderOption.bind(this)}
                    headerTemplate={this.renderHeader.bind(this)}

                    modalStyle={ols.dD_modal}
                    backdropStyle={ols.dD_backDrop}
                    modalAnimationType={'fade'}
                    onFocus={this._slec.bind(this)}
                    onBlur={this._unslec.bind(this)}

                />
            </View>
        );
    }


    renderField(settings) {
        const { selectedItem, defaultText, getLabel } = settings;
        const validStyle = createValidStyleSheet(this.state.isValid);

        return (
            <View style={[ols.dD_container]}>
                <Text style={[ols.dD_text, ols.txtR, ols.fw500, ols.cl444, validStyle.validStyleText]}>
                    {!selectedItem || this.props.isResetField ? defaultText : getLabel(selectedItem)}
                </Text>
                <Image style={[ols.dD_ico, { tintColor: '#8a919a' }]} source={!this.state.isSelected ? souD : souU} />
            </View>
        )
    }


    renderHeader() {
        if (!this.props.headerTitle) {
            return;
        }

        return (
            <View style={ols.dD_headerContainer}>
                <Text style={ols.dD_headerText}>{this.props.headerTitle}</Text>
                <Image resizeMode='cover' style={[ols.dD_exitHeaderSelect, { height: 12, width: 12 }]} source={require('../../assets/images/list-customer-info/ic_16Close.png')} />
            </View>
        )
    }


    renderOption(settings) {
        const { item, getLabel } = settings;

        return (
            <View style={ols.dD_optionContainer}>
                <Text style={ols.dD_optionText}>{getLabel(item)}</Text>
            </View>
        )
    }
}