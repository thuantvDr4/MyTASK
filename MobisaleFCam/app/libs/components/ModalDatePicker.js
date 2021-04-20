import React, { Component } from 'react';
import {View, Image, Text, TouchableOpacity, Keyboard} from 'react-native';
import {strings} from 'locales/i18n';

// HELPER
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

// Component
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';

// Gobal Style
import ols from '../../styles/Ola-style';

// images icon
var souD = require('assets/images/tech-picker/down-arrow.png');
var souU = require('assets/images/tech-picker/up-arrow.png');

export default class ModalDatePicker extends Component
{
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            dateTemp: "",
            isDateTimeVisible: false,
            isValid: true
        };
    }

    setValid(isValid) {
        this.setState({
            isValid: isValid
        })
    }

    _handleDateTimePicked = (datetime) => {
        this.setState({
            ...this.state,
            isDateTimeVisible: false,
            dateTemp: moment(datetime).format("MM/DD/YYYY"),
        }, () => {
            this.props.onChangeFromChild(this.state.data, moment(datetime).format("MM/DD/YYYY"));
        });
    }

    _hideDateTimePicker = () => {
        this.setState({
            isDateTimeVisible: false
        });
    }

    _showDateTimePicker = () => {
        this.setState({
            isDateTimeVisible: true
        });
    }

    render() {
        const validStyle = createValidStyleSheet(this.state.isValid);

        return (
            <View style={[ols.field, validStyle.validStyleBorder]}>
                <Text style={[ols.plfake, ols.fs12]}>{this.props.label}</Text>
                <TouchableOpacity style={[ols.drdfake]} onPress={this._showDateTimePicker}>
                    <Text style={[ols.fs12, validStyle.validStyleText]}>{this.state.dateTemp ? this.state.dateTemp : this.props.placeholder}</Text>
                    <Image style={[ols.dD_ico, { tintColor: '#8a919a'}]} source={!this.state.isDateTimeVisible ? souD : souU} />
                </TouchableOpacity>
                <DateTimePicker
                    isVisible={this.state.isDateTimeVisible}
                    onConfirm={this._handleDateTimePicked}
                    onCancel={this._hideDateTimePicker}
                    confirmTextIOS={strings('modal.datePick.btnChoose_label')}
                    cancelTextIOS={strings('modal.datePick.btnCancel_label')}
                    mode={this.props.mode}
                    locale={this.props.locale}
                />
            </View>
        );
    }
}