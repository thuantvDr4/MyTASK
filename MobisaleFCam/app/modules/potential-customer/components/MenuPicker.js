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
    render() {
        return (
            <CustomPicker
                getLabel={item => item.label}
                {...this.props}
                optionTemplate={this.renderOption.bind(this)}
                headerTemplate={this.renderHeader.bind(this)}
                fieldTemplate={this.renderField.bind(this)}
                footerTemplate={this.renderFooter.bind(this)}
                modalStyle={[styles.contentContainer]}
            />
        );
    }


    renderField(settings) {
        return (
            <View style={[styles.fieldContainer]}>
                <Image source={require('assets/images/contract/ic_Menu_right.png')} />
            </View>
        )
    }


    renderHeader() {
        if (! this.props.prompt) {
            return;
        }

        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{this.props.prompt}</Text>
            </View>
        )
    }
    

    renderOption(settings) {
        const {item, getLabel} = settings;

        return (
            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>{getLabel(item)}</Text>
            </View>
        )
    }

    renderFooter() {
        return (
            <View style={{marginBottom: 10}}></View>
        )
    }
}

MenuPicker.defaultProps = {
    prompt: strings('contract.contract_detail.extens_feature'),
    options: [
        {Id: "", label: strings('contract.contract_detail.fn_appointment')},
        {Id: "", label: strings('contract.contract_detail.fn_update_amount')}
    ],
    onSelected: () => {}
}

export default MenuPicker;


const styles = StyleSheet.create({
    contentContainer: {
        borderRadius: 5
    },
    headerContainer: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center', 
        minHeight: 40,  marginBottom: 10, 
        borderWidth: 1,  borderTopWidth: 0, 
        borderColor: '#DDDDDD', borderTopColor: 'transparent',
        borderBottomLeftRadius: 5, borderBottomRightRadius: 5, borderTopStartRadius: 5, borderTopEndRadius: 5,
    },
    headerText: {
        fontSize: 18, fontWeight: '500'
    },
    optionContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems:'center', 
        marginHorizontal: 19, marginVertical: 4, 
        paddingHorizontal: 0, paddingVertical: 13,
        borderWidth: 1, 
        borderColor: '#9EC9FF',
        borderRadius: 5, 
    },
    optionText: {
        alignSelf: 'flex-start', 
        color: '#0B76FF', fontSize: 14,
    },
    fieldContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});