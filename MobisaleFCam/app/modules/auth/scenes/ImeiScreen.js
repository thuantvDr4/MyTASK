/**
 * Màn hình thong tin IMEI
 * @since Aug, 2018
 */

// LIB
import React, {Component} from 'react';
import {StyleSheet, View, TextInput, Text, TouchableOpacity, Clipboard, Platform} from 'react-native';
import Dimensions from 'Dimensions';
import {strings} from 'locales/i18n';
// LIB CUSTOM
import CustomStatusBar from 'app-libs/components/StatusBar';
// REDUX
import {connect} from 'react-redux';

class ImeiScreen extends Component {

    static navigationOptions = ({navigation}) => {
        return {
            title: strings('auth.login.imei_info'),
            // headerLeft: <HeaderBackButton onPress={() => NavigationService.navigateGoBack()} tintColor="#fff"/>,
            headerRight: <View/>,
            navigationOptions: ({navigation}) => ({
                headerStyle: {
                    backgroundColor: '#0B76FF',
                    borderBottomWidth: 0,
                    shadowRadius: 0,
                    shadowOffset: {
                        height: 0,
                    },
                    shadowColor: 'transparent',
                    elevation: 0,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    flexGrow: 1,
                },
            }),
        };
    };

    constructor(props) {
        super(props);
        this.state = {
            deviceID: this.props.deviceImei,
            isCopy: false,
        };
    }

    writeToClipboard = async () => {
        await Clipboard.setString(this.state.deviceID);
        this.setState({
            isCopy: true,
        });
    };

    readFromClipboard = async () => {
        const clipboardContent = await Clipboard.getString();
        this.setState({clipboardContent});
    };

    render() {
        return (
            <View style={styles.wrapper}>
                <CustomStatusBar
                    backgroundColor="#0B76FF"
                    barStyle="light-content"/>

                <View style={[{paddingTop: Platform.OS === 'ios' ? 20 : 0}]}>
                    <Text style={styles.text}>{strings('imei.headline.info')}</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input]}
                            value={this.props.deviceImei}
                            underlineColorAndroid='rgba(0,0,0,0)'
                        />
                    </View>
                    <View style={styles.btnWrapper}>
                        <TouchableOpacity onPress={this.writeToClipboard}
                                          style={[styles.btn, [this.state.isCopy ? styles.btnActive : '']]}>
                            <Text
                                style={[styles.btnTxt, [this.state.isCopy ? {color: '#fff'} : '']]}>
                                {this.state.isCopy ? strings('imei.btn.copied') : strings('imei.btn.copy')}
                                </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }
}

export default connect(
    state => {
        return {
            deviceImei: state.splashReducer.deviceImei,
        };
    },
    null,
)(ImeiScreen);

const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const styles = StyleSheet.create({
    // Wrapper
    wrapper: {
        flex: 1,
        justifyContent: 'flex-start',
        paddingTop: 0,
        backgroundColor: '#FFF',
    },
    inputWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Text
    text: {
        marginHorizontal: 25,
        fontSize: 14,
        color: '#C2D0E2',
    },

    // Input
    input: {
        width: DEVICE_WIDTH - 50, height: 40,
        marginTop: 10, marginBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        borderRadius: 6,
        color: '#323232',
        fontSize: 12,
        backgroundColor: 'rgba(158,201,255,0.30)',
        textAlign: 'center',
        alignSelf: 'center',
    },

    // Button
    btnWrapper: {
        alignSelf: 'flex-end',
    },
    btn: {
        width: 91, height: 28,
        paddingTop: Platform.OS === 'ios' ? 4 : 3,
        marginHorizontal: 25,
        borderWidth: 1,
        borderColor: '#0B76FF',
        borderRadius: 14,
        alignItems: 'center',
    },
    btnActive: {
        backgroundColor: '#9EC9FF',
        borderColor: '#9EC9FF',
    },
    btnTxt: {
        color: '#0B76FF',
    },
});
