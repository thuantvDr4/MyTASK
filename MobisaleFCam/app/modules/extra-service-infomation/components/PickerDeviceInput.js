import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import NavigationService from 'app-libs/helpers/NavigationService';
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

/**
 * Picker search with new screen
 * 
 * ############# Properties #############
 * 1. label: Label text
 * 2. placeholder: Text display when not choose
 * 3. value: value selected
 * 4. prompt: Title of option dialog
 * 5. filterText: Text display input filter screen
 * 6. getOptionData(callback, params): Call API to get data. When done, call callback(data).
 * 7. params: When call getOptionData, we will call with this params
 * 
 * ############# Events #################
 * 1. onChange(value): Event when select change
 *
 * 
 * @author ThuanDD3
 * @since Jun, 2020
 */
class PickerDeviceInput extends React.PureComponent
{
    constructor(props)
    {
        super(props);

        this.state = {
            selectItem: this.props.value,
            params: this.props.params,
            visible: this.props.visible != undefined ? this.props.visible :  true,
            isValid: true
        }
    }

    componentWillReceiveProps(nextProps)
    {
        let newState = {};

        if (nextProps.params != this.props.params) {
            newState.params = nextProps.params;
        }

        if (nextProps.value != this.props.value) {
            newState.selectItem = nextProps.value;
        }

        if (nextProps.visible != this.props.visible) {
            newState.visible = nextProps.visible;
        }

        this.setState(newState);
    }

    componentDidMount()
    {
        if (this.state.selectItem) {
            setTimeout(() => {
                this.props.onChange(this.state.selectItem);
            }, 0);
            
        }
    }

    openOptionScreen()
    {
        NavigationService.navigate('SearchMultiPickerDynamic', {
            getOptionData: this.getOptionData.bind(this),
            onChange: this.onChange.bind(this),
            title: this.props.label,
            placeholder: this.props.filterText,
            selectItem: this.state.selectItem
        });
    }


    getOptionData(callback, isRefresh)
    {
        this.props.getOptionData && this.props.getOptionData(callback, {
            params: this.state.params,
            isRefresh: isRefresh
        });
    }


    onChange(selectedItem)
    {
        this.setState({
            selectItem: selectedItem,
            isValid: selectedItem && !this.state.isValid ? true : this.state.isValid
        });

        this.props.onChange && this.props.onChange(selectedItem);
    }

    setValid(isValid)
    {
        this.setState({
            isValid: isValid
        })
    }

    render()
    {
        if (! this.state.visible) {
            return null;
        }
        const validStyle = createValidStyleSheet(this.state.isValid);
        const countItem = this.state.selectItem && this.state.selectItem.length !== 0
            ? this.state.selectItem.length + ' item selected'
            : 0;

        return (

            <View style = {[styles.wrapper, validStyle.validStyleBorder]}>
                <View>
                    <Text style = {styles.label} >{ this.props.label }</Text>
                </View>
                <TouchableOpacity style={styles.fieldContainer} onPress={this.openOptionScreen.bind(this)}>
                    <Text style={[styles.textField, validStyle.validStyleText]}>
                    {
                        countItem ? countItem : this.props.placeholder
                    } 
                    </Text>
                    <Image style={[styles.ico, { tintColor: '#8a919a'}]} source={require('assets/images/tech-picker/down-arrow.png')} />
                </TouchableOpacity>
            </View>            
        );
    }
}

PickerDeviceInput.defaultProps = {
    onChange: () => {}
}

export default PickerDeviceInput;


const styles = StyleSheet.create({
    wrapper: {
        flexDirection:'row', alignItems: 'center', justifyContent: 'space-between', 
        minHeight: 40, paddingHorizontal: 12, 
        // marginVertical: 0, 
        marginBottom: 12,
        borderColor: '#d0d8e2',  borderWidth: 1, borderRadius: 5,
    },
    label: {
        fontSize: 12, 
        color: '#9a9a9a'
    },
    fieldContainer: {
        height: 37,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textField: {
        color: '#444', fontSize: 12, fontWeight: '500',
        marginRight: 15,
    },
    ico: { position: 'absolute', right: 0, top: '50%', marginTop: -5, width: 10, height: 10 },
});