import {Dimensions, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%'
    },
    filterTypeBox: {
        height: 54,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B76FF'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: -5,
    },
    col: {
        flex: 1 / 3,
        paddingHorizontal: 5,
    },
    btnFilterActive: {
        backgroundColor: '#FFFFFF',
        borderWidth: 0
    },
    btnFilterType: {
        width: '100%',
        height: 32,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#9EC9FF',
        borderRadius: 20

    },
    textFilterType: {
        fontSize: 12,
        color: '#9EC9FF'
    },
    textFilterTypeActive: {
        fontSize: 12,
        color: '#0B76FF'
    },
    styleContainerReportContent: {
        paddingTop: 16,
        paddingBottom: 16,
        paddingRight: 24,
        paddingLeft: 24
    },
    oneList: {
        height: 68,
        marginBottom: 12
    },
    infoBox: {
        height: 68,
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 12,
        borderWidth: 1,
        borderColor: '#C2D0E2',
        backgroundColor: '#FFFFFF',
        borderRadius: 6
    },
    oneAddress: {
        flex: 2,
        flexDirection: 'row'
    },
    oneInfo: {
        flex: 1,
        flexDirection: 'row',
    },
    infoTitle: {
        flex: 2,
        fontSize: 12,
        textAlign: 'left',
        color: '#A9A9A9'
    },
    infoValue: {
        flex: 2,
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'right',
        color: 'black'
    },
    emptyview: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptytext: {
        color: "#D6D6D6",
        fontSize: 18,
        fontWeight: "500"
    },
    linestyle: {
        height: 1.2,
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
        backgroundColor: '#D0D8E2'
    }
});


export default styles;


// thuantv-editor-06/10/2020
export const itemStyles = StyleSheet.create({
    card_view: {
        flex: 1,
        borderRadius: 6,
        borderColor: '#C2D0E2',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        marginBottom: 12,
    },
    body_ctn: {
        flex: 4,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    footer_ctn: {
        flex: 1,
        paddingVertical: 8,
        justifyContent: 'center'
    },
    divide_ctn: {
        height: 1,
        backgroundColor: '#C2D0E2',
        marginTop: 12
    },
    title_ft: {
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#3F93FF'
    },
    filterBar_st: {
        paddingHorizontal: 24,
        height: 50,
        width: '100%',
        backgroundColor: '#ffffff',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    label_txt: {
        fontWeight: '400',
        fontSize: 14,
        color: '#444444'
    },
    picker_ctn: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    date_txt: {
        fontWeight: '400',
        fontSize: 14,
        color: '#444444'
    },
    image_ctn: {
        height: 10,
        width: 10,
    },
    dateTime_ctn: {
        paddingVertical: 10,
        paddingHorizontal: 24,
        height: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    confirm_txt: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
        color: '#0B76FF'
    },
    note_ctn: {
        borderRadius: 6,
        borderColor: '#C2D0E2',
        borderWidth: 1,
        backgroundColor: '#ffffff',
        paddingHorizontal: 4,
        paddingVertical: 12,
        minHeight: 60,
    },
    note_txt: {
        fontWeight: '400',
        fontSize: 12,
        color: '#444444'
    },
    delete_txt: {
        fontWeight: '500',
        fontSize: 12,
        color: '#FF5252'
    },
    delete_ctn: {
        alignItems: 'flex-end',
        paddingVertical: 8
    }
})
