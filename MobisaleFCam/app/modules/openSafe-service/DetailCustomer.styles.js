
import {Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
export default {
    container: {
        flex: 1, width:'100%'
    },
    wrapperOne: {
        flex:1, flexDirection:'row',
        marginBottom: 8,
    },
    styleLabel: {
        flex:1, fontSize:12, textAlign:'left', color:'#A9A9A9'
    },
    styleValue: {
        flex:2,
        fontSize:12,
        fontWeight:'500',
        textAlign:'right',
        color:'#444444'
    },
    wrapperTotal: {
        height:40, minHeight: 40,
        flexDirection:'row', justifyContent: 'space-between',
        paddingHorizontal:12,
        alignItems: 'center',
        borderWidth:1,
        borderColor:'#9EC9FF', borderTopWidth:0,
        borderBottomLeftRadius:6, borderBottomRightRadius:6,
        backgroundColor:'#9EC9FF',
    },
    styleLabelTotal: {
        fontSize:14,
        fontWeight:'500',
        color:'#323232',
    },
    styleValueTotal: {
        fontSize:18,
        fontWeight:'500',
        color:'#0B76FF'
    },
    scroolView: {
        paddingHorizontal:24,
        backgroundColor:'#FFFFFF',

    },
    titelBookport: {
        height: 18,
        fontSize:14,
        fontWeight:'500',
        color:'#444444',
    },
    titleBox: {
        flexDirection:'row',
        marginTop: 16, marginBottom: 8,
    },
    titleLeft: {
        flex:1,
        fontSize:14, fontWeight:'500', color:'#444444',
    },
    titleRight: {
        flex:1,
        fontSize:14, fontWeight:'500', color:'#0B76FF',
    },
    inner: {
        borderWidth:1, borderColor:'#9EC9FF', borderRadius:6,
        paddingTop: 10, paddingHorizontal: 12,
        backgroundColor:'#FFF'
    },
    innerbookport: {
        height:38,
        borderWidth:1, borderColor:'#9EC9FF', borderRadius:6,
        paddingHorizontal:12, paddingTop: 8,
        backgroundColor:'#FFF'
    },
    innerMid: {
        // height:266,
        borderWidth:1,
        borderBottomWidth:0,
        borderTopLeftRadius:6,
        borderTopRightRadius:6,
        borderColor:'#9EC9FF',
        // paddingHorizontal: 12,
        paddingTop: 10, paddingBottom: 3,
        backgroundColor:'#FFF'
    },
    lineMid: {
        borderTopWidth:1, borderTopColor:'#9EC9FF',
        marginBottom: 10, marginTop: 4,
    },
    btnContainer: {
        height:48, marginTop:12,
        justifyContent:'center', alignItems:'center',
        backgroundColor:'#0B76FF',
        borderRadius:6,
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
        fontSize:18,
        fontWeight:'bold',
        color:'#FFFFFF'
    }
}
