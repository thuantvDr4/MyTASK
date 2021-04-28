import React from 'react';
import {StyleSheet, TextInput, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'

class Button extends React.Component
{
    render()
    {
        return (
            <TouchableOpacity {...this.props}>
                {this.props.children}
            </TouchableOpacity>
        );
    }
}


/**
 * Numeric input element
 *
 * ############# Properties #############
 * 1. maxValue: Max value allow. Interger
 * 2. value: Default value. Interger
 *
 * ############# Events #################
 * 1. onChange(value): Event when select change
 *
 *
 * @author DaiDP
 * @since Aug, 2018
 */
class NumericInput extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.state = {
            value: props.value || 1
        }

        this._dec = this._dec.bind(this);
        this._inc = this._inc.bind(this);
        this._onChange = this._onChange.bind(this);
    }

    _dec()
    {
        if (! this.props.editable) {
            return;
        }

        // Giam 1 va kiem tra min 0
        // UPDATE 19/07/19  - min là 1
        let newVal = this.state.value - 1;
        newVal = newVal >= 1 ? newVal : 1;

        this.setState({
            value: newVal
        });

        // callback ra ngoai
        this.changeValueCallback(newVal);
    }

    _inc()
    {
        if (! this.props.editable) {
            return;
        }

        // Tang len 1 va kiem tra maxValue
        let newVal = this.state.value + 1;
        newVal = this.props.maxValue && newVal > this.props.maxValue ? this.props.maxValue : newVal;

        this.setState({
            value: newVal
        });

        // callback ra ngoai
        this.changeValueCallback(newVal);
    }

    _onChange(text)
    {
        // Remove cac ky tu khac so, ep kieu interger va kiem tra maxValue
        text = text.replace(/\D/g, '');
        let newVal = parseInt(text !== '' ? text : 1);
        newVal = this.props.maxValue && newVal > this.props.maxValue ? this.props.maxValue : newVal;

        this.setState({
            value: newVal
        });

        // callback ra ngoai
        this.changeValueCallback(newVal);
    }

    changeValueCallback(value)
    {
        this.props.onChange && this.props.onChange(value);
    }

    render()
    {
        return (
            <View style={[styles.inputContainerStyle, (this.props.editable ? '' : styles.inputContainerStyleDisable) ]}>
                <Button onPress={this.state.value > 1 ? this._dec : null } style={styles.leftButtonStyle}>
                    <Icon name='md-remove' size={16} style={[styles.iconStyle, (this.props.editable && this.state.value > 1 ? '' : styles.iconStyleDisable) ]} />
                </Button>
                <View style={styles.inputWraperStyle}>
                    <TextInput
                        editable={this.props.editable}
                        returnKeyType='done'
                        underlineColorAndroid='rgba(0,0,0,0)'
                        keyboardType='numeric'
                        value={this.state.value.toString()}
                        onChangeText={this._onChange}
                        style={[styles.inputStyle, (this.props.editable ? '' : styles.iconStyleDisable) ]}
                    />
                </View>
                <Button
                    disabled = {!this.props.editable}
                    onPress={this._inc}
                    style={styles.rightButtonStyle}>
                    <Icon name='md-add' size={16} style={[styles.iconStyle, (this.props.editable ? '' : styles.iconStyleDisable) ]} />
                </Button>
            </View>
        );
    }
}

NumericInput.defaultProps = {
    editable: true
}

export default NumericInput;


const styles = StyleSheet.create({
    inputContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#0b76ff',
        borderRadius: 6,
        width: 76,
        minWidth: 76,
        height: 40,
        minHeight: 40
    },
    inputContainerStyleDisable: {
        borderColor: '#d0d8e2',
    },
    leftButtonStyle: {
        position: 'absolute',
        zIndex: -1,
        left: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        paddingHorizontal: 12
    },
    rightButtonStyle: {
        position: 'absolute',
        zIndex: -1,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0,
        paddingHorizontal: 12
    },
    inputWraperStyle: {
        alignSelf: 'center',
    },
    inputStyle: {
        fontSize: 12,
        textAlign: 'center',
        padding: 0
    },
    iconStyle: {
        fontWeight: '900',
        backgroundColor: 'rgba(0,0,0,0)',
        color: '#0b76ff'
    },
    iconStyleDisable: {
        color: '#d0d8e2',
    },
});
