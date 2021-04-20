import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';

class ButtonBorder extends React.Component
{
    render()
    {
        return (
            <TouchableOpacity style={[styles.btn, this.props.style]} onPress={this.props.onPress}>
                <Text style={styles.btnText}>{this.props.title}</Text>
            </TouchableOpacity>
        );
    }
}

ButtonBorder.DefaultProps = {
    style: {}
}

export default ButtonBorder;

const styles = StyleSheet.create({
    btn: {
        borderColor: '#9ec9ff',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderRadius: 24,
        alignItems: 'center',
        //width: 150
    },
    btnText: {
        color: '#0b76ff',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 16,
        marginVertical: 12
    }
});