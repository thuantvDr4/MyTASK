export default {
    container: {
        flexDirection:'row',
        height: 56,
        backgroundColor:'#FFF',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10
        },
        shadowRadius: 10,
        shadowOpacity: 0.2,
        elevation: 20,
    },
    tabContainer: {
        flex:2,
        
    },
    tabTopContainer: {
        flex:2,
        opacity: 0.5
    },
    tabBodyContainer: {
        flex:2,
        flexDirection:'row',
        // borderStyle: 'solid',
        // borderTopWidth: 1,
        // borderTopColor: '#ddd',
    },

    tabPlusContainer: {
        flex:1,
        // position:'relative',
    },

    tabTopPlusContainer: {
        flex:2,
        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd',
    },

    tabBodyPlusContainer: {
        flex:3,
        flexDirection:'row',
    },

    oneTab: {
        flex:1, alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        borderRadius: 100 / 2,
    },

    oneTabPlus: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -38,
    },
    tabImg: {
        width: 16,
        height: 16,
    },
    seperator: {
        width: 18, height: 2,
        // marginTop: 7,
        position: 'absolute', bottom: 12,
        backgroundColor: '#0B76FF',
    }
};