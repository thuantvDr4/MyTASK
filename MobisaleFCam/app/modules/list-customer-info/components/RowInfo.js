import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

class RowInfo extends React.Component
{
    render()
    {
        return (
            <View style={[styles.rowInfoContainer, this.props.style]}>
                <Text style={styles.rowInfoLabel}>{this.props.label}</Text>
                <Text style={[styles.rowInfoText, this.props.textStyle]}>{this.props.text}</Text>
            </View>
        );
    }
}

RowInfo.defaultProps = {
    style: {},
    textStyle: {}
}

export default RowInfo;


const styles = StyleSheet.create({
    rowInfoContainer: {
        marginVertical: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rowInfoLabel: {
        color: '#9a9a9a',
        fontSize: 12,
        lineHeight: 14,
    },
    rowInfoText: {
        color: '#444',
        fontSize: 12,
        lineHeight: 14,
        textAlign: 'right',
        fontWeight: '500',
        maxWidth: '60%'
    }
});