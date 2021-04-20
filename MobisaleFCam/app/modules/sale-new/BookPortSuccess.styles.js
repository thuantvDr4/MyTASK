import {
    StyleSheet,
} from 'react-native';

export default{
    container : {
        flex : 1,
        backgroundColor:'#FFFFFF',
        paddingLeft:24,
        paddingRight:24,
        paddingBottom:16,
        paddingTop:16
    },
    bodyContainer : {
        flex:8
    },
    title : {
        // height:16,
        justifyContent: 'center',
        paddingBottom:10,
        paddingTop:10,
    },
    txtTitle : {
        fontSize:14,
        fontWeight:'500',
        color:'#444444'
    },
    oneInfo : {
        height:40,
        flexDirection:'row',
        borderWidth: 1,
        borderRadius:5,
        borderColor:'#D0D8E2',
        padding:12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:5,
        marginTop:5
    },
    infoTitle : {
        flex:1,
        textAlign:'left',
        color:'#9A9A9A',

    },
    infoValue : {
        flex:1,
        textAlign:'right',
        color:'#444444',
    },
    oneCab : {
        flex:1,
        marginBottom:12,
    },
    selectCabContainer : {
        height:40,
        flex:1,
        borderWidth: 1,
        borderRadius:5,
        borderColor:'#D0D8E2',
        marginRight:5,
        justifyContent: 'center'
    },
    inputCabContainer : {
        height:40,
        flex:1,
        borderWidth: 1,
        borderRadius:5,
        borderColor:'#D0D8E2',
        marginLeft:5
    },
    txtInputCab : {
        padding:13
    },
    footerBtnContainer:{
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnBookport : {
        height:48,
        width:'100%',
        backgroundColor:'#0B76FF',
        borderRadius:5,
        justifyContent: 'center',
        alignItems: 'center',
    },

    txtBookport : {
        color:'#ffffff',
        fontSize:18,
        fontWeight:'500'
    },
};