import React, {Component} from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';

/**
 * Button element
 *
 * @author DaiDP
 * @since Aug, 2018
 */
export default class ButtonElement extends Component
{
    render()
    {
        return (
            <TouchableOpacity
                disabled={this.props.disabled}
                style = {styles.button}
                onPress={this.props.onPress}>
                <Text style = {styles.text}>{this.props.title || "Continue"}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B76FF',
        height: 48,
        borderRadius: 5,
        zIndex: 100,

        shadowColor: '#9EC9FF',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
    },
    text: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 18,
        fontWeight: '700'
    }
});
