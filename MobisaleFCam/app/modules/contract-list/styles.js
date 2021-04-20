var { StyleSheet } = require('react-native');
import { Platform } from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    searchContainer: {
        paddingBottom: 16, paddingRight: 32, paddingLeft: 32,
        justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#0B76FF',
    },
    boxSearch: {
        height: 40,
        width: '100%',
        borderWidth: 1,
        borderColor: '#FFFFFF',
        borderRadius: 5,
        backgroundColor: '#FFFFFF',
    },
    viewInputSearch: {
        flex: 1,
        flexDirection: 'row',
    },
    iconSearchBox: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconSearch: {
        height: 16,
        width: 16
    },
    inputSearchBox: {
        flex: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerInputSearchBox: {
        flex: 1,
        justifyContent: 'space-between',
        minHeight: 40,
    },
    inputSearch: { flex: 1 },
    searchBorder: {
        height: '80%',
        borderRightWidth: 1,
        borderRightColor: '#C2D0E2'
    },
    iconFilterBox: {
        flex: 1,
    },
    listInfoContainer: {
        flex: 1,
        position: 'relative',
        backgroundColor: '#F8F9FB'
    },
    scrollView: {
        paddingTop: 16,
    },
    btnAddBox: {
        position: 'absolute',
        bottom: 0,
        right: 0
    },
    oneList: {
        // height:155,
        marginHorizontal: 24,
        // marginTop:16,
        marginBottom: 12,
    },
    infoBox: {
        // height:115,
        paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 0,
        borderWidth: 1, borderColor: '#C2D0E2',
        borderBottomWidth: 0, borderTopLeftRadius: 6, borderTopRightRadius: 6,
        backgroundColor: '#FFFFFF',
    },
    oneInfo: {
        flex: 1, flexDirection: 'row',
        marginBottom: 8,
    },
    oneAddress: {
        flex: 1, flexDirection: 'row',
        marginBottom: 10,
    },
    infoTitle: {
        flex: 2 / 5, fontSize: 12, color: '#A9A9A9', textAlign: 'left'
    },
    infoValue: {
        flex: 3 / 5,
        fontSize: 12, fontWeight: '500', textAlign: 'right', color: '#444444'
    },
    createBox: {
        height: 35,
        justifyContent: 'center',
        borderWidth: 1, borderColor: '#C2D0E2',
        borderBottomLeftRadius: 6, borderBottomRightRadius: 6,
        backgroundColor: '#FFFFFF',

    },
    btnCreate: {
        paddingLeft: 54, paddingRight: 54,
        ...Platform.select({
            ios: {
                paddingVertical: 4,
            },
            android: {
                paddingVertical: 9,
            },
        }),
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtBtnCreate: {
        color: '#3F93FF',
        fontSize: 14,
        fontWeight: '500',
    },
    dataEmpty: {
        flex: 1,
    },
    wrapImage: {
        flex: 2 / 3,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Create Prechecklish
    infoContainer: {
        flex: 1,
        position: 'relative',
        paddingBottom: 10,
        backgroundColor: '#F8F9FB'
    },
    scrollViewCreate: {
        paddingTop: 10
    },
    infoContract: {
        paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 6,
        borderWidth: 1, borderColor: '#C2D0E2',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
    },
    headline: {
        marginBottom: 12,
    },
    textInput: {
        height: 40,
        paddingRight: 12,
        fontSize: 12,
        borderColor: 'transparent',
        borderWidth: 0,
        color: '#444444',
    },
    textArea: {
        height: 96,
        textAlignVertical: 'top',
        paddingTop: 12
    },

    infoContact: {
        paddingLeft: 10, paddingRight: 10, paddingTop: 6, paddingBottom: 0,
        borderWidth: 1, borderColor: '#C2D0E2',
        borderRadius: 10,
        backgroundColor: '#FFFFFF',
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
    },
    txtCreateCusInf: {
    textAlign: "center",
    fontSize: 12,
    color: "#0B76FF"
  }
});



export default styles;