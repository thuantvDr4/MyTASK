import React from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import {strings} from 'locales/i18n';

// LIB
import NavigationService from 'app-libs/helpers/NavigationService';
/**
 * Menu Pick Select Component with new screen
 * 
 * ############# Properties #############
 * 1. value: value selected
 * 2. getOptionData(callback, params): Call API to get data. When done, call callback(data).
 * 3. params: When call getOptionData, we will call with this params
 * 
 * ############# Events #################
 * 1. onChange(value): Event when select change
 * 
 * @author DaiDP
 * @since Aug, 2018
 * @modified ThuanDD3 - Mar, 2019
 */

class MenuPicker extends React.PureComponent {

    constructor(props) {
        super(props);
        
        this.state = {
            selectItem: this.props.value,
            selectDate: null,
        }
    }

    componentDidMount() {

        if (this.state.selectItem) {
            setTimeout(() => {
                this.props.onChange(this.state.selectItem);
            }, 0);
        }
    }

    componentWillReceiveProps(nextProps) {

        let newState = {};

        if (nextProps.value != this.props.value) {
            newState.selectItem = nextProps.value;
        }

        this.setState(newState);
    }


    /**************************************************
     * FUNCTION: openOptionScreen
     * DESC: Navigate den man hinh select
     * @param 
     * @private
     ***************************************************/
    openOptionScreen() {
        NavigationService.navigate('FilterPrechecklist', {
            getOptionData: this.getOptionData.bind(this),
            onChange: this.onChange.bind(this),
            selectItem: this.state.selectItem,
            selectDate: this.state.selectDate
        });
    }

    /**************************************************
     * FUNCTION: getOptionData
     * DESC: Bind function goi API vào màn hinh select
     * @param 
     * @private
     ***************************************************/
    getOptionData(callback) {
        this.props.getOptionData && this.props.getOptionData({}, callback);
    }

    /**************************************************
     * FUNCTION: 
     * DESC: Bind onChange vào man hình select
     * @param 
     * @private
     ***************************************************/
    onChange(selectedItem) {

        let { selectedItemList } = selectedItem;
        let selectDate = null;

        if (selectedItemList && Object.keys(selectedItemList).length == 0) {
            selectedItemList = null;
        }

        if (selectedItem.FromDate && selectedItem.ToDate) {
            selectDate = {
                FromDate : selectedItem.FromDate,
                ToDate : selectedItem.ToDate,
            }
        }

        // Set lai state va gan lại khi bam vao picker menu lan nua
        this.setState({
            selectItem: selectedItemList,
            selectDate: selectDate
        });

        // Gọi onChange từ màn hình cha vào xử lý tiếp
        this.props.onChange && this.props.onChange(selectedItem);
    }

    render() {
        return (
            <View style={[styles.fieldContainer]}>
                <TouchableOpacity onPress={this.openOptionScreen.bind(this)} >
                    <Image source={require('../../../assets/images/contract-list/ic_24Filter.png')} />
                </TouchableOpacity>
            </View>
        );
    }
}

MenuPicker.defaultProps = {
    onChange: () => {}
}

export default MenuPicker;

const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 50, 
        marginBottom: 10, 
        borderBottomWidth: 1, 
        borderBottomColor: '#ccc'
    },
    headerText: {
        fontSize: 18, 
        fontWeight: 'bold'
    },
    optionContainer: {
        borderWidth: 1, 
        borderColor: '#9eceff', 
        marginHorizontal: 10, 
        marginVertical: 4, 
        borderRadius: 6, 
        justifyContent: 'center', 
        alignItems:'center', 
        flexDirection: 'row'
    },
    optionText: {
        color: '#0b76ff',
        fontSize: 14,
        alignSelf: 'flex-start', 
        paddingVertical: 16, 
        paddingHorizontal: 10
    },
    fieldContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center'
    }
});