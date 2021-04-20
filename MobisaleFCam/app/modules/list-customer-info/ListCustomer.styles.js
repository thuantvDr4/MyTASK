
import {Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
import {Platform} from 'react-native';

export default {
    container: {
        flex: 1,
        width:'100%'
    },

    headerContainer : {
        height:46,
        flexDirection:'row',
        backgroundColor:'#0B76FF',
        paddingTop:8,
        paddingBottom:8,
        paddingRight:19,
        paddingLeft:19,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxIconLeft : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxIconRight : {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    boxHeaderTitle : {
        flex:8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtHeaderTitle : {
        fontSize:24,
        fontWeight:'500',
        color:'#FFFFFF'

    },
    listInfoContainer : {
        flex:12,
        position:'relative',
        backgroundColor:'#F8F9FB'
    },
    scrollView: {
        flexGrow: 1,
        paddingTop: 16,
    },
    filterContainer : {
        height:94,
        paddingHorizontal:32,
        backgroundColor:'#0B76FF',
    },
    filterContainer2: {
        paddingHorizontal:24,
        backgroundColor:'#0B76FF',
    },
    searchContainer : {
        paddingBottom:16, paddingRight:32, paddingLeft:32,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor:'#0B76FF',
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
        height:40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconSearch : {
        height:16,
        width:16
    },
    inputSearchBox : {
        flex:6,
        height:40,
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerInputSearchBox : {
        flex:1,
        height:40,
        justifyContent: 'space-between',
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
    filterTypeBox : {
        height: 54,
        // paddingHorizontal: 5,
        justifyContent: 'center', alignItems: 'center',
    },
    row: {
        flexDirection:'row', alignItems: 'center',
        marginHorizontal: -5,
    },
    col: {
        flex: 1/3,
        paddingHorizontal: 5,
    },
    btnFilterActive : {
        backgroundColor: '#FFFFFF',
        borderWidth:0
    },
    btnFilterType : {
        width:'100%', height:32, 
        justifyContent: 'center', alignItems: 'center',
        borderWidth:1, borderColor:'#9EC9FF', borderRadius: 20
        
    },
    textFilterType : {
        fontSize:12,
        color:'#9EC9FF'
    },
    textFilterTypeActive: {
        fontSize:12,
        color:'#0B76FF'
    },
    innerInfo : {
        paddingLeft:24,
        paddingRight:24,
    },
    btnAddBox : {
        position:'absolute',
        bottom:0,
        right:0
    },
    oneList : {
        // height:185,
        marginHorizontal:24,
        // marginTop:15,
        marginBottom: 12,
    },
    infoBox : {
        // height:155,
        paddingLeft:10, paddingRight:10, paddingTop:6, paddingBottom:0,
        borderWidth:1, backgroundColor:'#FFFFFF',
        borderBottomWidth:0, borderTopLeftRadius:6, borderTopRightRadius:6,
        borderColor:'#C2D0E2',
    },
    oneInfo : {
        flex:1, flexDirection:'row',
        marginBottom: 8,
    },
    oneAddress : {
        flex:2, flexDirection:'row',
        marginBottom: 10,
    },
    infoTitle : {
        flex:1,
        fontSize:12,
        textAlign:'left',
        color:'#A9A9A9'
    },
    infoValue : {
        flex:2,
        fontSize:12,
        fontWeight:'500',
        textAlign:'right',
        color:'#444444'
    },

    infoValuePaid : {
        flex:2,
        fontSize:12,
        fontWeight:'500',
        textAlign:'right',
        color:'#83d300'
    },

    infoValueNotPaid : {
        flex:2,
        fontSize:12,
        fontWeight:'500',
        textAlign:'right',
        color:'#ff5050'
    },
    createBox : {
        height:35,
        justifyContent: 'center',
        backgroundColor:'#FFFFFF',
        borderWidth:1, borderColor:'#C2D0E2', 
        borderBottomLeftRadius:6, borderBottomRightRadius:6,
    },
    btnCreate : {
        paddingLeft:54, paddingRight:54,

        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                paddingVertical:5,
            },
            android: {
                paddingVertical:9,
            },
        }),
    },
    txtBtnCreate : {
        color:'#3F93FF',
        fontSize:14,
        fontWeight:'500',
    },
    dataEmpty: {
        flex: 1,
    },
    wrapImage: {
        flex: 2/3,
        justifyContent: 'center',
        alignItems: 'center',
    },
}