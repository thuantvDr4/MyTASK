import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from 'react-native';
import {strings} from 'locales/i18n';
import SketchCanvas from '@terrylinla/react-native-sketch-canvas';


export default class DrawBoard extends Component
{
    constructor(props) {
        super(props);

        this.state = {
            isDraw: false,
        };
    }

    clearCanvas() {
        this.refs['sign'].clear();
        this.setState({ isDraw: false })
    }

    saveCanvas() {
        this.refs['sign'].save();
    }

    onSave(success, path)
    {
        const isDraw = this.state.isDraw;
        success && this.props.onSave && this.props.onSave(path, isDraw);
    }

    render() {
        return (
            <View style={styles.outer}>
                <View style={styles.areaDraw}>
                    <SketchCanvas
                        ref="sign"
                        style={styles.drawer}
                        containerStyle={{ backgroundColor: 'transparent', flex: 1 }}
                        canvasStyle={{ backgroundColor: 'transparent', flex: 1 }}
                        defaultStrokeIndex={0}
                        defaultStrokeWidth={5}
                        savePreference={() => {
                            return {
                                folder: 'FCam',
                                filename: String(Math.ceil(Math.random() * 100000000)),
                                transparent: false,
                                imageType: 'png'
                            }
                        }}
                        onStrokeStart={() => {
                            // console.log('stroke start');
                            this.setState({ isDraw: true })
                        }}
                        onSketchSaved={this.onSave.bind(this)}
                    />
                </View>
                
                <View style={[styles.optionContainer]}>
                    <TouchableOpacity 
                        onPress={this.clearCanvas.bind(this)} 
                        style={{width: '100%'}}
                    >
                        <View style={[styles.button, {marginBottom: 10}]}>
                            <Text style={styles.buttonText}>{strings('contract.create_contract.dialog_re_sign')}</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        onPress={ !this.state.isDraw ? () => {} : this.saveCanvas.bind(this) }
                        style={{width: '100%'}}
                    >
                        <View style={[styles.button, !this.state.isDraw ? styles.buttonDisable : null]}>
                            <Text style={[styles.buttonText]}>
                                {strings('contract.create_contract.dialog_confirm')}
                            </Text>   
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({  
    outer: {
        flex: 1, 
        width: '100%', 
        // padding: 19, 
        // backgroundColor: '#fff',
        // borderBottomLeftRadius: 8,
        // borderBottomRightRadius: 8,
    },
    areaDraw: {
        flex: 1, 
        overflow: 'hidden', 
        borderColor: '#c2d0e2', 
        borderWidth: 1, borderRadius: 10, 
        // maxHeight: 180,
        // minHeight: 180
    },
    drawer: {
        flex: 1, 
        backgroundColor: '#fff',
        // width: '100%',
        // height: '100%'
    },

    optionContainer: {
        flexDirection: 'column', alignItems:'center', justifyContent: 'center', 
        marginTop: 15
        // borderWidth: 1, 
        // borderColor: '#0b76ff', 
        //marginHorizontal: 24, 
        // marginTop: 12, marginBottom: 12, 
        // borderRadius: 5,
    },
    optionText: {
        // alignSelf: 'flex-start', 
        paddingHorizontal: 10,
        color: '#0b76ff', fontSize: 20, lineHeight: 48
    },
    button: {
        height: 48, width: '100%',
        alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#0B76FF',
        borderRadius: 5,
        zIndex: 100,
        // shadowColor: '#9EC9FF',
        // shadowOffset: {width: 0, height: 10},
        // shadowOpacity: 0.75,
        // shadowRadius: 7,
        // elevation: 5,
    },
    buttonDisable: {
        opacity: 0.4
    },
    buttonText: {
        color: 'white',
        fontSize: 16, fontWeight: '500'
    },
});