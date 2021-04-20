/**
 * TechLoadingProgress components
 * 
 * - Use react-native-progress
 * - Document see at: https://github.com/oblador/react-native-progress
 * 
 * @author ThuanDD3
 * @since Apr, 2019
 */

/**
 * ------ LIB
 */
import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, Platform, Modal } from 'react-native';
import PropTypes from 'prop-types';
import * as Progress from 'react-native-progress';
import Spinner from 'react-native-loading-spinner-overlay';

/**
 * ------ CONST
 */
const ANIMATION = ['none', 'slide', 'fade'];
const SIZES = ['small', 'normal', 'large'];

export default class TechLoadingProgress extends Component {

    static propTypes = {
        visible: PropTypes.bool,
        cancelable: PropTypes.bool,
        textContent: PropTypes.string,
        animation: PropTypes.oneOf(ANIMATION),
        color: PropTypes.string,
        size: PropTypes.oneOf(SIZES),   // not use
        overlayColor: PropTypes.string
    };
    
    static defaultProps = {
        visible: false,
        cancelable: false,
        textContent: '',
        animation: 'none',
        color: 'white',
        size: 'large', // 'normal',    // not use
        overlayColor: 'rgba(0, 0, 0, 0.7)'
    };

    constructor(props) {
        super(props);

        this.state = { 
            visible: this.props.visible, 
            textContent: this.props.textContent,
            progress: !this.props.progress ? 0 : this.props.progress,
            indeterminate: !this.props.indeterminate ? true : this.props.indeterminate,
            isSuccess: !this.props.success ? false : this.props.success,
        };
    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {

        let newState = { };

        if (nextProps.visible != this.props.visible) {
            newState.visible = nextProps.visible;
        }

        if (nextProps.textContent != this.props.textContent) {
            newState.textContent = nextProps.textContent;
        }
        
        if (nextProps.progress != this.props.progress) {
            newState.progress = nextProps.progress;
        }

        if (nextProps.indeterminate != this.props.indeterminate) {
            newState.indeterminate = nextProps.indeterminate;
        }

        if (nextProps.success != this.props.success) {
            newState.isSuccess = nextProps.success;
        }
        
        this.setState(newState);
    }

    _renderLoadingProgress() {
        return (
            <View style={styles.background}>
                <View style={styles.loadingProgressContainer}>
                    <Progress.Circle
                        style={styles.progress}
                        progress={this.state.progress}
                        indeterminate={this.state.indeterminate}
                        animated={true}
                        showsText={true}
                        size={60}
                        thickness={4}
                        borderWidth={2}
                        borderColor={'#fff'}    // neu ko define se lay mau all
                        color={'#fff'}  // mau chung, bao gom border, border trong, text
                        
                        textStyle={{ fontSize: 14 }}
                        direction={'clockwise'}
                        strokeCap={'butt'}
                        // fill={'transparent'}
                    />
                    <Text style={[styles.textContent, this.props.textStyle]}>
                        {this.state.textContent}
                    </Text>
                </View>
            </View>
        );
    }

    _renderLoadingSuccess() {
        return (
            <View style={styles.background}>
                <View style={styles.loadingProgressContainer}>
                    <Progress.CircleSnail
                        indeterminate={this.state.indeterminate}
                        style={styles.progress}
                        size={60}
                        thickness={2}
                        color={['#ffffff', '#0B76FF']}
                    />
                    <Text style={[styles.textContent, this.props.textStyle]}>
                        {this.state.textContent}
                    </Text>
                </View>
            </View>
        );
    }

    _handleOnRequestClose() {
        if (this.props.cancelable) {
            this.close();
        }
    }

    close() {
        this.setState({ visible: false });
    }

    render() {
        const { visible } = this.state;
        
        const progressView = (
            <View 
                style={
                    [ styles.container, { backgroundColor: this.props.overlayColor } ]
                } 
                // key={`ldPgrees_${Date.now()}`}
                key={1}
            >
                { !this.state.isSuccess ? this._renderLoadingProgress() : this._renderLoadingSuccess() }
            </View>
        );

        return (
            <Modal
                animationType={ this.props.animation }
                onRequestClose={ () => this._handleOnRequestClose() }
                supportedOrientations={ ['landscape', 'portrait'] }
                transparent
                visible={ visible }>
                    { progressView }
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'transparent',
    },
    background: {
        justifyContent: 'center', alignItems: 'center',
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, 
    },
    loadingProgressContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', top: 0, bottom: 0, left: 0, right: 0,
    },
    textContent: {
        // top: 80,
        // height: 50,
        marginTop: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#fff'
    },
    circles: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progress: {
        // margin: 10,
    },
});