/*
* thuantv-editor-29/09/2020
*
* */

import * as React  from 'react';
import { Text, View, TouchableOpacity, StyleSheet} from 'react-native';


//
const RowInfo =({label='label', value='', disabled= true,
                    onPress, borderColor,
                    styLabel, styleValue, mainStyle})=>{


    /*Todo: RETURN*/
    return (
        <View style={borderColor? [styles.View_border_ctn, {borderColor: borderColor}, mainStyle] : [styles.view_ctn, mainStyle]}>
            <View style={{flex:2}}>
                <Text style={[styles.label_txt, styLabel ]}>{`${label}`}</Text>
            </View>

            <TouchableOpacity disabled={disabled} onPress={onPress} style={[styles.touch_ctn]}>
                <Text style={[styles.value_txt, styleValue ]}>{`${value || ''}`}</Text>
            </TouchableOpacity>
        </View>
    );
}

//===>
const styles = StyleSheet.create({
    view_ctn:{
        flexGrow:1,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    View_border_ctn:{
        height: 50,
        flexGrow:1,
        backgroundColor: '#FFFFFF' ,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        borderRadius: 6,
        borderWidth:1,
        borderColor: '#C2D0E2',
        paddingHorizontal: 12
    },

    label_txt:{
        color: '#9A9A9A',
        fontSize: 12,
        fontWeight: '400'
    },
    value_txt:{
        fontWeight: '500',
        color:'#444444',
        fontSize: 12,
        textAlign:'right'
    },
    touch_ctn:{
        flex:3,
        alignItems:'flex-end',
    },

});

export default RowInfo;
