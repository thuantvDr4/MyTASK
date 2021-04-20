
import {Dimensions, StyleSheet} from 'react-native';
const { width, height } = Dimensions.get('window');
import {Platform} from 'react-native';

export default {
    container: {
        flex: 1,
        width:'100%',
        backgroundColor:'#F8F9FB'
    },
    searchContainer : {
        paddingBottom:10, paddingRight:32, paddingLeft:32,
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
        // paddingBottom:30,
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
        // marginTop:15,
        marginBottom: 12,
    },
    infoBox : {
        // height:115,
        paddingLeft:10, paddingRight:10, paddingTop:6, paddingBottom:0,
        borderWidth:1, borderColor:'#C2D0E2',
        borderBottomWidth:0, borderTopLeftRadius:6, borderTopRightRadius:6,
        backgroundColor:'#FFFFFF',

    },
    oneInfo : {
        flex:1, flexDirection:'row',
        marginBottom: 8,
    },
    oneInfoN : {
        flexDirection:'row',
        marginBottom: 10,
    },
    oneAddress : {
        flex:2, flexDirection:'row',
        marginBottom: 10,
    },
    infoTitle : {
        flex:2,
        fontSize:12,
        color:'#A9A9A9',
        textAlign:'left'
    },
    infoValue : {
        flex:3,
        fontSize:12,
        fontWeight:'500',
        textAlign:'right',
        color:'#444444'
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
    containerFilter: {
        paddingRight:24, paddingLeft:24,
        backgroundColor:'#0B76FF',
    },
    filterTypeBox : {
        justifyContent: 'center', alignItems: 'center',
        paddingBottom: 10,
    },
    row: {
        flexDirection:'row', alignItems: 'center',
        marginHorizontal: -8,
    },
    col: {
        flex: 1/2,
        paddingHorizontal: 8,
    },
    btnFilterActive : {
        backgroundColor: '#FFFFFF', borderWidth: 0
    },
    btnFilterType : {
        width:'100%', height:32,
        justifyContent: 'center', alignItems: 'center',
        borderWidth:1, borderColor:'#FFF', borderRadius: 20

    },
    textFilterType : {
        fontSize: 12, color:'#FFF'
    },
    textFilterTypeActive: {
        fontSize: 12, color:'#0B76FF'
    },

    // DETAIL
    infoContact : {
        paddingLeft:10, paddingRight:10, paddingTop:6, paddingBottom:0,
        borderWidth:1, borderColor:'#D0D8E2',
        borderRadius: 6,
        backgroundColor:'#FFFFFF',
    },
    headline: {
        marginBottom: 12,
    },
    textInput: {
        // height: 40,
        paddingRight: 12, paddingLeft: 100,
        fontSize: 12, color: '#444444',
        borderColor: 'transparent',
        borderWidth: 0,
    },
    textArea: {
        flexGrow:1,
        minHeight: 96,
        maxHeight: 200,
        paddingVertical: 12
    },
    //
    note_ctn:{
        minHeight: 96,
        maxHeight: 200,
        marginBottom: 12,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        borderColor: '#D0D8E2',
        borderWidth: 1,
        borderRadius: 6,
    },
    note_txt:{
        fontSize: 12,
        color: '#444444',
        marginVertical: 10
    },
    fakeInput: {
        paddingLeft: 10, paddingRight: 0, paddingTop: 10, paddingBottom: 10,
        borderWidth: 1, borderColor: '#C2D0E2',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    textInputFake: {
        paddingRight: 12,
        fontSize: 12,
        color: '#444444',
        paddingBottom:20
    },
}

// thuantv-editor-29/09/2020
export const itemStyles = StyleSheet.create({
    card_view:{
        flex:1,
        borderRadius:6,
        borderColor: '#C2D0E2',
        borderWidth:1,
        backgroundColor:'#ffffff',
        marginBottom:12,
    },
    body_ctn:{
        flex:4,
        paddingHorizontal:12,
        paddingVertical:4,
    },
    footer_ctn:{
        flex:1,
        paddingVertical: 8,
        justifyContent: 'center'
    },
    divide_ctn:{
        height:1,
        backgroundColor: '#C2D0E2',
        marginTop:12
    },
    title_ft:{
        fontSize: 14,
        fontWeight: '500',
        textAlign:'center',
        color: '#3F93FF'
    },
    filterBar_st:{
        paddingHorizontal: 24,
        height: 50,
        width: '100%',
        backgroundColor: '#ffffff',
        alignItems:'center',
        flexDirection: 'row',
        justifyContent:'space-between'
    },
    label_txt:{
        fontWeight: '400',
        fontSize: 14,
        color:'#444444'
    },
    picker_ctn:{
        flexDirection: 'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    date_txt:{
        fontWeight: '400',
        fontSize: 14,
        color:'#444444'
    },
    image_ctn:{
        height: 10,
        width: 10,
    },
    dateTime_ctn:{
        paddingVertical: 10,
        paddingHorizontal: 18,
        height: 60,
        width: '100%',
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems: 'center'
    },
    confirm_txt:{
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#0B76FF'
    },
    note_ctn:{
        borderRadius:6,
        borderColor: '#C2D0E2',
        borderWidth:1,
        backgroundColor:'#ffffff',
        paddingHorizontal: 4,
        paddingVertical: 12,
        minHeight: 60,
    },
    note_txt:{
        fontWeight: '400',
        fontSize: 12,
        color: '#444444'
    },
    delete_txt:{
        fontWeight: '500',
        fontSize: 12,
        color: '#FF5252'
    },
    delete_ctn:{
        alignItems:'flex-end',
        paddingVertical: 8
    }


});
