import React, {Component} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import PropTypes from 'prop-types';
// HELPER
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';
// Gobal Style
var styleRe = require('../../../styles/Ola-style');
const ols = styleRe.default;

export default class ButtonNext extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isValid: true,
        };
    }

    componentWillReceiveProps(nextProps) {
        let newState = {};

        if (nextProps.value !== this.props.value) {
            newState.isValid = true;
        }

        this.setState(newState);
    }

    setValid(isValid) {
        this.setState({
            isValid: isValid,
        });
    }

    _onPress = () => {
        this.props.onPress && this.props.onPress();
    };

    render() {
        const validStyle = createValidStyleSheet(this.state.isValid);

        return (
            <View style={[this.props.style]}>
                <TouchableOpacity
                    style={[this.props.styleBtn, validStyle.validStyleBorder]}
                    onPress={this._onPress}
                >
                    <Text style={[this.props.styleBtnText, validStyle.validStyleText]}>
                        {this.props.label}
                        </Text>
                    {
                        this.props && this.props.value
                            ?
                            <Text style={{color: '#898989', fontSize: 12, marginBottom: 5}}>
                                {this.props.value}
                                </Text>
                            :
                            null
                    }
                </TouchableOpacity>
            </View>
        );
    }
}

ButtonNext.propTypes = {
    label: PropTypes.string,
};
