import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import NavigationService from 'app-libs/helpers/NavigationService';
import createValidStyleSheet from 'app-libs/helpers/ValidStyleSheet';

/**
 * Picker search with new screen
 * 
 * ############# Properties #############
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
 * @author DaiDP
 * @since Aug, 2018
 * @edited ThuanDD3
 * @editTime May, 2019
 */
class PickerSearchLocation extends React.PureComponent
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
        NavigationService.navigate('SearchPickerDynamic', {
            getOptionData: this.getOptionData.bind(this),
            onChange: this.onChange.bind(this),
            title: this.props.label,
            placeholder: this.props.filterText,
            allowRefresh: this.props.allowRefresh == undefined ? true : this.props.allowRefresh
        });
    }


    getOptionData(callback, isRefresh)
    {
        this.props.getOptionData(callback, {
            params: this.state.params,
            isRefresh: isRefresh
        });
    }


    onChange(selectedItem)
    {
        this.setState({
            selectItem: selectedItem,
            isValid: selectedItem.Id && !this.state.isValid ? true : this.state.isValid
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
        const {selectItem} = this.state;

        return (
            <View style = {[styles.wrapper, validStyle.validStyleBorder]}>
                <TouchableOpacity style={styles.fieldContainer} onPress={this.openOptionScreen.bind(this)}>
                    <Text style={[styles.textField, validStyle.validStyleText]}>{selectItem ? selectItem.Name : this.props.placeholder} </Text>
                    <Image style={[styles.ico, { tintColor: '#fff'}]} source={require('assets/images/tech-picker/down-arrow.png')} />
                </TouchableOpacity>
            </View>            
        );
    }
}

PickerSearchLocation.defaultProps = {
    onChange: () => {}
};

export default PickerSearchLocation;


const styles = StyleSheet.create({
    wrapper: {
        minHeight: 40, paddingHorizontal: 0, 
        borderColor: '#d0d8e2', borderWidth: 1, borderRadius: 5,
    },
    fieldContainer: {
        height: 37, paddingHorizontal: 5,
        alignItems: 'stretch', justifyContent: 'center',
    },
    textField: {
        color: '#fff', fontSize: 14, fontWeight: '500',
        marginRight: 0,
    },
    ico: { position: 'absolute', right: 5, top: '50%', marginTop: -5, width: 10, height: 10 },
});