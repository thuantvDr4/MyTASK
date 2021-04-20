
/*
* thuantv-edit-29/09/2020
* */
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {images} from "assets/";


//
const DateTimePicker =({ mode='date', label, placeholder, value='', getDate, isValid, mainStyle, isError = false})=> {
    //
    const [isShow, setIsShow] = useState(false);

    function onConfirm (date) {
        setIsShow(false);

        getDate(date);
    }

    function showPicker () {
        setIsShow(true)
    }

    function hidePicker () {
        setIsShow(false)
    }

    //
    return (
        <View style={[{flex:1}]}>
            <View style={[ isError|| isValid && !value? styles.container_err :styles.Container, mainStyle ]}>
                {/*.. Left label..*/}
                <View style={styles.leftContainer}>
                    <Text style={styles.label}>{label}</Text>
                </View>

                {/*.. dateTime..*/}
                <TouchableOpacity style={styles.right_ctn} onPress={showPicker}>
                    <Text style={ isError || isValid && !value? styles.value_txt_err : styles.value_txt}>{ value? value : placeholder }</Text>
                    <Image source={images.iconArrowDown} resizeMode={'cover'} style={styles.icon_image}/>
                </TouchableOpacity>
            </View>

            {/*....*/}
            <DateTimePickerModal
                display={'spinner'}
                isVisible={isShow}
                confirmTextIOS={'Choose'}
                cancelTextIOS={'Cancel'}
                mode= {mode}
                onConfirm={onConfirm}
                onCancel={hidePicker}
            />

        </View>

    )
}

const styles = StyleSheet.create({
    Container:{
        flexGrow:1,
        height: 40, borderRadius: 6,borderColor: '#D0D8E2', borderWidth: 1,
        backgroundColor: '#ffffff', flexDirection: 'row',
        marginVertical: 0,
    },
    leftContainer:{
        flex:1,
        justifyContent:'center',
        marginLeft:8,
    },
    right_ctn:{
        flex:3,
        alignItems:'center',
        marginRight:8,
        flexDirection: 'row',
    },
    value_txt:{
        flex:1,
        color:'#444444',
        fontSize:12,
        fontWeight: '500',
        textAlign: 'right',
    },
    label:{
        color:'#A9A9A9',
        fontSize:12,
    },
    icon_image:{
        width:10,
        height: 10,
        alignSelf:'center',
        marginLeft: 8,
        tintColor: '#8a919a',
    },
    container_err:{
        flex:1,
        height: 40, borderRadius: 6,borderColor: '#ff5050', borderWidth: 1,
        backgroundColor: '#ffffff', flexDirection: 'row',
        marginVertical: 0,
    },
    value_txt_err:{
        flex:1,
        color:'#ff5050',
        fontSize:12,
        fontWeight: '500',
        textAlign: 'right',
    }
});

export default DateTimePicker;
