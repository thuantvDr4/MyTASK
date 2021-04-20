import React from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {strings} from 'locales/i18n';

import {CustomPicker} from 'react-native-custom-picker';


/**
 * MenuPickup Component
 * 
 * - Document Readmore here: https://www.npmjs.com/package/react-native-custom-picker
 * - Common Properties and Events:
 * 
 * ############# Properties #############
 * 1. options: Array of options
 * 2. prompt: Header title
 * 
 * ############# Events #################
 * 1. onValueChange(value): Event when select change
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
class MenuPicker extends React.PureComponent
{
    render()
    {
        return (
            <CustomPicker
                getLabel={item => item.label}
                {...this.props}
                optionTemplate={this.renderOption.bind(this)}
                headerTemplate={this.renderHeader.bind(this)}
                fieldTemplate={this.renderField.bind(this)}
                footerTemplate={this.renderFooter.bind(this)}
            />
        );
    }


    renderField(settings)
    {
        return (
            <View style={[styles.fieldContainer]}>
                <Image source={require('assets/images/contract/ic_Menu_right.png')} />
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

MenuPicker.defaultProps = {
    prompt: strings('contract.contract_detail.extens_feature'),
    options: [
        {Id: "appointment", label: strings('contract.contract_detail.fn_appointment')},
        {Id: "ContractUpdateTotalAmount", label: strings('contract.contract_detail.fn_update_amount')}
    ],
    onSelected: () => {}
}

export default MenuPicker;


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
        fontSize: 14,
        alignSelf: 'flex-start', 
        paddingVertical: 16, 
        paddingHorizontal: 10
    },
    fieldContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});