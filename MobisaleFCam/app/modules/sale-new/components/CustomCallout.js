import React from 'react';
import PropTypes from 'prop-types';

import {
    StyleSheet,
    View,
    Text
} from 'react-native';

const propTypes = {
    style: PropTypes.object,
};

class CustomCallout extends React.Component {
    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={this.props.portFree == 1 ? styles.bubbleRed : styles.bubbleBlue}>
                    <View style={styles.portFreeContainer}>
                        <View style={styles.innerPortFree}>
                            <Text style={styles.txtPortFree}>{this.props.portFree}</Text>
                        </View>
                    </View>
                    <View style={styles.distanceContainer}>
                        <Text style={styles.txtDistance}>{this.props.distance}</Text>
                    </View>
                </View>
                <View style={this.props.portFree == 1 ? styles.arrowBorderRed : styles.arrowBorderBlue} />
                {/*<View style={styles.arrow} />*/}
            </View>
        );
    }
}

CustomCallout.propTypes = propTypes;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        alignSelf: 'flex-start', marginLeft: 10
    },
    bubbleRed: {
        width: 90,
        height:35,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF5050',
        paddingVertical: 12,
        borderRadius: 16,
        borderColor: '#FF5050',
        // borderWidth: 0.5,
    },

    bubbleBlue: {
        width: 90,
        height:35,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0B76FF',
        paddingVertical: 12,
        borderRadius: 16,
        borderColor: '#0B76FF',
        // borderWidth: 0.5,
    },

    portFreeContainer : {
        flex:1, padding:4, marginLeft: 2
    },

    innerPortFree : {
        width:24,
        height:24,
        borderRadius:14,
        backgroundColor:'#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtPortFree :{
        color:'#FF5050',
        fontWeight:'bold'
    },
    distanceContainer : {
        flex:2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    txtDistance : {
        color:'#FFFFFF',
        fontSize:10
    },
    arrowBorderRed: {
        backgroundColor: 'transparent',
        borderWidth: 8,
        borderColor: 'transparent',
        borderTopColor: '#FF5050',
        alignSelf: 'flex-start',
        marginTop: -2,
        marginLeft: 10,
    },

    arrowBorderBlue: {
        backgroundColor: 'transparent',
        borderWidth: 8,
        borderColor: 'transparent',
        borderTopColor: '#0B76FF',
        alignSelf: 'flex-start',
        marginTop: -2,
        marginLeft: 10,
    },
});

export default CustomCallout;