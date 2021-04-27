var { StyleSheet, } = require('react-native');
import Dimensions from 'Dimensions';

const DEVICE_WIDTH = Dimensions.get('window').width;

const styles = StyleSheet.create({
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
    textInputMultiline: {
        minHeight: 40,
        paddingRight: 12,
        paddingVertical: 10,
        paddingLeft: DEVICE_WIDTH * 35 / 100,
        fontSize: 12,
        borderColor: 'transparent',
        borderWidth: 0,
        color: '#444444',
    },
    plfake: {
        color: '#9A9A9A',
        position: 'absolute',
        top: '50%', left: 12,
        marginTop: -8
    
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
        width: DEVICE_WIDTH/2.85 - 48/3,
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
    }
});

export default styles;