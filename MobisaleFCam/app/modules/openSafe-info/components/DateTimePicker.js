import React, { Component } from 'react';
import {View, Image, Text, TouchableOpacity, Keyboard} from 'react-native';
import {strings} from 'locales/i18n';

// HELPER
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

// Component    
import InputO from './InputO';
import ModalPicker from '../../../libs/components/ModalPicker';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment, { now } from 'moment';

// Gobal Style
import styles from '../styles';
import ols from '../../../styles/Ola-style';

// images icon
var souD = require('assets/images/tech-picker/down-arrow.png');
var souU = require('assets/images/tech-picker/up-arrow.png');

export default class FormPersonalInfo extends Component
{
    constructor(props) {
        super(props);

        this.state = {
            data: this.props.data,
            chosenDate: new Date(!this.props.date ? now() : this.props.date),
            isDateTimeVisible: false,
            isValid: true
        };

        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({chosenDate: new Date(newDate)})
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
            isValid: true,
            data: {
                ...this.state.data,
                Birthday: moment(datetime).format("MM/DD/YYYY"),
            }
        }, () => {
            this.setDate(moment(datetime).format("ll"));
            this.props.onChange('Birthday', moment(datetime).format("MM/DD/YYYY"));
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
            <View style={[styles.field, validStyle.validStyleBorder]}>
                <Text style={[styles.plfake, ols.fs12, ]}>{this.props.label}</Text>
                <TouchableOpacity style={[ols.drdfake]} onPress={this._showDateTimePicker}>
                    <Text style={[ols.fs12, ols.fw500, ols.cl444, validStyle.validStyleText]}>{!this.state.data.Birthday ? this.props.placeholder : moment(this.state.data.Birthday).format("MM/DD/YYYY")}</Text>
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
                    date={this.state.chosenDate}
                />
            </View>
        );
    }
}