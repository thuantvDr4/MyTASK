import React from 'react';
import {View, FlatList, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

/**
 * Search multiple select picker component
 * 
 * use: 
 * 		this.props.navigation.navigate('SearchMultiPicker', {
 * 			onChange: (selectedItemList) => {
 * 				// To do: Callback function when picker selected and go back this screen
 * 			}, 
 *          title: "Địa chỉ lắp đặt",
 *          placeholder: "Nhap ten tinh thanh",
 * 			dataSource: [
 * 				{"Id": 123, "Name": "Ten abc"}
 * 			] 
 *      })
 * 
 * @author DaiDP
 * @since Aug, 2018
 */
class SearchMultiPicker extends React.PureComponent 
{
	/**
	 * Config navigation bar
	 */
    static navigationOptions = ({navigation, navigationOptions}) => {
		return {
			...navigationOptions,
			headerStyle: {
				...navigationOptions.headerStyle,
				elevation: 0
			},
			headerTitleStyle: {
				...navigationOptions.headerTitleStyle,
				width: '70%'
			},
			title: navigation.getParam('title', 'Config title here')
		}
    };

	data = [];

    constructor(props)
    {
		super(props);

		// Get data fetch to list
		data = this.props.navigation.getParam('dataSource', []);
		
		// init state
        this.state = {
            dataSource: data,
            text: '',
            selectedItems: []
        }

        // bind event
        this.onConfirm = this.onConfirm.bind(this);
        this._onSelect = this._onSelect.bind(this);
        this._filterSearch = this._filterSearch.bind(this);
    }

	/**
	 * Process filter data on list
	 * 
	 * @param {*} text 
	 */
    _filterSearch(text) {
        const newData = this._getFilterData(text);

        this.setState({
            text: text,
            dataSource: newData
        });
    }

    _getFilterData(text)
    {
        return data.filter((item) => {
            const itemData = item.Name.toUpperCase();
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1; 
        });
    }

    onConfirm()
    {
        let selectedItemList = this.state.selectedItems;
        for (index in selectedItemList) {
            delete selectedItemList[index].isSelected;
        }

        this.props.navigation.goBack();
        this.props.navigation.state.params.onChange(selectedItemList);
    }

	/**
	 * Callback when select item on list
	 * 
	 * @param {*} selectItem 
	 */
    _onSelect(selectItem)
    {
        // Khoi tao data
        let listSelected = this.state.selectedItems;
        let isSelected   = true;
        let index        = listSelected.findIndex(item => item.Id === selectItem.Id);

        // Kiem tra action la chon hay bo chon
        if (index > -1) {
            listSelected.splice(index, 1);
            isSelected = false;
        }
        else {
            listSelected.push(selectItem);
        }

        // Danh dau trang thai cho dataSource
        index = data.findIndex(item => item.Id === selectItem.Id);
        data[index].isSelected = isSelected;

        // Cap nhat list lai
        const newData = this._getFilterData(this.state.text);

        this.setState({
            ...this.state,
            selectedItems: listSelected,
            dataSource: newData
        });
    }

	/**
	 * Render item of Flatview
	 */
    _renderItem = ({item}) => {
        const isSelected = item.isSelected | false;

        if (isSelected)
        {
            return (
                <TouchableOpacity onPress={() => { this._onSelect(item) }}>
                    <View style={ [styles.optionContainer, styles.optionBorderSeleted] }>
                        <Text style={ [styles.optionText, styles.optionTextSeleted] }>{item.Name}</Text>
                        <Icon name="check" size={16} style={ [styles.optionIcon, styles.optionTextSeleted] }/>
                    </View>
                </TouchableOpacity>
            );
        }
        else
        {
            return (
                <TouchableOpacity onPress={() => { this._onSelect(item) }}>
                    <View style={styles.optionContainer}>
                        <Text style={styles.optionText}>{item.Name}</Text>
                        <Icon name="check" size={16} style={styles.optionIcon}/>
                    </View>
                </TouchableOpacity>
            );
        }
        
    }

	/**
	 * Render view
	 */
    render()
    {
		const placeholder = this.props.navigation.getParam('placeholder', '');

        return (
            <View style={{ flex:1}}>
                <View style={styles.searchBar}>
                    <View style={styles.searchInput}>
                        <Icon name="search" size={16} style={styles.icon}/>
                        <TextInput
                            style={styles.input}
                            placeholder={placeholder}
                            value={this.state.text}
                            onChangeText={(text) => this._filterSearch(text)}
                            underlineColorAndroid='rgba(0,0,0,0)'
                        />
                    </View>
                </View>
                
                <View style={styles.optionWraper}>
                    <FlatList
                        data={this.state.dataSource}
                        renderItem={this._renderItem}
                    />
                </View>
                
                <View style={styles.confirmBar}>
                    <TouchableOpacity style={styles.button} onPress={this.onConfirm}>
                        <Text style={styles.buttonText}>Xác nhận</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}


export default SearchMultiPicker;

const styles = StyleSheet.create({
    searchBar: {
        backgroundColor: '#0B76FF',
        minHeight: 60,
        maxHeight: 60,
        height: 60,
        flex: 0.01
    },
    searchInput: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginHorizontal: 32,
        marginBottom: 16,
        minHeight: 40,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10
    },
    icon: {
        marginHorizontal: 12
    },
    input: {
        flex: 1,
        minHeight: 40,
        height: 40
    },

    optionWraper: {
        paddingTop: 10,
        paddingBottom: 5,
        flex: 1
    },
    optionContainer: {
        borderWidth: 1, 
        borderColor: '#9ec9ff', 
        marginHorizontal: 24, 
        marginVertical: 6, 
        borderRadius: 5, 
        justifyContent: 'center', 
        alignItems:'center', 
        flexDirection: 'row'
    },
    optionText: {
        alignSelf: 'flex-start', 
        paddingHorizontal: 10,
        color: '#9ec9ff',
        fontSize: 14,
        lineHeight: 48
    },
    optionIcon: {
        position: 'absolute',
        right: 15,
        color: '#9ec9ff',
    },
    optionBorderSeleted: {
        borderColor: '#0b76ff', 
    },
    optionTextSeleted: {
        color: '#0b76ff',
    },

    confirmBar: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(154,154,154,0.4)'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0B76FF',
        height: 48,
        borderRadius: 5,
        zIndex: 100,
        marginHorizontal: 25,
        marginBottom: 24, marginTop: 10,
        shadowColor: '#9EC9FF',
        shadowOffset: {width: 0, height: 10},
        shadowOpacity: 0.75,
        shadowRadius: 7,
        elevation: 10,
    },
    buttonText: {
        color: 'white',
        backgroundColor: 'transparent',
        fontSize: 20,
    }
});