import React, {Component} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';

import {CustomPicker} from 'react-native-custom-picker';


/**
 * TechPickup Component
 * 
 * - Document Readmore here: https://www.npmjs.com/package/react-native-custom-picker
 * - Common Properties and Events:
 * 
 * ############# Properties #############
 * 1. options: Array of options
 * 2. value: default value of TechPickup
 * 
 * ############# Events #################
 * 1. onValueChange(value): Event when select change
 * 
 * @author DaiDP
 * @since Jul, 2018
 */
class TechPicker extends React.PureComponent
{
    render()
    {
        return (
            <CustomPicker
                getLabel={item => item.label}
                {...this.props}
                //value={this.props.value | this.props.defaultValue}
                optionTemplate={this.renderOption.bind(this)}
                headerTemplate={this.renderHeader.bind(this)}
                fieldTemplate={this.renderField.bind(this)}
                footerTemplate={this.renderFooter.bind(this)}
            />
        );
    }


    renderField(settings)
    {
        const {selectedItem, defaultText, getLabel} = settings;

        return (
            <View style={[styles.fieldContainer]}>
                <Text style={{color:'#444'}}>{!selectedItem ? defaultText : getLabel(selectedItem)} <Image style={{ tintColor: '#8a919a'}} source={require('assets/images/tech-picker/down-arrow.png')} /></Text>
            </View>
        )
      }


    renderHeader()
    {
        if (! this.props.prompt) {
            return;
        }

        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{this.props.prompt}</Text>
            </View>
        )
    }
    

    renderOption(settings)
    {
        const {item, getLabel} = settings;

        return (
            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>{getLabel(item)}</Text>
            </View>
        )
    }

    renderFooter()
    {
        return (
            <View style={{marginBottom: 10}}></View>
        )
    }
}

TechPicker.defaultProps = {
    options: []
}

export default TechPicker;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 50, 
        marginBottom: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc'
    },
    headerText: {
        fontSize: 18, 
        fontWeight: 'bold'
    },
    optionContainer: {
        borderWidth: 1, 
        borderColor: '#9eceff', 
        marginHorizontal: 10, 
        marginVertical: 4, 
        borderRadius: 6, 
        justifyContent: 'center', 
        alignItems:'center', 
        flexDirection: 'row'
    },
    optionText: {
        color: '#0b76ff',
        alignSelf: 'flex-start', 
        paddingVertical: 10, 
        paddingHorizontal: 10
    },
    fieldContainer: {
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});