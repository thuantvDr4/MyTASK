import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import SearchPickerDynamic from "./SearchPickerDynamic";
import SearchPickerCLKMItem from './SearchPickerCLKMItem';


/**
 * Search multiple select picker component
 * 
 * use: 
 * 		this.props.navigation.navigate('SearchPickerDynamic', {
 * 			onChange: (selectedItemList) => {
 * 				// To do: Callback function when picker selected and go back this screen
 * 			}, 
 *          title: "Địa chỉ lắp đặt",
 *          placeholder: "Nhap ten tinh thanh",
 *          allowRefresh: {true} // An hien nut refresh cache
 * 			getOptionData: (callback, isRefresh) => {
 *              // To do something
 *              callback(data);
 *          }
 *      })
 * 
 * @author DaiDP
 * @since Oct, 2018
 */
class SearchPickerCLKM extends SearchPickerDynamic
{
	/**
	 * Render item of Flatview
     * Rewrite
	 */
    _renderItem = ({item}) => (
        <TouchableOpacity onPress={() => { this._onChange(item) }}>
            <SearchPickerCLKMItem
                Name={item.Name}
                Description={item.Description}
                style={{marginHorizontal: 24}}
            />
        </TouchableOpacity>
    );

    render()
    {
        return super.render();
    }
}


export default SearchPickerCLKM;