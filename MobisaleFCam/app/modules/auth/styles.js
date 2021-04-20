var { StyleSheet } = require('react-native');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        //backgroundColor: '#333',
        justifyContent: "flex-start",
        alignItems: "center",
    },

    logo:{
        //marginTop: 60
        minHeight: 162,
        height: 162,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    wrapForm: {
        width:'100%', 
        maxHeight: 80,
        marginTop:55, 
        flex:1, 
        justifyContent: "flex-start",
        alignItems: "flex-start",
        paddingLeft:69
    },

    wrapInput: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "flex-start",
    },

    version: {
        flex: 0.2,
        //position: "absolute",
        //bottom: 20,
        backgroundColor: "#9EC9FF",
        color: '#fff',
        borderRadius: 6,
        paddingVertical: 3,
        paddingHorizontal: 16,
        fontSize: 12,
        marginBottom: 20,
        minHeight: 22,
        maxHeight: 22,
        overflow: 'hidden'
    }
});


export default styles;