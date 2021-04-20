

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, Alert
} from 'react-native';
import { CustomPicker } from 'react-native-custom-picker'
import {connect} from "react-redux";



class SelectPicker extends React.Component {

    constructor(props)
    {
        super(props);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderOption = this.renderOption.bind(this);
        this.renderField = this.renderField.bind(this);

    }

    renderHeader() {
        return (
            <View style={styles.headerSelect}>
                <Text style={styles.txtHeaderSelect}>{this.props.titleHeader}</Text>
                <Text style={styles.exitHeaderSelect}>X</Text>
            </View>
        )
    }

    renderOption(settings) {
        const { item, getLabel } = settings
        return (
            <View style={styles.optionContainer}>
                <View style={styles.oneOption}>
                    <Text style={styles.lableOption}>{getLabel(item)}</Text>
                </View>

            </View>
        )
    }

    renderField(settings) {
        const { selectedItem, defaultText, getLabel, clear } = settings;
        return (
            <View style={{height:40, flexDirection:'row', borderWidth:1, borderColor:"#D0D8E2", borderRadius:6, justifyContent:'center', alignItems:'center', paddingHorizontal:12}}>
                <View style={{flex:1}}>
                    <Text style={{fontSize:12, color:'#9A9A9A', textAlign:'left'}}>{this.props.placeholderDefault}</Text>
                </View>
                <View style={{flex:1}}>
                    {!selectedItem && <Text style={[styles.text, { color: '#444444', textAlign:'right', paddingRight:10 }]}>{defaultText}</Text>}
                    {selectedItem && <Text style={[styles.text, { fontSize:12, fontWeight:'500',color: '#444444', textAlign:'right', paddingRight:10 }]}>{getLabel(selectedItem)}</Text>}
                </View>
            </View>
        )
    }

    render() {
        return (
            <CustomPicker
                placeholder={this.props.placeholder}
                options={this.props.option}
                getLabel={item => item.label}
                defaultValue={this.props.defaultValue}
                fieldTemplate={this.renderField}
                optionTemplate={this.renderOption}
                headerTemplate={this.renderHeader}
                onValueChange={this.props.onValueChange}
            />
        );
    }
}

const styles = {
    headerSelect : {
        flexDirection:'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding:12,
        borderBottomWidth:1,
        borderBottomColor:'#E7ECF3',
        marginBottom:12
    },
    txtHeaderSelect : {
        flex:8,
        fontSize:20,
        fontWeight:'500',
        textAlign:'center',
        color:'#444444'
    },
    exitHeaderSelect : {
        textAlign:'center'
    },
    optionContainer : {
        paddingRight:19,
        paddingLeft:19,
        paddingBottom:12
    },
    oneOption : {
        height:48,
        borderWidth:1,
        borderRadius:5,
        borderColor:'#9EC9FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    lableOption : {
        color: '#0B76FF',
        textAlign:'center',
        fontSize:16
    }
}


export default connect()(SelectPicker);