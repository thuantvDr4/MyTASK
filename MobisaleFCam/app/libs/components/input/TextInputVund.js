import React from 'react';
import {StyleSheet, Text, View, TextInput as ReactTextInput} from 'react-native';
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

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
 * @author DaiDP
 * @since Aug, 2018
 */

const defaultProps = {
    textInputStyle: {},
};

class TextInput extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.state = {
            value: props.value,
            isValid: true
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.value != this.state.value)
        {
            this.setState({
                ...this.state,
                value : nextProps.value
            });
        }
    }

    onChangeText(text)
    {
        this.setState({
            value: text,
            isValid: text != '' && !this.state.isValid ? true : this.state.isValid
        }, () => {
            this.props.onChangeText && this.props.onChangeText(text);
        });
    }

    setValid(isValid)
    {
        this.setState({
            isValid: isValid
        })
    }

    render()
    {
        const validStyle = createValidStyleSheet(this.state.isValid);

        return (
            <View style = {[styles.wrapper, validStyle.validStyleBorder]}>
                <View>
                    <Text style = {styles.label} >{ this.props.label }</Text>
                </View>
                <ReactTextInput 
                    {...this.props} 
                    value={this.state.value}
                    onChangeText={this.onChangeText.bind(this)}
                    style = {[{width: '50%', textAlign:'right', color: '#444', height: 40, ...this.props.textInputStyle}, validStyle.validStyleText]}
                    placeholderTextColor={this.state.isValid ? '#444' : '#ff5050'}
                    underlineColorAndroid='rgba(0,0,0,0)'
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', 
        minHeight: 40, height:40, paddingHorizontal: 12, 
        // marginVertical: 0
        marginBottom: 12,
        borderColor: '#d0d8e2', borderWidth: 1, borderRadius: 5,
        
    },
    label: {
        fontSize: 12,
        color: '#9a9a9a'
    }
});

TextInput.defaultProps = defaultProps;

export default TextInput;