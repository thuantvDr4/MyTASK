import React, {Component} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';

import PropTypes from 'prop-types';

// Gobal Style
import ols from '../../../styles/Ola-style';

export default class ButtonCreateInfo extends Component {
    constructor() {
        super();
    }

    _onPress() {

    }

    _onGrow() {

    }

    render() {
        return (
            <View style={this.props.style}>
                <TouchableOpacity
                    disabled = {this.props.disabled}
                    style={[ols.btnFull, ols.btnShadow,]}
                    onPress={this.props.onSubmit}
                    activeOpacity={0.5}>
                    <Text style={ols.btnText}>{this.props.label}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

ButtonCreateInfo.propTypes = {
    label: PropTypes.string,
};
