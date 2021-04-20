
// LIB
import { Platform } from 'react-native';

export default {
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB'
    },
    headerContainer : {
        height:162, paddingTop: Platform.OS === 'ios' ? 32 : 22,
        width:'100%',
    },
    headerContainerX : {
        height:180, paddingTop: 45,
        width:'100%',
    },
    headerTop : {
        flexDirection:'row',
        paddingHorizontal: 16,
    },

    headerMenu : {
        flex:1,
    },
    headerIcon : {
        flex:2, alignItems: 'center',
        marginTop: 3
    },
    headerNotify : {
        flex:1,
        headerBackground: 'red',
    },
    headerNotifyImg : {
        alignSelf: 'flex-end',
    },
    headerNotifyDot : {
        height: 16, minWidth: 20, paddingHorizontal: 2,
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', top: -6, right: -9,
        backgroundColor: '#F20000',
        borderRadius: 8, borderWidth: 2, borderColor: '#0B76FF'
    },
    headerNotifyText: {
        marginTop: Platform.OS === 'ios' ? 1 : 0,
        marginBottom: Platform.OS === 'ios' ? 0 : 1,
        marginLeft: Platform.OS === 'ios' ? 1 : 0,
        fontSize: Platform.OS === 'ios' ? 9 : 10, 
        fontWeight: '700',
        color: '#fff'
    },
    oneHeader : {
        // flex:1, // justifyContent: 'center',
        alignItems: 'center'
    },

    headerBackground : {
        flex:1,
    },
    headerBackgroundImg : {
        flex: 1,
    },

    headerInfoName : {
        marginTop: 15,
        color:'#FFFFFF',
        fontSize:20,
        fontWeight:'500'
    },
    headerInfoPosition : {
        color:'#9EC9FF',
        fontSize:14,
    },

    infoContainer : {
        // height:175,
        // paddingHorizontal: 16,
    },
    titleContainer : {
        flex:1,
        paddingTop:24,
        marginBottom: 10, 
    },

    title : {
        color:'#444444',
        fontSize:18,
        fontWeight:'500'
    },

    contentInfoContainer : {
        flex:6, 
        paddingVertical:10, paddingHorizontal: 8, 
        marginBottom: 16, marginHorizontal: 8,
        borderRadius: 5,
        backgroundColor:'#fff',
        // shadowColor: '#C2D0E2',
        // shadowOffset: {
        //     width: 0,
        //     height: 5
        // },
        // shadowRadius: 5,
        // shadowOpacity: 1.0,
        // elevation: 3,
    },

    oneContent : {
        flex : 1,
        flexDirection:'row'
    },

    oneInfoLeft : {
        flex:1, marginBottom: 6,
        fontSize:14,
        color:'#9A9A9A',
    },

    oneInfoRight : {
        flex:2,
        marginBottom: 6,
        color:'#444444',
        fontSize:14, fontWeight:'500', textAlign:'right'
    },

    functionContainer : {
        // height:241,
        // paddingHorizontal: 16,
        paddingBottom:23
    },

    titleFunctionContainer : {
        // height:21,
        marginBottom: 6,
    },

    bodyFunctionContainer : {
        // height:328,
    },

    oneRowFunction : {
        // height:100,
        flexDirection:'row',
        paddingHorizontal: 4,
    },

    oneFunctionContainer : {
        flex:1, padding: 4,
    },

    oneFunction : {
        flex:1, justifyContent: 'center', alignItems: 'center',
        paddingTop: 20, paddingBottom: 10,
        borderWidth:1,
        borderRadius: 5,
        borderColor: '#ddd',
        backgroundColor:'#FFF',
        shadowColor: '#C2D0E2',
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowRadius: 5,
        shadowOpacity: 1.0,
        elevation: 3,
    },

    imgFunction : {
        width:40,
        height:40
    },
    titleFunction : {
        color:'#444444',
        fontSize:14,
        fontWeight:'500',
        paddingTop:14,
        textAlign:'center',
    },
    bottomContainer : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomImg : {
        width:56,
        height:56,
        position:'absolute',
        bottom:-20
    },
    avatarImage:{
        width:64, 
        height:64,
        borderRadius:32
    },

    // NOTIFICATION LIST
    dataEmpty: {
        flex: 1,
    },
    wrapImage: {
        flex: 2/3,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listNotiContainer : {
        flex:1, 
        paddingHorizontal: 0,
        position:'relative',
        backgroundColor:'#F8F9FB'
    },
    oneList: {
        marginBottom: 12,
    },
    oneListWrap: {
        flexDirection: 'row',
        position: 'relative'
    },
    oneIco: {
        width: 24, justifyContent: 'center', alignItems: 'center',
        position: 'absolute', left: 0, top: 2
    },
    oneInfo: {
        flex: 1, flexDirection: 'column', justifyContent: 'flex-start',
        paddingLeft: 40,
    },
    oneInfoWrap: {
        borderBottomWidth: 1, borderBottomColor: '#C2D0E2',
        paddingBottom: 10, 
    },
    oneInfoWrapLast: {
        borderBottomWidth: 0,
    },
    infoTitle: {
        minHeight: 25,
        // marginBottom: 5,
        fontWeight: '700',
        fontSize: 14
    },
    infoContent: {
        marginBottom: 4, minHeight: 20,
        flex: 1,
        justifyContent: 'center'
    },
    infoTime: {
        fontSize: 10,
        color: '#4D78B0'
    },
    infoText: {
        fontSize: 12
    },
    infoShowMore: {
        fontSize: 10,
        color: '#4D78B0'
    },
    icoNoti: {
        
    },
    notiBlock: {
        paddingRight: 10,
    },
    notiButton: {
        position: 'relative', top: 2
    },
    notiIcon: {
        position: 'relative', zIndex: 0,
    },
    notiDot: {
        height: 16, minWidth: 20, paddingHorizontal: 2,
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', top: 0, left: 10, zIndex: 1,
        backgroundColor: '#F20000', 
        borderRadius: 7, borderWidth: 2, borderColor: '#0B76FF'
    },
    notiText: {
        marginTop: Platform.OS === 'ios' ? 1 : 0,
        marginBottom: Platform.OS === 'ios' ? 0 : 1,
        marginLeft: Platform.OS === 'ios' ? 1 : 0,
        fontSize: Platform.OS === 'ios' ? 9 : 10, 
        fontWeight: '700',
        color: '#fff'
    }
};

// headerNotifyDot : {
//     height: 16, minWidth: 20, paddingHorizontal: 4,
//     justifyContent: 'center', alignItems: 'center',
//     position: 'absolute', top: -6, right: -9,
//     backgroundColor: '#F20000',
//     borderRadius: 8, borderWidth: 2, borderColor: '#0B76FF'
// },
// headerNotifyText: {
//     marginTop: Platform.OS === 'ios' ? 1 : 0,
//     marginBottom: Platform.OS === 'ios' ? 0 : 1,
//     marginLeft: Platform.OS === 'ios' ? 1 : 0,
//     fontSize: Platform.OS === 'ios' ? 7 : 10, 
//     fontWeight: '700',
//     color: '#fff'
// },