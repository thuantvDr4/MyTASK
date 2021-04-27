import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

/**
 * Input Element: Text
 * 
 * ############# Properties #############
 * 1. label: Label text
 * 2. value: value selected
 * 
 * @author DaiDP
 * @since Aug, 2018
 */

class TextReadOnlyInput extends React.PureComponent
{
    render()
    {
        return (
            <View style = {[styles.wrapper]}>
                <View>
                    <Text style = {styles.label} >{ this.props.label }</Text>
                </View>
                <Text style = {{width: '50%', textAlign:'right', color: '#444', fontSize: 12, }}>{this.props.value}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', 
        minHeight: 40, height: 40,
        paddingHorizontal: 12, marginBottom: 12,
        borderColor: '#d0d8e2', borderWidth: 1, 
        borderRadius: 5,
        // marginVertical: 6
    },
    label: {
        color: '#9a9a9a',
        fontSize: 12, 
    }
});

export default TextReadOnlyInput;