
import {Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
export default {

    container: {
        flex: 1,
    },
    innerContainer: {
        flex: 1,
        paddingRight:24,
        paddingLeft:24,
        backgroundColor: 'green'
    },

    formTitleContainer : {
        // flexGrow: 1,
        marginTop: 15,
        marginBottom: 10,
        // paddingVertical:16,
        justifyContent:'center',
    },
    txtTitle : {
        fontSize:14,
        fontWeight:'500',
        color:'#444444'
    },
    formInputContainer : {
        flexGrow: 1,
        width:'100%',
        backgroundColor:'#FFFFFF'
    },
    oneFormBox : {
        height:40,
        flexDirection:'row',
        borderWidth:1,
        borderColor:'#D0D8E2',
        borderRadius:6,
        padding:12,
        marginBottom:12
    },
    formLabel : {
        flex:1,
        height:14,
        fontSize:12,
        color:'#9A9A9A',
        textAlign:'left'
    },
    formInput : {
        fontSize:12,
        height:14,
        flex:1,
        textAlign:'right'
    },
    formLabelRight : {
        flex:1,
        height:14,
        fontSize:12,
        color:'#444444',
        textAlign:'right'
    },
    btnContainer : {
        flex:0.1,
        paddingTop:5,
        paddingHorizontal:24,
    },
    btnBox : {
        height:45,
        borderWidth:1,
        borderColor:'#9EC9FF',
        borderRadius:6,
        backgroundColor:'#0B76FF',
        justifyContent:'center',
        alignItems:'center',
        paddingBottom:5,
    },
    txtBtn : {
        fontSize:18,
        fontWeight:'500',
        color:'#FFFFFF'
    }

}