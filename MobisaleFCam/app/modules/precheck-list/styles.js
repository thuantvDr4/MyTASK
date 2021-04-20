var { StyleSheet } = require('react-native');
import {Platform} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width:'100%'
    },
    searchContainer : {
        height:72,
        backgroundColor:'#0B76FF',
        paddingBottom:16,
        paddingRight:32,
        paddingLeft:32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxSearch : {
        height:40,
        width:'100%',
        borderWidth:1,
        borderColor:'#FFFFFF',
        borderRadius:5,
        backgroundColor:'#FFFFFF',
    },
    viewInputSearch : {
        flex:1,
        flexDirection:'row',
    },
    iconSearchBox : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconSearch : {
        height:16,
        width:16
    },
    inputSearchBox : {
        flex:6,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerInputSearchBox : {
        flex:1,
        justifyContent: 'space-between',
        minHeight: 40,
    },
    inputSearch : {flex:1},
    searchBorder : {
        height:'80%',
        borderRightWidth:1,
        borderRightColor:'#C2D0E2'
    },
    iconFilterBox : {
        flex:1,
    },
    listInfoContainer : {
        flex:1,
        position:'relative',
        // paddingBottom:10,
        backgroundColor:'#F8F9FB'
    },
    scrollView: {
        paddingTop: 16,
    },
    btnAddBox : {
        position:'absolute',
        bottom:0,
        right:0
    },
    oneList : {
        // height:155,
        marginHorizontal:24,
        // marginTop:16,
        marginBottom: 12,
    },
    infoBox : {
        // height:115,
        paddingLeft:10, paddingRight:10, paddingTop:6, paddingBottom:0,
        borderWidth:1, borderColor:'#C2D0E2',
        borderBottomWidth:0, borderTopLeftRadius:10, borderTopRightRadius:10,
        backgroundColor:'#FFFFFF',
    },
    oneInfo : {
        flex:1, flexDirection:'row',
        marginBottom: 8,
    },
    oneAddress : {
        flex:1, flexDirection:'row',
        marginBottom: 15,
    },
    infoTitle : {
        flex:2/5, fontSize:12, color:'#A9A9A9', textAlign:'left'
    },
    infoValue : {
        flex:3/5,
        fontSize:12, fontWeight:'500', textAlign:'right', color:'#444444'
    },
    createBox : {
        height:35,
        justifyContent: 'center',
        borderWidth:1, borderColor:'#C2D0E2',
        borderBottomLeftRadius:10, borderBottomRightRadius:10,
        backgroundColor:'#FFFFFF',
        
    },
    btnCreate : {
        paddingLeft:54,
        paddingRight:54,
        ...Platform.select({
            ios: {
                paddingVertical:4,
            },
            android: {
                paddingVertical:9,
            },
        }),
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtBtnCreate : {
        color:'#3F93FF',
        fontSize:14,
        fontWeight:'500',
    },
    noData: {
        flex: 1,

    },
    dataEmpty: {
        flex: 1,
    },
    wrapImage: {
        flex: 2/3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Create Prechecklish
    infoContainer : {
        flex:1,
        position:'relative',
        paddingBottom:10,
        backgroundColor:'#F8F9FB'
    },
    scrollViewCreate: {
        paddingTop: 10
    },
    infoContact : {
        paddingLeft:10, paddingRight:10, paddingTop:6, paddingBottom:0,
        borderWidth:1, borderColor:'#C2D0E2',
        borderRadius:10,
        backgroundColor:'#FFFFFF',
    },
    headline: {
        marginBottom: 12,
    },
    textInput: {
        height: 40,
        paddingRight: 12,
        paddingLeft: 100,
        fontSize: 12,
        borderColor: 'transparent',
        borderWidth: 0,
        color: '#444444',
    },
    textArea: {
        height: 96,
        paddingTop: 12
    },


    // FILTER
    filterContainer : {
        flex: 1,
        paddingHorizontal: 24,
    },

    searchTitle : {
        fontSize:14,
        fontWeight:"500",
        color:"#444444",
        marginVertical:16
    },

    pickerFilter : {
        height:40,
        minHeight:40,
    },

    dayContainer : {
        flexDirection:'row',
        height:40,
        marginVertical: 8
    },

    btnFrom : {
        flex:1, flexDirection:'row',
        marginRight:5,alignItems:'center',
        borderWidth:1, borderRadius:6, borderColor:"#C2D0E2",
        backgroundColor: '#ffffff'
    },
    txt : {
        flex:1,
        fontSize:12,
        color:"#9A9A9A",
        marginHorizontal: 12
    },
    boxIcon : {
        flex:3,
        flexDirection:'row',
        justifyContent: 'flex-end',
        paddingHorizontal:8
    },
    txtDay : {
        fontSize:12,
        fontWeight:'500',
        color:"#444444",
        marginHorizontal:8
    },
    iconFilter : {
        height:16,
        width:16,
    },
    btnTo : {
        flex:1,
        flexDirection:'row', marginLeft:5, alignItems:'center',
        borderWidth:1, borderRadius:6, borderColor:"#C2D0E2",
        backgroundColor: '#ffffff'
    },

    btnContainer : {

    },

    innerBtn : {
        height:48,
        minHeight:48,
        backgroundColor:"#0B76FF",
        borderRadius:6,
        justifyContent:'center',
        alignItems:'center',
        marginHorizontal:24,
        marginVertical:18
    },

    txtBtn : {
        fontSize:18,
        fontWeight:'500',
        color:"#FFFFFF"
    },

    // 
    optionContainer: {
        flexDirection: 'row',
        minHeight: 48, marginBottom: 8,
        alignItems:'center', justifyContent: 'center', 
        borderRadius: 5, 
        borderWidth: 1, borderColor: '#C2D0E2', 
        backgroundColor: '#ffffff'
    },
    optionText: {
        alignSelf: 'flex-start', 
        paddingHorizontal: 10,
        color: '#C2D0E2',
        fontSize: 14, lineHeight: 48
    },
    optionIcon: {
        position: 'absolute', right: 15,
        color: '#C2D0E2',
    },
    optionBorderSeleted: {
        borderColor: '#0B76FF', 
    },
    optionTextSeleted: {
        color: '#0B76FF',
    },
});


export default styles;