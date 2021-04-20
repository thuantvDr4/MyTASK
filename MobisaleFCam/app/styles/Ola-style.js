import React from 'react';
import {StyleSheet} from 'react-native'
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({

    // color
    clw: { color: '#FFF' },
    clBlue: { color: '#397af8' },
    clBlueDark: { color: '#0B76FF' },
    cl444: { color: '#444444' },

    bgw: { backgroundColor: '#FFF' },

    // size
    fs12: { fontSize: 12 },
    fs14: { fontSize: 14 },
    fs16: { fontSize: 16 },
    fs18: { fontSize: 18 },
    fs30: { fontSize: 30 },
    fs38: { fontSize: 38 },

    // weight
    fw100: { fontWeight: '100' }, // Thin
    fw200: { fontWeight: '200' }, // Ultra Light
    fw300:{ fontWeight: '300' }, // Light
    fw400:{ fontWeight: '400' }, // Regular
    fw500:{ fontWeight: '500' }, // Medium
    fw600:{ fontWeight: '600' }, // Semibold
    fw700:{ fontWeight: '700' }, // Bold
    fw800:{ fontWeight: '800' }, // Heavy
    fw900: { fontWeight: '900' }, // Black

    // text Align
    txtR: { textAlign: 'right' },
    txtL: { textAlign: 'left' },
    txtC: { textAlign: 'center' },

    // distance
    mgt00: { marginTop: 0 },
    mgt05: { marginTop: 5 },
    mgt10: { marginTop: 10 },
    mgt15: { marginTop: 15 },
    mgt20: { marginTop: 20 },
    mgt25: { marginTop: 25 },

    mgbt05: { marginBottom: 5 },
    mgbt10: { marginBottom: 10 },
    mgbt15: { marginBottom: 15 },

    pdt00: { paddingTop: 0 },
    pdt10: { paddingTop: 10 },

    pdbt05: { paddingBottom: 5 },
    pdbt10: { paddingBottom: 10 },
    pdbt20: { paddingBottom: 20 },

    // position
    posAB: { position: 'absolute' },

    // border
    borderValid: { borderWidth: 1, borderColor: 'red', },

    // button
    btnFull: {
        width: DEVICE_WIDTH - 48, height: 48,
        justifyContent: 'center', 
        alignItems: 'center',
		borderRadius: 6,
        borderColor: '#0B76FF',
        backgroundColor: '#0B76FF',
        borderWidth: 1,
    },

    btnFullLine: {
        width: DEVICE_WIDTH - 48, height: 48,
        justifyContent: 'center', 
        alignItems: 'center',
		borderRadius: 6,
        borderColor: '#0B76FF',
        backgroundColor: '#FFF',
        borderWidth: 1,
    },

    btnFullLineDisab: {
        width: DEVICE_WIDTH - 48, height: 48,
        justifyContent: 'center', 
        alignItems: 'center',
		borderRadius: 6,
        borderColor: '#C2D0E2',
        backgroundColor: 'rgba(1, 1, 1, 0)',
        borderWidth: 1,
    },

    btnShadow: {
        shadowColor: '#9EC9FF',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowOpacity: 1,
        shadowRadius: 20,
        elevation: 5,
    },

    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700'
    },

    btnTextLine: {
        color: '#0B76FF',
        fontSize: 18,
        fontWeight: '700'
    },

    btnTextLineDisab: {
        color: '#A9A9A9',
        fontSize: 14,
    },

    // no data
    dataEmpty: {
        flex: 1,
    },
    wrapImage: {
        flex: 2/3,
        justifyContent: 'center',
        alignItems: 'center',
    },


    // ---------------------
    // --------------------- field 
    // ---------------------
    container_keyboard: {
        flex: 1,
    },
    wrapper_scrollview: {
        flexGrow: 1
    },
    inner_scrollview: {
        flex: 1, paddingHorizontal: 24
    },
    wrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: "flex-start",
        backgroundColor: '#fff',
    },

    inner: {
        flex: 1,
        width: DEVICE_WIDTH, 
        paddingHorizontal: 24,
        backgroundColor: '#fff',
    },

    keyboardWrap: {
        flex: 1,
    },

    rows: {
        flexDirection: 'row',
        marginHorizontal: -8,
    },

    cols: {
        width: '50%', 
        paddingHorizontal: 8,
    },

    headline: {
        marginBottom: 10,
    },

    field: {
        marginBottom: 12,
        paddingLeft: 0,
        backgroundColor: '#fff',
        borderColor: '#D0D8E2',
        borderWidth: 1,
        borderRadius: 6
    },

    field_col: {
        marginBottom: 12,
        paddingLeft: 0,
        backgroundColor: '#fff',
        borderColor: '#D0D8E2',
        borderWidth: 1,
        borderRadius: 6
    },

    textInput: {
        height: 40,
        paddingRight: 12,
        paddingLeft: 12,
        fontSize: 12,
        borderColor: 'transparent',
        borderWidth: 0,
        color: '#444444',
    },

    plfake: {
        color: '#9A9A9A',
        position: 'absolute', zIndex: 1,
        top: '50%', left: 12,
        marginTop: -8
    },

    // Normal field
    nm_cols: {
        
    },
    nm_field: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5
    },
    nm_label: {
        color: '#9A9A9A'
    },
    nm_value: {
        color: '#000',
    },

    // ---------------------
    // --------------------- table
    // ---------------------
    tableContainer: {
        borderColor: '#C2C2C2',
        borderTopWidth: 1,
        borderLeftWidth: 1,
    },
    tHead: {
        backgroundColor: '#397af8',
    },
    tBody: {

    },
    tR: {
        flexDirection: 'row',
    },
    tH: {
        flexDirection: 'row',
    },
    tD: {

    },
    tHColor: {
        color: '#fff'
    },
    tRColor: {
        color: '#fff'
    },
    tDborder: {
        borderColor: '#C2C2C2',
        borderRightWidth: 1,
        borderBottomWidth: 1,
    },



    // Navigation tab
    nv_container: {
        width: DEVICE_WIDTH,
        paddingHorizontal: 24,
        flexDirection: 'row',
        // justifyContent: 'flex-start',
        // alignContent: 'center',
        // alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },

    nv_btn_wrapper: {
        
    },

    nv_btn: {
        width: DEVICE_WIDTH/2.97 - 48/3,
        minHeight: 48,
        paddingLeft: 30, paddingRight: 20,
        justifyContent:'center',
    },

    nv_text: {
        color: '#C2D0E2',
        fontSize: 12
    },

    nv_text_act: {
        color: '#0B76FF',
        fontSize: 12
    },

    nv_circle: {
        width: 24, height: 24,
        justifyContent:'center',
        alignItems: 'center',
        position: 'absolute', top: '50%', left: 0, marginTop: -12,
        backgroundColor: '#C2D0E2',
        borderRadius: 24/2
    },

    nv_circle_act: {
        width: 24, height: 24,
        justifyContent:'center',
        alignItems: 'center',
        position: 'absolute', top: '50%', left: 0, marginTop: -12,
        backgroundColor: '#0B76FF',
        borderRadius: 24/2
    },

    nv_num: {
        color: '#FFF',
        fontSize:  14, fontWeight: 'bold',
    },

    scroll_container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#fff'
    },
    
    scroll_innerContainer: {
        flex: 1
    },

    // --------------------- dropdown fake
    drdfake: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 34,
    },

    // --------------------- dropdown select
    dD_container: {
        height: 40, paddingHorizontal: 12,
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 6
    },
    dD_text: { fontSize: 12, marginBottom: 1, marginRight: 15},
    dD_arrow: { position: 'absolute', right: 13, top: '50%', marginTop: -10 },
    dD_ico: { position: 'absolute', right: 12, top: '50%', marginTop: -5, width: 10, height: 10 },
    dD_headerContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 40, 
        marginBottom: 7, 
        borderBottomWidth: 1, 
        borderBottomColor: '#E7ECF3',
    },
    dD_headerText: {
        fontSize: 18, fontWeight: '500',
    },
    dD_exitHeaderSelect: {
        position: 'absolute',
            right: 22,
    },
    dD_optionContainer: {
        flexDirection: 'row',
        justifyContent: 'center', 
        alignItems:'center',  
        marginHorizontal: 19, marginVertical: 4, 
        paddingHorizontal: 0, paddingVertical: 13,
        borderWidth: 1, 
        borderColor: '#9EC9FF',
        borderRadius: 5, 
        
    },
    dD_optionText: {
        alignSelf: 'flex-start', 
        color: '#0B76FF', fontSize: 14,
    },
    dD_modal: {
        width: DEVICE_WIDTH - 10,
        position: 'absolute', left: 0,
        paddingBottom: 12, 
        borderRadius: 6,
    },
    dD_backDrop: {
        paddingHorizontal: 5, paddingVertical: 0,
    }
});

export default styles;