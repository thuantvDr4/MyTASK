import React, {Component} from 'react';
import {StyleSheet, Text, View, TextInput as ReactTextInput} from 'react-native';

/**
 * Input Element: picker
 * 
 * ############# Properties #############
 * 1. label: Label text
 * 2. value: value selected
 * 3. placeholder: placeholder
 * 
 * ############# Events #################
 * 1. onValueChange(value): Event when select change
 * 
 * @author VuND
 * @since Aug, 2018
 */

const defaultProps = {
    textInputStyle: {},
};

class TextInfo extends Component
{
    componentWillReceiveProps(nextProps)
    {
        let newState = {};

        if (nextProps.stylewrapper) {
            newState.styleWrapper = nextProps.stylewrapper;
        }
        else
        {
            newState.styleWrapper = styles.wrapper;
        }

        if (nextProps.value != this.props.value) {
            newState.selectItem = nextProps.value;
        }

        if (nextProps.visible != this.props.visible) {
            newState.visible = nextProps.visible;
        }

        this.setState(newState);
    }
    render()
    {
        return (
            <View style = {this.props.styleWrapper ? this.props.styleWrapper : styles.wrapper}>
                <Text style = {this.props.styleLabel ? this.props.styleLabel : null} >{ this.props.label }</Text>
                <Text style = {this.props.styleValue ? this.props.styleValue : null} >{ this.props.value }</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection:'row', 
        // alignItems: 'center' ,
        // justifyContent: 'space-between', 
        // minHeight: 40, // height:40,
        borderColor: '#d0d8e2', borderWidth: 1, borderRadius: 5,
        // marginVertical: 6,
        // paddingHorizontal: 12, 
    },
    label: {
        color: '#9a9a9a'
    }
});

TextInfo.defaultProps = defaultProps;

export default TextInfo;