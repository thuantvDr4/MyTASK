import {
    StyleSheet, Platform
} from 'react-native';

export default{
    container: {
        flex: 1,
        backgroundColor: '#0B76FF',
    },

    topContainer : {
        flex:2,
        width:'100%',
    },

    containerBtn : {
        flex:1,
        flexDirection :'row',
        backgroundColor: '#0B76FF',
        justifyContent: 'center',
        alignItems: 'center',
        paddingRight:20,
        paddingLeft:20
    },
    containerAddress : {
        flex:1,
        flexDirection :'row',
        backgroundColor: '#FFFFFF',
        paddingRight:20,
        paddingLeft:20
    },
    viewImgAddress : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imgAddress : {
        width:20,
        height:20
    },
    viewTxtAddress : {
        flex:8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtAddress : {
        alignSelf:'left',
    },

    oneTab : {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTab : {
        backgroundColor:'#0B76FF',
        borderWidth:1,
        borderColor:'#9EC9FF',
        width: 155,
        height:40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTabActive : {
        width: 155,
        height:40,
        borderRadius: 20,
        backgroundColor:'#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnTabActiveDisible : {
        width: 155,
        height:40,
        borderRadius: 20,
        backgroundColor:'rgba(255, 255, 255, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textTab : {
        fontSize:12,
        fontWeight:'500',
        color:'#9EC9FF'
    },
    textTabActive : {
        fontSize:12,
        fontWeight:'500',
        color:'#0B76FF'
    },
    textTabDisable: {
        fontSize:12,
        fontWeight:'500',
        color:'#FFF'
    },
    mainContainer : {
        flex:9,
        width:'100%',
        justifyContent: 'flex-end',
    },

    mapContainer : {
        ...StyleSheet.absoluteFillObject,
        backgroundColor:'#FFFFFF'
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },

    bottomContainer : {
        width:'100%',
        height:200,
        bottom: 20,
    },

    viewBottomContainer : {
        height:200,
        borderRadius:5,
        margin:10,
    },

    gpsContainer : {
        flex:1,
        flexDirection:'row',
        marginBottom: 3,
    },

    oneGps:{
        flex:1,
    },

    btnPoint : {
        width:115,
        height:32,
        borderWidth:1,
        borderColor:'#0B76FF',
        backgroundColor:'#ffffff',
        borderRadius:15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    textPoint : {
        color:'#0B76FF',
        fontSize:12,
    },

    btnGps : {
        width:32, height:32,
        backgroundColor:'#FFFFFF',
        borderRadius: 32,
        shadowColor: '#000000',
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 10,
        // opacity: 0.5,
        alignSelf: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
    },

    toolContainer : {
        flex:4,
        backgroundColor:'#FFFFFF',
        borderRadius:5,
        padding:10
    },

    addressContainer : {
        flex:2,
        flexDirection:'row',
    },
    oneAddress : {
        flex:1,
        flexDirection:'row',
        alignItems: 'center',
        marginLeft:10,
        marginRight:10,
    },

    oneImage : {
        flex:1,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },


    borderBottomAddress : {
        borderBottomColor: '#C2D0E2',
        borderBottomWidth: 1,
    },

    imgAddressContainer : {
        flex:1,
    },

    txtAddressContainer : {
        flex:9,
    },
    txtAddress : {
        color:'#444444',
        fontSize:12
    },

    btnToolContainer : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection:'row',
    },
    btnToolLeft : {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center',
    },

    btnToolRight : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnBookport : {
        width:105,
        height:40,
        backgroundColor:'#9EC9FF',
        borderRadius:50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    btnBookportActive : {
        width:105,
        height:40,
        backgroundColor:'#0B76FF',
        borderRadius:50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtBookport : {
        color:'#ffffff',
        fontSize:14,
        fontWeight:'500'
    },
    txtBookportActive : {
        color:'#ffffff',
        fontSize:14,
        fontWeight:'500'
    },

    customView : {
        width: 100,
        height: Platform.OS === 'ios' ? 60 : 70,
    }
};