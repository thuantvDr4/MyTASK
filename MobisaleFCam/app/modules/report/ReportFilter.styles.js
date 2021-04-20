
import {Dimensions} from 'react-native';
const { width, height } = Dimensions.get('window');
export default {
    container: {
        flex: 1,
        width:'100%',
        justifyContent:'space-between',
        backgroundColor:"#FFFFFF"
    },

    filterContainer : {
        marginHorizontal:24,
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
        minHeight:40,
        marginVertical:16
    },

    btnFrom : {
        flex:1,
        flexDirection:'row',
        borderWidth:1,
        borderRadius:6,
        borderColor:"#C2D0E2",
        alignItems:'center',
        marginRight:5,
        paddingHorizontal: 12,
    },
    txt : {
        flex:1,
        fontSize:12,
        color:"#9A9A9A",
        // marginHorizontal:5
    },
    boxIcon : {
        flex:3,
        flexDirection:'row',
        justifyContent: 'flex-end',
        // paddingHorizontal:12
    },
    txtDay : {
        fontSize:12,
        fontWeight:'500',
        color:"#444444",
        // marginHorizontal:8
        marginRight: 8,
    },
    iconFilter : {
        height:10, width:10,
        marginTop: 3,
    },
    // iconFilter: { position: 'absolute', right: 0, top: '50%', marginTop: -5, width: 10, height: 10 },
    btnTo : {
        flex:1,
        flexDirection:'row',
        borderWidth:1,
        borderRadius:6,
        borderColor:"#C2D0E2",
        alignItems:'center',
        marginLeft:5,
        paddingHorizontal: 12,
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
    }
}