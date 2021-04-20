import React from 'react';
import {View, Text, StyleSheet, Image } from 'react-native';
import {CustomPicker} from 'react-native-custom-picker';


const MenuSelectPicker =({optionList=[], modalTitle='Title', onValueChange })=> {

    // renderField
    const renderField =()=>{
        return (
            <View style={[styles.fieldContainer]}>
                <Image source={require('assets/images/contract/ic_Menu_right.png')} />
            </View>
        )
    }

    // renderOption
    const renderOption =(settings)=> {
        const {item, getLabel} = settings;

        return (
            <View style={styles.optionContainer}>
                <Text style={styles.optionText}>{getLabel(item)}</Text>
            </View>
        )
    }

    // renderHeader
    const renderHeader =()=> {
        return (
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>{modalTitle}</Text>
            </View>
        )
    }

    // renderFooter
    const renderFooter =()=> {
        return (
            <View style={{marginBottom: 10}}/>
        )
    }


    /*
    *
    * */
    return(
        <CustomPicker
            // placeholder={placeholder}
            modalStyle={styles.contentContainer}
            options={optionList}
            getLabel={(item) => item.label}
            fieldTemplate={renderField}
            optionTemplate={renderOption}
            headerTemplate={renderHeader}
            onValueChange={onValueChange}
            footerTemplate={renderFooter}
        />
    )
}

/*
* styles
* */
const styles = StyleSheet.create({
    contentContainer: {
        borderRadius: 5
    },
    headerContainer: {
        flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
        minHeight: 40,  marginBottom: 10,
        borderWidth: 1,  borderTopWidth: 0,
        borderColor: '#DDDDDD', borderTopColor: 'transparent',
        borderTopStartRadius: 5, borderTopEndRadius: 5,
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
})

export default MenuSelectPicker;
