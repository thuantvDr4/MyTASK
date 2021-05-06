
import {Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
export default {
    container: {
        flex: 1,
        width:'100%'
    },
    filterContainer : {
        height:72,
        minHeight:72,
        backgroundColor:'#0B76FF',
        paddingVertical:9,
        paddingHorizontal:24,
        justifyContent: 'center',
        alignItems: 'center',
    },

    innerFilter : {
        flex: 1,
        flexDirection:'row'
    },

    dayContainer : {
        flex:7,
        height:40,
        minHeight:40,
        backgroundColor:"#9EC9FF",
        borderRadius:6,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight:14,
    },
    txtDay : {
        fontSize:14,
        fontWeight:'500',
        color:"#FFFFFF"
    },
    btnFilterContainer : {
        flex:2,
        flexDirection:'row',
        height:40,
        minHeight:40,
        borderRadius:6,
        borderWidth:1,
        borderColor:'#C2D0E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtFilter : {
        fontSize:14,
        fontWeight:'500',
        color:"#FFFFFF",
        marginRight:10
    },
    iconFilter : {
        height:16,
        width:16,
    },

    statusContainer : {
        flexDirection:'row',
        height:40,
        minHeight:40,
        paddingHorizontal:24,
        paddingVertical:10,
        backgroundColor:"#FFFFFF"
    },

    statusTitle: {
        color:'#9A9A9A',
        fontSize:12,
        marginRight:5
    },
    statusValue:{
        color:'#444444',
        fontSize:12,
        fontWeight:'500'
    },
    scrollView: {
        flex: 1,
        backgroundColor:'#FFFFFF',
        paddingHorizontal:24,
    },
    oneList : {
        marginTop:15,
    },
    infoBox : {
        paddingHorizontal:10,
        paddingVertical:6,
        borderWidth:1,
        borderColor:'#C2D0E2',
        borderRadius:6,
        backgroundColor:'#FFFFFF',
    },
    oneInfo : {
        // flex:1,
        flexDirection:'row',
    },
    oneAddress : {
        flex:2,
        flexDirection:'row'
    },
    infoTitle : {
        flex:2,
        fontSize:12,
        textAlign:'left',
        color:'#A9A9A9'
    },
    infoValue : {
        flex:3,
        fontSize:12,
        fontWeight:'500',
        textAlign:'right',
        color:'#444444'
    },
}
