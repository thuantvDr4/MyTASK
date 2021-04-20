import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';
import TechPickerDynamic from '../TechPickerDynamic';

/**
 * Input Element: picker
 * 
 * ############# Properties #############
 * 1. label: Label text
 * 2. options: Array of options
 * 3. value: value selected
 * 4. defaultValue: Default value (placeholder)
 * 5. prompt: Title of option dialog
 * 
 * ############# Events #################
 * 1. onValueChange(value): Event when select change
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
export default class PickerInputDynamic extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.state = {
            visible: props.visible || true,
            value: props.value || undefined,
            isValid: true
        }
    }

    componentWillReceiveProps(nextProps)
    {
        let change = false;
        let {visible, value} = this.state;


        if (nextProps.visible !== this.state.visible) {
            visible = nextProps.visible;
            change = true;
        }

        if (nextProps.value !== this.state.value) {
            value = nextProps.value;
            change = true;
        }


        if (change)
        {
            this.setState({
                ...this.state,
                visible: visible,
                value: value
            });
        }
    }

    onValueChange(selectedItem)
    {
        this.setState({
            selectItem: selectedItem,
            isValid: selectedItem.Id && !this.state.isValid ? true : this.state.isValid
        });

        this.props.onValueChange && this.props.onValueChange(selectedItem);
    }

    setValid(isValid)
    {
        this.setState({
            isValid: isValid
        })
    }

    render()
    {
        if (this.props.visible === false) {
            return null;
        }

        const validStyle = createValidStyleSheet(this.state.isValid);

        return (
            <View style = {[styles.wrapper, validStyle.validStyleBorder]}>
                <View>
                    <Text style = {styles.label} >{ this.props.label }</Text>
                </View>
                <TechPickerDynamic
                    {...this.props}
                    onValueChange={this.onValueChange.bind(this)}
                    style={validStyle.validStyleText}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', 
        minHeight: 40, paddingHorizontal: 12, 
        // marginVertical: 0,
        marginBottom: 12,
        borderColor: '#d0d8e2', borderWidth: 1, borderRadius: 5,
    },
    label: {
        fontSize: 12, 
        color: '#9a9a9a'
    },
    ico: { position: 'absolute', right: 0, top: '50%', marginTop: -5, width: 10, height: 10 },
});