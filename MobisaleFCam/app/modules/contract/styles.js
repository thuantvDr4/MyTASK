var { StyleSheet } = require('react-native');

const styles = StyleSheet.create({
    nav_head_style: {
        backgroundColor: '#0B76FF',
    },
    nav_header_titleStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center'
    },

    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 16,
        backgroundColor: '#fff'
    },
    innerContainer: {
        flex: 1
    },
    textTitle: {
        fontWeight: "500",
        fontSize: 14,
        color: '#444',
        lineHeight: 16,
        marginBottom: 8
    },
    spaceSession: {
        marginTop: 12
    },

    boxInfo: {
        borderWidth: 1, borderColor: '#9ec9ff',borderRadius: 6,
        padding: 12,
        backgroundColor:'#FFF'
    },
    boxSpace: {
        marginTop: 16
    },
    buttonContainer: {
        marginBottom: 24,
    },

    innerbookport: {
        height:38,
        borderWidth:1, borderColor:'#9EC9FF', borderRadius:6,
        paddingHorizontal:12, paddingTop: 8,
        backgroundColor:'#FFF'
    },
});


export default styles;