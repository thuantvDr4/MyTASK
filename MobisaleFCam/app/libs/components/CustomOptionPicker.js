
/*
*thuantv -create: 07/10/2020
* Customize options picker
* */
import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import { CustomPicker } from 'react-native-custom-picker'
import {images} from '../../assets';
import {strings} from 'locales/i18n';



/*
*
* */
const CustomOptionPicker =({onValueChange, label='label',isValid,
                         placeHolder='placeHolder', value,
                         titleHeader,optionList,imageName,
                         mainStyle,labelStyle, valueStyle})=>{

    /*
    * renderHeader-popup
    * */
    const renderHeader =()=> {
        return (
            <View style={styles.headerSelect}>
                <Text style={[styles.title_header_txt,]}>{''+ titleHeader}</Text>
                <Image resizeMode='cover' style={{ height:16, width:16}} source={images.iconClose}/>
            </View>
        )
    };


    /*
    * field-render
    * */
    const renderField =()=> {
        return (
            <View style={[styles.container,
                {borderColor: isValid &&!value? '#FF5252' : !isValid &&!value? '#C2D0E2' : '#C2D0E2'},
                mainStyle]}>
                {/**..left..*/}
                <View style={[styles.left_ctn,]}>
                    <Text style={[ styles.label_txt, labelStyle, ]}>{`${label}`}</Text>
                </View>
                {/**..right..*/}
                <View style={[styles.right_ctn]}>
                    <Text style={[ styles.value_txt, {color: isValid && !value? '#FF5252' : '#444444'}, valueStyle]}>
                        { value? `${value}` : placeHolder }
                    </Text>

                    <Image style={[styles.image_ctn, {height:10, width:10}]}
                           source={imageName? imageName : images.iconArrowDown}  resizeMode={'contain'}/>
                </View>

            </View>
        )
    };



    /*
    * render item
    * */
    const renderOption =(settings)=> {
        const { item, getLabel } = settings;
        return (
            <View style={styles.optionContainer}>
                <View style={styles.oneOption}>
                    <Text style={styles.labelOption}>{getLabel(item)}</Text>
                </View>

            </View>
        )
    };



    /*
    * RETURN
    * */
    return (
        <CustomPicker
            // placeholder={placeholder}
            modalStyle={!optionList? styles.modalEmpty_ctn : styles.modal_ctn}
            options={optionList}
            getLabel={item => item.label}
            fieldTemplate={renderField}
            optionTemplate={renderOption}
            headerTemplate={renderHeader}
            onValueChange={onValueChange}
        />
    )
}

//
const styles = StyleSheet.create({
    container:{
        flexGrow:1,
        height:40,
        borderRadius:6,
        borderColor: '#C2D0E2',
        borderWidth:1,
        backgroundColor: '#FFFFFF',
        flexDirection:'row',
        justifyContent:'space-between'
    },

    left_ctn:{
        flex: 1,
        justifyContent:'center',
        marginLeft:12,
        marginRight:6,
    },
    right_ctn:{
        flex: 1,
        flexDirection:'row',
        justifyContent:'flex-end',
        alignItems:'center',
        marginRight: 12,
        marginLeft: 6,
    },
    label_txt:{
        color: '#9A9A9A',
        fontSize: 12,
        fontWeight: '400',
    },
    value_txt:{
        color: '#444444',
        textAlign:'center',
        marginRight: 8,
        fontSize: 12,
        fontWeight: '500'
    },

    image_ctn:{
        alignSelf:'center',
        tintColor: '#9A9A9A',
    },

    modal_ctn:{
        borderRadius: 6,
    },
    modalEmpty_ctn:{
        borderRadius: 6,
        flexGrow: 0.3
    },

    headerSelect : {
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding:12,
        borderBottomWidth:1,
        borderBottomColor: '#C2D0E2',
        marginBottom:12,
    },
    title_header_txt : {
        flex:8,
        textAlign:'center',
        color: '#444444',
        fontSize: 18,
        fontWeight: '500'
    },
    optionContainer : {
        paddingRight:19,
        paddingLeft:19,
        paddingBottom:12,
    },
    oneOption : {
        height:48,
        borderWidth:1,
        borderRadius:5,
        borderColor: '#9EC9FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    labelOption : {
        color: '#0B76FF',
        textAlign:'center',
        fontSize:16
    },
});



export default CustomOptionPicker;
